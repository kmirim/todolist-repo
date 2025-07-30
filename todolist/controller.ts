import * as Yup from 'yup'

export interface Task{
    id: string
    title: string
    description: string
    status: "pendente" | "em-andamento" | "concluida"
    createdAt: null| Date
    deadline: null| Date
}

export const formInitialValues: Task = {
    id: '',
    title:'',
    description: '',
    status: "pendente", // comeca com pendente de ser feito
    createdAt: null,
    deadline: null
}

export const validationSchema = Yup.object().shape({
    //TODO: VALIDACAO DE INPUTS
})