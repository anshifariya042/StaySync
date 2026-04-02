import api from "@/lib/api";

export const getChatHistory = async (complaintId: string) => {
    const response = await api.get(`/chat/${complaintId}`);
    return response.data;
};

export const saveChatMessage = async (messageData: {
    complaintId: string;
    senderId: string;
    receiverId: string;
    message: string;
    messageType?: "text" | "image" | "file";
    fileUrl?: string;
}) => {
    const response = await api.post("/chat", messageData);
    return response.data;
};
