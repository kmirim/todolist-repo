import axios, { AxiosError, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import { showLoading, hideLoading } from './components/ui/loading'

const API = "http://localhost:8081/api"

export class BaseService<T> {
    private api = axios.create({
        baseURL: API,
        timeout: 100000,
        headers: {
            'content-type': 'application/json',
        },
        responseType: 'json',
        withCredentials: true,
        validateStatus: status => (status >= 200 && status < 300)
    }) 
    constructor(baseURL: string) {
        this.api = axios.create({baseURL})

        this.api.interceptors.request.use(
            (config:InternalAxiosRequestConfig) => {
                showLoading()
                return config
            },
            (error) =>{
                hideLoading()
                return Promise.reject(error)
            }
        )

        this.api.interceptors.response.use(
            (response: AxiosResponse) => {
                hideLoading()
                return response
            },
            (error) => {
                hideLoading()
                console.error('Error na API: ', error)
                return Promise.reject(error)
            }
        )
    }
    
    public post(path: string, data: T): Promise<AxiosResponse<T>> {
        return this.api.post<T>(path, data)
    }
    public get(path: string): Promise<AxiosResponse<T>> {
        return this.api.post<T>(path)
    }

}