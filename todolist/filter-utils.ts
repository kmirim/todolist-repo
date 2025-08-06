export interface Task {
    id: string
    title: string
    description: string
    status: "pendente" | "em-andamento" | "concluida"
    createdAt: string | Date
    deadline: string | Date
    timeSpent?: number
}

export interface FilterOptions {
    status: string
    deadlineFilter: string
    dateFrom: string
    dateTo: string
}

export const filterTasks = (tasks: Task[], filters: FilterOptions): Task[] => {
    return tasks.filter((task) => {
        // Filtro por status
        if (filters.status !== "todos" && task.status !== filters.status) {
            return false
        }

        // Filtro por prazo
        if (filters.deadlineFilter !== "todos") {
            const taskDeadline = new Date(task.deadline)
            const today = new Date()
            const tomorrow = new Date(today)
            tomorrow.setDate(tomorrow.getDate() + 1)

            const startOfWeek = new Date(today)
            startOfWeek.setDate(today.getDate() - today.getDay())

            const endOfWeek = new Date(startOfWeek)
            endOfWeek.setDate(startOfWeek.getDate() + 6)

            const nextMonth = new Date(today)
            nextMonth.setMonth(today.getMonth() + 1)

            switch (filters.deadlineFilter) {
                case "vencidas":
                    if (taskDeadline >= today || task.status === "concluida") return false
                    break
                case "hoje":
                    if (taskDeadline.toDateString() !== today.toDateString()) return false
                    break
                case "amanha":
                    if (taskDeadline.toDateString() !== tomorrow.toDateString()) return false
                    break
                case "esta-semana":
                    if (taskDeadline < startOfWeek || taskDeadline > endOfWeek) return false
                    break
                case "proximo-mes":
                    if (taskDeadline.getMonth() !== nextMonth.getMonth() ||
                        taskDeadline.getFullYear() !== nextMonth.getFullYear()) return false
                    break
                case "sem-prazo":
                    if (task.deadline) return false
                    break
                case "personalizado":
                    // Será tratado pelos filtros de data personalizados abaixo
                    break
            }
        }

        // Filtro por data personalizada
        if (filters.dateFrom) {
            const fromDate = new Date(filters.dateFrom)
            const taskDeadline = new Date(task.deadline)
            if (taskDeadline < fromDate) return false
        }

        if (filters.dateTo) {
            const toDate = new Date(filters.dateTo)
            const taskDeadline = new Date(task.deadline)
            if (taskDeadline > toDate) return false
        }

        return true
    })
}
