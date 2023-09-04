import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { GlobalResponseDto, ResetPasswordRequestDto, UpdateUserRequestDto } from '@lib/dtos';
import { AuthService } from '../auth/auth.service';
import { UpdateDocumentStatusDto, UploadContractDto, UploadDocumentsDto } from '@lib/dtos/project/uploadContract';
export declare class UserController {
    private readonly userService;
    private readonly authService;
    constructor(userService: UserService, authService: AuthService);
    approveUser(token: {
        authorization: string;
    }): Promise<User[]>;
    getUserById(id: string): Promise<User>;
    getUserByToken(id: string): Promise<User>;
    updateUser(body: UpdateUserRequestDto, id: string): Promise<User>;
    resetPassword(resetPasswordRequestDto: ResetPasswordRequestDto, email: string): Promise<GlobalResponseDto>;
    uploadContract(token: string, file: any, body: UploadContractDto): Promise<import("./entities/document.entity").Documents>;
    updateDocumentStatus(token: string, body: UpdateDocumentStatusDto): Promise<import("./entities/document.entity").Documents>;
    getDocuments(userId: string): Promise<import("./entities/document.entity").Documents[]>;
    uploadDocuments({ userId }: UploadDocumentsDto, files: any): Promise<{
        success: boolean;
        message: string;
    }>;
}
