import { DocumentNameEnum, DocumentStatusEnum } from '@lib/types';
export declare class UploadContractDto {
    readonly userId: string;
    readonly name: DocumentNameEnum;
}
export declare class UpdateDocumentStatusDto {
    readonly userId: string;
    readonly status: DocumentStatusEnum;
    readonly documentId: string;
    readonly reason: string;
}
export declare class UploadDocumentsDto {
    readonly userId: string;
}
