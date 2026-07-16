import { apiClient } from "../utils/api-client";

export async function get_all_leaves(){
    const { data } = await apiClient.get("/leave/")
    return data
}

export async function get_leaves_for_date(date) {
    const { data } = await apiClient.get(`/leave/approved/${date}`)
    return data
}

export async function update_leave_status(leaveId, status){
    const { data } = await apiClient.patch(`/leave/${leaveId}`, { status })
    return data
}
