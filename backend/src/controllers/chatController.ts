import { Request, Response } from "express";
import { ChatMessage } from "../models/ChatMessage";
import { Complaint } from "../models/Complaint";

export const getChatHistory = async (req: Request, res: Response) => {
    try {
        const { complaintId } = req.params;
        const messages = await ChatMessage.find({ complaintId })
            .sort({ createdAt: 1 })
            .populate("senderId", "name role")
            .populate("receiverId", "name role");

        res.status(200).json({
            success: true,
            data: messages,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch chat history.",
            error: error.message,
        });
    }
};

export const saveMessage = async (req: Request, res: Response) => {
    try {
        const { complaintId, senderId, receiverId, message, messageType, fileUrl } = req.body;

        const newMessage = new ChatMessage({
            complaintId,
            senderId,
            receiverId,
            message,
            messageType,
            fileUrl,
        });

        await newMessage.save();

        res.status(201).json({
            success: true,
            data: newMessage,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: "Failed to save message.",
            error: error.message,
        });
    }
};
