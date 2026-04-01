import api from "@/lib/api";

export const getStaffStats = async () => {
    const response = await api.get("/staff/stats");
    return response.data;
};

export const getStaffTasks = async (params?: { status?: string; priority?: string; search?: string; limit?: number }) => {
    const response = await api.get("/staff/tasks", { params });
    return response.data;
};

export const acceptTask = async (taskId: string) => {
    const response = await api.put(`/staff/tasks/${taskId}/accept`);
    return response.data;
};

export const updateTaskStatus = async (taskId: string, status: string) => {
    const response = await api.put(`/staff/tasks/${taskId}/status`, { status });
    return response.data;
};
