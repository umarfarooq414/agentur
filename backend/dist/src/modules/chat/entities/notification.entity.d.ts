export declare class Notification {
    id: string;
    readonly createdAt: Date;
    seen: boolean;
    sender: string;
    receiver: string;
    readonly updatedAt: Date;
    setMessageAsSeen(): void;
}
