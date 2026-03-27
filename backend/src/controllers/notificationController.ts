import { Request, Response } from "express";
import Notification from "../models/Notification";

export const getUserNotifications = async (req: any, res: Response) => {
    try {
        const notifications = await Notification.find({ userId: req.user.id })
            .sort({ createdAt: -1 }) // Newest first
            .limit(20);
            
        res.status(200).json(notifications);
    } catch (error: any) {
        console.error("Error fetching notifications:", error);
        res.status(500).json({ message: "Failed to fetch notifications" });
    }
};

export const markAsRead = async (req: any, res: Response) => {
    try {
        const { id } = req.params;
        const notification = await Notification.findOneAndUpdate(
            { _id: id, userId: req.user.id },
            { isRead: true },
            { new: true }
        );

        if (!notification) {
            return res.status(404).json({ message: "Notification not found" });
        }

        res.status(200).json(notification);
    } catch (error: any) {
        console.error("Error marking notification as read:", error);
        res.status(500).json({ message: "Failed to mark notification as read" });
    }
};

export const markAllAsRead = async (req: any, res: Response) => {
    try {
        await Notification.updateMany(
            { userId: req.user.id, isRead: false },
            { isRead: true }
        );
        res.status(200).json({ message: "All notifications marked as read" });
    } catch (error: any) {
        console.error("Error marking all as read:", error);
        res.status(500).json({ message: "Failed to mark all as read" });
    }
};
