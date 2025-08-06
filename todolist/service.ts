import axios, { AxiosError, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios'

export class BaseService<T> {
    private api = axios.create()
    
    constructor(baseURL: string) {
        this.api = axios.create({
            baseURL,
            timeout: 100000,
            headers: {
                'content-type': 'application/json',
            },
            responseType: 'json',
            withCredentials: true,
            validateStatus: status => (status >= 200 && status < 300)
        })

        this.api.interceptors.request.use(
            (config: InternalAxiosRequestConfig) => {
                return config
            },
            (error) => {
                return Promise.reject(error)
            }
        )

        this.api.interceptors.response.use(
            (response: AxiosResponse) => {
                return response
            },
            (error) => {
                console.error('Error na API: ', error)
                return Promise.reject(error)
            }
        )
    }
    
    public post(path: string, data: Partial<T>): Promise<AxiosResponse<T>> {
        return this.api.post<T>(path, data)
    }
    
    public get(path: string, params?:AxiosRequestConfig): Promise<AxiosResponse<T>> {
        return this.api.get<T>(path, { params })
    }

    public put(path: string, data: Partial<T>): Promise<AxiosResponse<T>>{
        return this.api.put<T>(path, data)
    }

    public delete(path: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>{
        return this.api.delete<T>(path, config)
    }

}