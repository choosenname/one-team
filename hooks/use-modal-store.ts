import {Channel, ChannelType, Message, Server, User} from "@prisma/client";
import { create } from "zustand";

export type ModalType = "createServer" | "createServerAdmin" | "invite" | "editServer" | "members" | "createChannel"
    | "leaveServer" | "deleteServer"  | "deleteChannel" | "editChannel" | "messageFile" | "deleteMessage"
    | "editProfile" | "forwardMessage" | "chatImage";

interface ModalData {
    user?: User;
    server?: Server;
    channel?: Channel;
    message?: Message;
    conversationId?: string;
    channelType?: ChannelType;
    apiUrl?: string;
    query?: Record<string, any>;
}

interface ModalStore {
    type: ModalType | null;
    data: ModalData;
    isOpen: boolean;
    onOpen: (type: ModalType, data?: ModalData) => void;
    onClose: () => void;
}

export const useModal = create<ModalStore>((set) => ({
    type: null,
    data: {},
    isOpen: false,
    onOpen: (type, data = {}) => set({ isOpen: true, type, data }),
    onClose: () => set({ type: null, isOpen: false })
}));