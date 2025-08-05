"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Task, validationSchema, formInitialValues, TimerState } from "@/controller"
import { ErrorMessage, Field, FieldProps, Formik, FormikHelpers, FormikProps } from 'formik'
import { NotificationData, NotificationTypeEnum, getNotificationClasses } from "@/interface/notificationData"
import { TaskResponse, TaskService } from "./instancias-service"
import axios, { AxiosError, AxiosResponse } from 'axios'
import { Trash2, Plus, Play, Pause, Square, Clock, CheckCircle } from "lucide-react"
import { useTimer } from "./hooks/timer"
import { TASK_STATUS_COLORS, TASK_STATUS_LABELS } from "./config/uiConfig"
import { responseCookiesToRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies"
import { ApiError } from "next/dist/server/api-utils"


export default function TaskPanel() {
  const formikRef = useRef<FormikProps<Task>>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [notificationData, setNotificationData] = useState<NotificationData | null>(null)


  const resetNotification = () => {
    setTimeout(() => {
      setNotificationData(null)
    }, 6000)
  }

  const handleSubmit = (
    values: Task,
    { setSubmitting, resetForm }: FormikHelpers<Task>
  ) => {
    const { current } = formikRef
    if (!current) return
    current.setSubmitting(false)

    /*Enviar somente as infos que eu tenho*/
    const formToSend = {
      title: values.title,
      description: values.description || undefined,
      status: values.status,
      deadLine: values.deadLine ? `${values.deadLine}T23:59:59` : undefined,
    } as Partial<Task>;
    /*Trima as undefined*/
    Object.keys(formToSend).forEach(key => {
      if (formToSend[key as keyof Task] === undefined) {
        delete formToSend[key as keyof Task];
      }
    });

    setSubmitting(false)
    resetForm()
    handleCreatTask(formToSend);

  }
  const handleCreatTask = (formToSend: Partial<Task>) => {
    setLoading(true);

    TaskService.create(formToSend)
      .then((response: any) => {
        try {
          setTasks((prev) => [...prev, response.data])
          setNotificationData({
            text: 'Tarefa criada com sucesso!',
            type: NotificationTypeEnum.SUCCESS,
          })
          resetNotification()
          setIsModalOpen(false)
        } catch (error) {
          console.error("❌ Erro interno após sucesso da API:", error)
          setNotificationData({
            text: 'Tarefa criada, mas houve um erro na interface!',
            type: NotificationTypeEnum.WARNING,
          })
          resetNotification()
        }
      })
      .catch((error: AxiosError | Error) => {
        let errorMessage = "Erro ao criar tarefa"
        if (axios.isAxiosError(error)) {
          console.error("❌ Response do erro:", {
            status: error.response?.status,
            data: error.response?.data,
            headers: error.response?.headers,
          });
          if (error.response?.data && typeof error.response.data === 'object') {
            const data = error.response.data as { message?: string };
            if (data.message) {
              errorMessage = data.message;
            }
          }
        } else {
          console.error("Erro: ", error);
          if (error.message) {
            errorMessage = error.message;
          }
        }
        setNotificationData({
          text: errorMessage,
          type: NotificationTypeEnum.DANGER,
        });
        resetNotification()
      })
  }

  //TODO: botao de delete
  const handleDelete = (id: string) => {
    if (!id) {
      return
    }
    setLoading(true)
    TaskService.remove(id)
      .then(() => {
        setLoading(false)
        setNotificationData(() => ({
          text: 'Tarefa removida com sucesso!',
          type: NotificationTypeEnum.SUCCESS,
        }))
        resetNotification()
      })
          .catch((error: unknown) => {
      setLoading(false);

      let errorMessage = 'Erro ao remover tarefa!';

      if (error instanceof AxiosError) {
        const apiError = error.response?.data?.apierror?.message;
        if (apiError) {
          errorMessage += `: ${apiError}`;
        }
      } else if (error instanceof Error) {
        errorMessage += `: ${error.message}`;
      }
      console.error("valor do id ", id)
      console.error("error -> ", ApiError)
      setNotificationData(() => ({
        text: errorMessage,
        type: NotificationTypeEnum.DANGER,
      }));
      resetNotification();
    });
  }

  const formatDate = (date: Date | null | string) => {
    if (!date) return "Data não informada";

    const dateObj = typeof date === 'string' ? new Date(date) : date;

    if (isNaN(dateObj.getTime())) return "Data inválida";

    return dateObj.toLocaleDateString("pt-BR");
  }
  const handleStatusChange = (taskId: string, newStatus: Task["status"]) => {
    setTasks((prev) => prev.map((task) => (task.id === taskId ? { ...task, status: newStatus } : task)))
  }
  const updateTaskTimeSpent = (taskId: string, timeSpent: number) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId
          ? { ...task, timeSpent }
          : task
      )
    )
  }
  const { timers, startTimer, pauseTimer, resetTimer, formatTime, getCurrentTime } = useTimer(tasks, updateTaskTimeSpent)

  /*FUNCAO PARA CARREGAR TAREFAS JA EXISTENTES*/
  const fillTasks = () => {
    setLoading(true)
    TaskService.getAll({}, 0, 10, 'id')
      .then((response: AxiosResponse<TaskResponse>) => {
        setTasks(response.data)
        setNotificationData({
          text: `${response.data.length} tarefa(s) carregadas com sucesso!`,
          type: NotificationTypeEnum.SUCCESS
        })
        resetNotification()
      }).catch((error: AxiosError | Error) => {
        let errorMessage = "Error ao carregar tarefa."
        if (axios.isAxiosError(error)) {
          console.error("error: ", {
            status: error.response?.status,
            data: error.response?.data,
          })
          if (error.response?.data && typeof error.response.data === 'object') {
            const data = error.response.data as { message?: string }
            if (data.message) {
              errorMessage = data.message
            }
          }
        } else {
          console.error("Error: ", error)
          if (error.message) {
            errorMessage = error.message
          }
        }
        setNotificationData({
          text: errorMessage,
          type: NotificationTypeEnum.DANGER,
        })
      })
  }
  useEffect(() => {
    fillTasks()
  }, [])


  //TODO: API EXTERNA PARA INCLUIR BOTAO COM POMODORO

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {notificationData && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm border-l-4 ${getNotificationClasses(notificationData.type)} animate-in slide-in-from-right-full duration-300`}>
          <div className="flex justify-between items-start">
            <div className="flex items-center">
              {notificationData.type === NotificationTypeEnum.SUCCESS && (
                <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
              )}
              {notificationData.type === NotificationTypeEnum.DANGER && (
                <CheckCircle className="w-5 h-5 mr-2 text-red-600" />
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
              {({ handleSubmit }) => (
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
                          </SelectContent>
                        </Select>
                      )}
                    </Field>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="deadLine">Prazo *</Label>
                    <Field id="deadLine" name="deadLine">
                      {({ field, form }: FieldProps) => (
                        <div className="relative">
                          <Input
                            {...field}
                            id="deadLine"
                            name="deadLine"
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
                    <TableHead className="font-semibold">Timer</TableHead>
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
                        <Select
                          value={task.status}
                          onValueChange={(value) => handleStatusChange(task.id, value as Task["status"])}
                        >
                          <SelectTrigger className="w-auto border-none p-0 h-auto">
                            <Badge className={TASK_STATUS_COLORS[task.status]}>{TASK_STATUS_LABELS[task.status]}</Badge>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pendente">Pendente</SelectItem>
                            <SelectItem value="em-andamento">Em Andamento</SelectItem>
                            <SelectItem value="concluida">Concluída</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>{formatDate(task.createdAt)}</TableCell>
                      <TableCell>
                        <span
                          className={
                            task.deadLine && new Date(task.deadLine) < new Date() && task.status !== "concluida"
                              ? "text-red-600 font-medium"
                              : "text-gray-900"
                          }
                        >
                          {formatDate(task.deadLine)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1 min-w-[60px]">
                            <Clock className="h-3 w-3 text-gray-500" />
                            <span className="text-sm font-mono">{formatTime(getCurrentTime(task.id))}</span>
                          </div>
                          <div className="flex gap-1">
                            {timers[task.id]?.isRunning ? (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => pauseTimer(task.id)}
                                className="h-6 w-6 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                              >
                                <Pause className="h-3 w-3" />
                              </Button>
                            ) : (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => startTimer(task.id)}
                                className="h-6 w-6 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
                              >
                                <Play className="h-3 w-3" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => resetTimer(task.id)}
                              className="h-6 w-6 p-0 text-gray-600 hover:text-gray-700 hover:bg-gray-50"
                            >
                              <Square className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
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
