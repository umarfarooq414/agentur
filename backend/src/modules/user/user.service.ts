/* eslint-disable prettier/prettier */
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { In, Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import {
  ConfigEnum,
  DocumentNameEnum,
  DocumentStatusEnum,
  IServerConfig,
  IUserParams,
  ServerConfigEnum,
  UserRoleEnum,
  UserStatusEnum,
} from '@lib/types';
import { AuthHelper } from '../auth/auth.helper';
import { GlobalResponseDto, UpdateUserRequestDto } from '@lib/dtos';
import {
  UpdateDocumentStatusDto,
  UploadContractDto,
} from '@lib/dtos/project/uploadContract';
import { CloudinaryConfigService } from '@config/cloudinaryConfig';
import { Documents } from './entities/document.entity';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Documents)
    private documentRepository: Repository<Documents>,
    @Inject(ConfigService)
    private config: ConfigService,
    @Inject(AuthHelper)
    private readonly helper: AuthHelper,
    private cloudinary: CloudinaryConfigService,
  ) {}

  async createAdmin() {
    const isAdminExit = await this.userRepository.findOne({
      where: {
        role: UserRoleEnum.ADMIN,
        userName: `Support`,
      },
    });
    if (isAdminExit) return;
    const isSupport2Exit = await this.userRepository.findOne({
      where: {
        role: UserRoleEnum.ADMIN,
        userName: `Support2`,
      },
    });
    if (isSupport2Exit) return;
    const adminDetail: IServerConfig[ServerConfigEnum.ADMIN] =
      this.config.get<IServerConfig>(ConfigEnum.SERVER).admin;
    const adminSupport2Detail: IServerConfig[ServerConfigEnum.SUPPORT2] =
      this.config.get<IServerConfig>(ConfigEnum.SERVER).support2;
    const adminUser: IUserParams = {
      ...adminDetail,
      role: UserRoleEnum.ADMIN,
      status: UserStatusEnum.ACTIVE,
    };
    const support2User: IUserParams = {
      ...adminSupport2Detail,
      role: UserRoleEnum.ADMIN,
      status: UserStatusEnum.ACTIVE,
    };
    const admin = new User(adminUser);
    const adminSupport2 = new User(support2User);

    const hashedPasswordAdmin = await this.helper.encodePassword(
      adminDetail.password,
    );
    const hashedPasswordSupport2 = await this.helper.encodePassword(
      adminSupport2Detail.password,
    );
    admin.setPassword(hashedPasswordAdmin);
    adminSupport2.setPassword(hashedPasswordSupport2);
    this.userRepository.save(admin);
    this.userRepository.save(adminSupport2);
    return;
  }

  async getAllUsers(token: string): Promise<User[]> {
    const tokenValue = token.split(' ')[1];
    const decoded: any = await this.helper.decode(tokenValue);
    const { role } = decoded;
    if (role === UserRoleEnum.ADMIN) {
      return this.userRepository.find({
        where: {
          role: UserRoleEnum.MEMBER,
        },
      });
    }
  }

  async getAllActiveUsers(role: UserRoleEnum): Promise<User[]> {
    if (role === UserRoleEnum.ADMIN) {
      return this.userRepository.find({
        where: {
          role: UserRoleEnum.MEMBER,
          status: UserStatusEnum.ACTIVE,
        },
      });
    }
  }

  async getUserById(id: string): Promise<User> {
    return this.userRepository.findOne({
      where: {
        id,
      },
    });
  }

  async getMultiUserById(id: string[]): Promise<string[]> {
    const users: User[] = await this.userRepository.find({
      where: {
        id: In(id),
      },
    });
    return users.map((user) => user.id);
  }

  async updateUser(body: UpdateUserRequestDto, id: string): Promise<User> {
    const updateUser = await this.userRepository.findOneBy({
      id,
    });
    if (body.firstName) updateUser.setFirstName(body.firstName);
    if (body.lastName) updateUser.setLastName(body.lastName);
    return this.userRepository.save(updateUser);
  }

  async uploadContract(token: string, file, body: UploadContractDto) {
    try {
      const tokenValue = token.split(' ')[1];
      const decoded = await this.helper.decode(tokenValue as string);
      const admin = decoded ? await this.helper.validateUser(decoded) : null;
      const user = await this.userRepository.findOneBy({ id: body.userId });

      if (!admin || !user)
        throw new HttpException('User not found!', HttpStatus.NOT_FOUND);
      if (admin.role !== UserRoleEnum.ADMIN)
        throw new HttpException('User must be Admin!', HttpStatus.UNAUTHORIZED);

      let result;
      let url;

      if (file) {
        result = await this.cloudinary.uploadImage(file).catch(() => {
          throw new BadRequestException('Invalid file type.');
        });
        url = result.url;

        const existingDocument = await this.documentRepository.findOne({
          where: {
            user: { id: user.id },
            name: body.name,
          },
        });

        if (existingDocument) {
          existingDocument.link = url;
          await this.documentRepository.save(existingDocument);
          return existingDocument;
        } else {
          const document = new Documents();
          document.name = body.name;
          document.link = url;
          document.user = user;
          return await this.documentRepository.save(document);
        }
      }
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async updateDocumentStatus(token: string, body: UpdateDocumentStatusDto) {
    try {
      const { status, userId, documentId, reason } = body;
      const tokenValue = token.split(' ')[1];
      const decoded = await this.helper.decode(tokenValue as string);
      const admin = decoded ? await this.helper.validateUser(decoded) : null;
      const user = await this.userRepository.findOneBy({ id: userId });

      if (!admin || !user)
        throw new HttpException('User not found!', HttpStatus.NOT_FOUND);
      if (admin.role !== UserRoleEnum.ADMIN)
        throw new HttpException('User must be Admin!', HttpStatus.UNAUTHORIZED);
      const document = await this.documentRepository.findOne({
        where: {
          user: { id: user.id },
          id: documentId,
        },
      });
      if (!document)
        throw new HttpException('Document not found!', HttpStatus.NOT_FOUND);
      if (reason) {
        document.reason = reason;
      }
      document.status = status;
      const res = await this.documentRepository.save(document);
      const documents = await this.documentRepository.find({
        where: {
          user: { id: user.id },
        },
      });
      let count = 0;
      documents.forEach(async (doc) => {
        if (doc.status === DocumentStatusEnum.APPROVED) {
          if (doc.name === DocumentNameEnum.CONTRACT) {
            count++;
          }
          if (doc.name === DocumentNameEnum.ID_BACK) {
            count++;
          }
          if (doc.name === DocumentNameEnum.ID_FRONT) {
            count++;
          }
          if (doc.name === DocumentNameEnum.SELFIE) {
            count++;
          }
        }
      });
      const activated: boolean = count === 4;
      if (activated) {
        user.status = UserStatusEnum.ACTIVE;
        await this.userRepository.save(user);
      }
      return res;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async getDocuments(userId: string) {
    try {
      const user = await this.userRepository.findOneBy({ id: userId });
      if (!user)
        throw new HttpException('User not found!', HttpStatus.NOT_FOUND);

      return await this.documentRepository.findBy({ user: { id: user.id } });
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async uploadDocuments(id: string, files) {
    try {
      const user = await this.userRepository.findOneBy({ id });
      let message: string = '';
      let result
      if (!user)
        throw new HttpException('User not found!', HttpStatus.NOT_FOUND);

      const documentMappings = {
        idFront: DocumentNameEnum.ID_FRONT,
        idBack: DocumentNameEnum.ID_BACK,
        contract: DocumentNameEnum.CONTRACT,
        selfie: DocumentNameEnum.SELFIE,
      };

      for (const [fileKey, documentName] of Object.entries(documentMappings)) {
        const file = files?.[fileKey]?.[0];
        if (file) {
          const existingDocument = await this.documentRepository.findOne({
            where: {
              user: { id: user.id },
              name: documentName,
            },
          });

          if (existingDocument) {
             result = await this.cloudinary.uploadImage(file).catch(() => {
               throw new BadRequestException('Invalid file type.');
             });
            existingDocument.link = result?.url;
            const res = await this.documentRepository.save(existingDocument);
            if (res) {
              message = 'Document successfully uploaded!';
            }
          } else {
            const document = new Documents();
             result = await this.cloudinary.uploadImage(file).catch(() => {
               throw new BadRequestException('Invalid file type.');
             });
            document.name = documentName;
            document.link = result?.url;
            document.user = user;
            const res = await this.documentRepository.save(document);
            if (res) message = 'Document successfully uploaded!';
          }
        }
      }

      return new GlobalResponseDto(message);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
}
