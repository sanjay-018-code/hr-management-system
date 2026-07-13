import { apiClient } from "../utils/api-client";

export async function get_all_leaves(){
    const { data } = await apiClient.get("/leave/")
    return data
}

export async function get_leaves_for_date(date) {
    const { data } = await apiClient.get('/leave/')
    return data.filter((leave) => {
        if (!leave?.start_date || !leave?.end_date) return false
        const start = new Date(`${leave.start_date}T00:00:00`)
        const end = new Date(`${leave.end_date}T00:00:00`)
        const target = new Date(`${date}T00:00:00`)
        return target >= start && target <= end
    })
}

export async function update_leave_status(leaveId, status){
    const { data } = await apiClient.patch(`/leave/${leaveId}`, { status })
    return data
}
