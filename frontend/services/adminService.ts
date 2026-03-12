import api from '../lib/api';

export const getDashboardOverview = async () => {
    const response = await api.get('/admin/dashboard-overview');
    return response.data;
};

export const getRooms = async (hostelId: string) => {
    const response = await api.get(`/hostels/${hostelId}/rooms`);
    return response.data;
};

export const getResidents = async (hostelId: string) => {
    const response = await api.get(`/hostels/${hostelId}/residents`);
    return response.data;
};

export const getComplaints = async (hostelId: string) => {
    const response = await api.get(`/hostels/${hostelId}/complaints`);
    return response.data;
};

export const getStaff = async (hostelId: string) => {
    const response = await api.get(`/hostels/${hostelId}/staff`);
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
