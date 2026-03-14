import api from '../lib/api';

export const getDashboardOverview = async () => {
    const response = await api.get('/admin/dashboard-overview');
    return response.data;
};

export const getRooms = async (hostelId: string, search?: string) => {
    const url = search ? `/hostels/${hostelId}/rooms?search=${encodeURIComponent(search)}` : `/hostels/${hostelId}/rooms`;
    const response = await api.get(url);
    return response.data;
};

export const getResidents = async (hostelId: string, search?: string) => {
    const url = search ? `/hostels/${hostelId}/residents?search=${encodeURIComponent(search)}` : `/hostels/${hostelId}/residents`;
    const response = await api.get(url);
    return response.data;
};

export const getComplaints = async (hostelId: string, search?: string, page: number = 1, limit: number = 10, userId?: string) => {
    let url = `/hostels/${hostelId}/complaints?page=${page}&limit=${limit}`;
    if (search) url += `&search=${encodeURIComponent(search)}`;
    if (userId) url += `&userId=${userId}`;
    const response = await api.get(url);
    return response.data;
};

export const getStaff = async (hostelId: string, search?: string) => {
    const url = search ? `/hostels/${hostelId}/staff?search=${encodeURIComponent(search)}` : `/hostels/${hostelId}/staff`;
    const response = await api.get(url);
    return response.data;
};

// Room management
export const addRoom = async (roomData: any) => {
    const response = await api.post('/hostels/rooms', roomData);
    return response.data;
};

export const updateRoom = async (roomId: string, roomData: any) => {
    const response = await api.put(`/hostels/rooms/${roomId}`, roomData);
    return response.data;
};

export const deleteRoom = async (roomId: string) => {
    const response = await api.delete(`/hostels/rooms/${roomId}`);
    return response.data;
};

// Resident management
export const addResident = async (residentData: any) => {
    const response = await api.post('/hostels/residents', residentData);
    return response.data;
};

export const deleteResident = async (residentId: string) => {
    const response = await api.delete(`/hostels/residents/${residentId}`);
    return response.data;
};

// Staff management
export const addStaff = async (staffData: any) => {
    const response = await api.post('/hostels/staff', staffData);
    return response.data;
};

export const updateStaff = async (staffId: string, staffData: any) => {
    const response = await api.put(`/hostels/staff/${staffId}`, staffData);
    return response.data;
};

export const deleteStaff = async (staffId: string) => {
    const response = await api.delete(`/hostels/staff/${staffId}`);
    return response.data;
};

// Complaint management
export const updateComplaintStatus = async (complaintId: string, status: string) => {
    const response = await api.put(`/hostels/complaints/${complaintId}/status`, { status });
    return response.data;
};

export const assignStaff = async (complaintId: string, staffId: string) => {
    const response = await api.put(`/hostels/complaints/${complaintId}/assign`, { staffId });
    return response.data;
};
