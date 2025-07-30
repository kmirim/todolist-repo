"use client"

import type React from "react"

import { useState, useRef, FormEventHandler } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Trash2, Plus } from "lucide-react"
import { Task, validationSchema, formInitialValues} from "@/controller"
import { Field, FieldProps, Form, Formik, FormikHelpers, FormikProps } from 'formik'
import {NotificationData, NotificationTypeEnum} from "@/interface/notificationData"
import { TaskService } from "./instancias-service"
import { BaseService } from "./service"
import { AxiosError, AxiosResponse } from 'axios'

/* furncao de manipulacao de formulario com formik
** serve para:
** - formikref: guardar uma referencia 
** - formtosend: criar um objeto
** - setSubmitting(false) encerra o esdado de submissao
** - setData(...): limpa os dados
** - chama outra funcao
*/ 






const statusColors = {
  pendente: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
  "em-andamento": "bg-blue-100 text-blue-800 hover:bg-blue-200",
  concluida: "bg-green-100 text-green-800 hover:bg-green-200",
}

const statusLabels = {
  pendente: "Pendente",
  "em-andamento": "Em Andamento",
  concluida: "Concluída",
}



export default function TaskPanel() {
  const formikRef = useRef<FormikProps<Task>>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [notificationData, setNotificationData] = useState<NotificationData | null>(null)

  const [loading, setLoading] = useState<boolean>(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "pendente" as Task["status"],
    deadline: "",
  })
  const resetNotification = () => {
    setTimeout(() => {
      setNotificationData(() => null)
    }, 6000)
  }

  const getNotificationClasses = (type: NotificationTypeEnum) => {
    switch (type) {
      case NotificationTypeEnum.SUCCESS:
        return 'bg-green-100 border-green-400 text-green-700'
      case NotificationTypeEnum.DANGER:
        return 'bg-red-100 border-red-400 text-red-700'
      case NotificationTypeEnum.WARNING:
        return 'bg-yellow-100 border-yellow-400 text-yellow-700'
      case NotificationTypeEnum.INFO:
        return 'bg-blue-100 border-blue-400 text-blue-700'
      default:
        return 'bg-gray-100 border-gray-400 text-gray-700'
    }
  }

  const handleSubmit = (
    values: Task, 
    { setSubmitting, resetForm }: FormikHelpers<Task>
    ) => {
    console.log("Valores: ", values)

    const { current } = formikRef
    if (!current) return
    current.setSubmitting(false) 

    /*Filtrando somente os preenchidos: */
    const formToSend = Object.entries(values).reduce((acc, [key, value]) => {
      if (value) acc[key as keyof Task] = value
      return acc
    }, {} as Task)

    setSubmitting(false)
    resetForm()
    handleCreatTask(formToSend);    

    }
    const handleCreatTask=(formToSend:Task)=>{
      
      setLoading(true);
      
      TaskService.create(formToSend)
        .then((response:any) => {
          console.log("Tarefa criada com sucesso. ID: ", response.data.id)

          setTasks((prev) => [...prev, response.data])
          setNotificationData({
            text: 'Tarefa criada com sucesso!',
            type: NotificationTypeEnum.SUCCESS,
          })
          resetNotification()
        })
        .catch((error:AxiosError | Error) => {
          console.log("Error ao criar tarefa", error)

          let errorMessage = "Erro ao criar tarefa"

          if(error && 'response' in error && error.response){
            const axiosError = error as AxiosError<{message ?: string}>
            errorMessage = axiosError.response?.data?.message || "Erro ao criar tarefa"
          }else if(error?.message){
            errorMessage = error.message
          }

          setNotificationData({
            text: errorMessage,
            type: NotificationTypeEnum.DANGER,
          })
          resetNotification()
        })
        .finally(() => {
          setLoading(false)
        })
  }

  const handleDelete = (taskId: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== taskId))
  }

  const formatDate = (date: Date | null | string) => {
    if (!date) return "Data não informada";
    
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    if (isNaN(dateObj.getTime())) return "Data inválida";
    
    return dateObj.toLocaleDateString("pt-BR");
  }

  //TODO FUNCAO PARA CARREGAR TAREFAS JA EXISTENTES

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {notificationData && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm border-l-4 ${getNotificationClasses(notificationData.type)} animate-in slide-in-from-right-full duration-300`}>
          <div className="flex justify-between items-start">
            <div className="flex items-center">
              {/* Ícone baseado no tipo */}
              {notificationData.type === NotificationTypeEnum.SUCCESS && (
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              )}
              {notificationData.type === NotificationTypeEnum.DANGER && (
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              )}
              {notificationData.type === NotificationTypeEnum.WARNING && (
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              )}
              {notificationData.type === NotificationTypeEnum.INFO && (
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              )}
              <span className="font-medium">{notificationData.text}</span>
            </div>
            <button 
              onClick={() => setNotificationData(null)}
              className="ml-4 text-lg font-bold hover:opacity-70 transition-opacity"
            >
              ×
            </button>
          </div>
        </div>
      )}
      
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Painel de Tarefas</h1>
          <p className="text-gray-600 mt-1">Gerencie suas tarefas e acompanhe o progresso</p>
        </div>

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Nova Tarefa
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Criar Nova Tarefa</DialogTitle>
            </DialogHeader>

            <Formik<Task>
            innerRef={formikRef}
            initialValues={formInitialValues}
            onSubmit={handleSubmit}
            validationSchema={validationSchema}
            >
              {({handleSubmit}) => (
                <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Título *</Label>
                  <Field 
                    id="title" 
                    name="title" 
                    as={Input}
                    placeholder="Digite o título da tarefa"
                    required
                    />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Field
                    as={Textarea}
                    id="description"
                    name="description"
                    placeholder="Descreva a tarefa"
                    rows={3}
                    />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                    <Field name="status">
                      {({ field, form }: FieldProps) => (
                        <Select 
                          value={field.value} 
                          onValueChange={(value) => form.setFieldValue(field.name, value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pendente">Pendente</SelectItem>
                            <SelectItem value="em-andamento">Em Andamento</SelectItem>
                            <SelectItem value="concluida">Concluída</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    </Field>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="deadline">Prazo *</Label>
                    <Field id="deadline" name="deadline">
                      {({ field, form }: FieldProps) => (
                        <div className="relative">
                          <Input
                            id="deadline"
                            name="deadline"
                            type="date"
                            className="w-full"
                            min={new Date().toISOString().split('T')[0]}
                            required
                          />
                        </div>
                      )}
                    </Field>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit">Criar Tarefa</Button>
                </div>
              </form>
              )}
              
            </Formik>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Lista de Tarefas</h2>
            <div className="text-sm text-gray-500">
              Total: {tasks.length} tarefa{tasks.length !== 1 ? "s" : ""}
            </div>
          </div>

          {tasks.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-2">
                <Plus className="h-12 w-12 mx-auto mb-4 opacity-50" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">Nenhuma tarefa encontrada</h3>
              <p className="text-gray-500">Comece criando sua primeira tarefa</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-semibold">Título</TableHead>
                    <TableHead className="font-semibold">Descrição</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="font-semibold">Data de Criação</TableHead>
                    <TableHead className="font-semibold">Prazo</TableHead>
                    <TableHead className="font-semibold w-20">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tasks.map((task) => (
                    <TableRow key={task.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium">{task.title}</TableCell>
                      <TableCell className="max-w-xs">
                        <div className="truncate" title={task.description}>
                          {task.description || "—"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={statusColors[task.status]}>{statusLabels[task.status]}</Badge>
                      </TableCell>
                      <TableCell>{formatDate(task.createdAt)}</TableCell>
                      <TableCell>
                        <span
                          className={
                            task.deadline && new Date(task.deadline) < new Date() && task.status !== "concluida"
                              ? "text-red-600 font-medium"
                              : "text-gray-900"
                          }
                        >
                          {formatDate(task.deadline)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(task.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
