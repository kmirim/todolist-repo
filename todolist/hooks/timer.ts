import { useState, useEffect } from 'react'
import { Task, TimerState } from '@/controller'


export const useTimer = (tasks: Task[], updateTaskTimeSpent: (taskId: string, timeSpent: number) => void) => {
    const [timers, setTimers] = useState<TimerState>({})

    useEffect(() => {
        const interval = setInterval(() => {
            setTimers((prevTimers) => {
                const updatedTimers = { ...prevTimers }
                Object.keys(updatedTimers).forEach((taskId) => {
                    if (updatedTimers[taskId].isRunning) {
                        updatedTimers[taskId].elapsedTime =
                            Date.now() - updatedTimers[taskId].startTime + (tasks.find((t) => t.id === taskId)?.timeSpent || 0) * 1000
                    }
                })
                return updatedTimers
            })
        }, 1000)

        return () => clearInterval(interval)
    }, [tasks])

    const startTimer = (taskId: string) => {
        const task = tasks.find((t) => t.id === taskId)
        if (!task) return

        setTimers((prev) => ({
            ...prev,
            [taskId]: {
                isRunning: true,
                startTime: Date.now(),
                elapsedTime: (task.timeSpent || 0) * 1000,
            },
        }))
    }

    const pauseTimer = (taskId: string) => {
        const timer = timers[taskId]
        if (!timer) return

        const totalElapsed = Math.floor(timer.elapsedTime / 1000)
        updateTaskTimeSpent(taskId, totalElapsed)

        setTimers((prev) => ({
            ...prev,
            [taskId]: {
                ...prev[taskId],
                isRunning: false,
            },
        }))
    }

    const resetTimer = (taskId: string) => {
        updateTaskTimeSpent(taskId, 0)
        setTimers((prev) => {
            const newTimers = { ...prev }
            delete newTimers[taskId]
            return newTimers
        })
    }

    const formatTime = (seconds: number) => {
        const hours = Math.floor(seconds / 3600)
        const minutes = Math.floor((seconds % 3600) / 60)
        const secs = seconds % 60

        if (hours > 0) {
            return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
        }
        return `${minutes}:${secs.toString().padStart(2, "0")}`
    }

    const getCurrentTime = (taskId: string) => {
        const task = tasks.find((t) => t.id === taskId)
        const timer = timers[taskId]

        if (timer?.isRunning) {
            return Math.floor(timer.elapsedTime / 1000)
        }

        return task?.timeSpent || 0
    }

    return {
        timers,
        startTimer,
        pauseTimer,
        resetTimer,
        formatTime,
        getCurrentTime
    }
}