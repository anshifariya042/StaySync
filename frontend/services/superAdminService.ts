import api from '../lib/api';

export const getHostelApprovals = async (status: string = 'all', search: string = '', page: number = 1, limit: number = 10) => {
    let url = `/superadmin/hostel-approvals?status=${status}&page=${page}&limit=${limit}`;
    if (search) {
        url += `&search=${encodeURIComponent(search)}`;
    }
    const response = await api.get(url);
    return response.data;
};

export const approveRejectHostel = async (id: string, status: 'approved' | 'rejected') => {
    const response = await api.put(`/superadmin/approve-hostel/${id}`, { status });
    return response.data;
};
