"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatDto = void 0;
class ChatDto {
    constructor(chat) {
        this.email = chat.email;
        this.message = chat.message;
        if (chat.status)
            this.status = chat.status;
        if (chat.role)
            this.role = chat.role;
    }
}
exports.ChatDto = ChatDto;
//# sourceMappingURL=chat.js.map