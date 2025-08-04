import * as Yup from 'yup'

export interface Task{
    id: string
    title: string
    description: string
    status: "pendente" | "em-andamento" | "concluida"
    createdAt: null| Date
    deadLine: null| Date
    timeSpent?: number | any
}
export interface TimerState {
  [taskId: string]: {
    isRunning: boolean
    startTime: number
    elapsedTime: number
  }
}
export const formInitialValues: Task = {
    id: '',
    title:'',
    description: '',
    status: "pendente", // comeca com pendente de ser feito
    createdAt: null,
    deadLine: null,
    timeSpent: ''
}

export const validationSchema = Yup.object().shape({
    //TODO: VALIDACAO DE INPUTS
})