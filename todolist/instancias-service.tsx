import { BaseService } from "@/service"
import { AxiosResponse } from 'axios'
import { Task } from "./controller"

const API = "http://localhost:8081"

const baseService = new BaseService<any>(API)

export interface TaskFilters{
    status?: 'pendente' | 'em-andamento' | 'concluida'
    title?: string 
    description?: string
    createdAt?: string
    deadLine?: string
}

export interface TaskResponse{
    content: Task[]
    totalElements: number
    // totalPages:number
    number: number
    size:number 
    first: boolean
    last: boolean
}

// export interface PaginationParams{
//     page?: number
//     size?: number
//     sort?: string
//     direction?: 'asc' | 'desc'
// }


export const TaskService = {
    getAll(
        filters: TaskFilters = {},
        page: number,
        size: number,
        sort: string,
    ): Promise<AxiosResponse<TaskResponse>> {
        const queryParams = Object.keys(filters)
        .filter(key => filters[key as keyof TaskFilters] !== undefined)
        .map((key: string) => `${key}=${encodeURIComponent(filters[key as keyof TaskFilters] as string)}`)
        .join("&")

        return baseService.get(
            `/api/task?page=${page}&size=${size}&sort=${sort},desc&${
                queryParams ? `&${queryParams}` : ""
            }`
        )
    },

    create(request: Partial<Task>): Promise<AxiosResponse<Task>> {
        return baseService.post(`/api/task`, request)
    },

    getById(id: string): Promise<AxiosResponse<Task>>{
        return baseService.get(`api/task/${id}`)
    },
    update(id: string, request: Partial<Task>): Promise<AxiosResponse<Task>>{
        return baseService.put(`/api/task/${id}`, request)
    },
    updateStatus(id:string, status: Task['status']): Promise<AxiosResponse<Task>>{
        return baseService.put(`/api/task/${id}/status`, { status } )
    },
    remove(id: string):Promise<AxiosResponse<void>>{
        return baseService.delete(`/api/task/${id}`)
    }
}

