import { BaseService } from "@/service"
import { AxiosResponse } from 'axios'
import { Task } from "./controller"

const API = "http://localhost:8081"

const baseService = new BaseService<any>(API)

export const TaskService = {
    getAll(
        filters: any,
        page: number,
        size: number,
        sort: string,
    ): Promise<AxiosResponse<Task[]>> {
        const queryParams = Object.keys(filters)
        .map((key: string) => `${key}=${filters[key]}`)
        .join("&")
        return baseService.get(
            `/api/task?page=${page}&size=${size}&sort=${sort},desc&${
                queryParams ? `&${queryParams}` : ""
            }`
        )
    },

    create(request: Task): Promise<AxiosResponse<Task>> {
        return baseService.post(`/api/task`, request)
    },
}

