import { Task } from "@/controller";

export const UI_CONFIG = {
    taskStatus:{
        colors:{
            pendente: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
            "em-andamento": "bg-blue-100 text-blue-800 hover:bg-blue-200",
            concluida: "bg-green-100 text-green-800 hover:bg-green-200",
        } as Record<Task["status"], string>,
        labels:{
            pendente: "Pendente",
            "em-andamento": "Em Andamento",
            concluida: "Concluída",
        } as Record<Task["status"], string>
    }
}

export const TASK_STATUS_COLORS = UI_CONFIG.taskStatus.colors
export const TASK_STATUS_LABELS = UI_CONFIG.taskStatus.labels