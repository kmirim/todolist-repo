"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Filter, X, Calendar, CheckCircle } from 'lucide-react'
import { Task } from "@/controller"

interface FilterOptions {
    status: string
    deadlineFilter: string
    dateFrom: string
    dateTo: string
}

interface TaskFilterProps {
    onFilterChange: (filters: FilterOptions) => void
    onClearFilters: () => void
}

export default function TaskFilter({ onFilterChange, onClearFilters }: TaskFilterProps) {
    const [filters, setFilters] = useState<FilterOptions>({
        status: "todos",
        deadlineFilter: "todos",
        dateFrom: "",
        dateTo: "",
    })

    const [isExpanded, setIsExpanded] = useState(false)

    const handleFilterChange = (key: keyof FilterOptions, value: string) => {
        const newFilters = { ...filters, [key]: value }
        setFilters(newFilters)
        onFilterChange(newFilters)
    }

    const handleClearFilters = () => {
        const clearedFilters = {
            status: "all",
            deadlineFilter: "all",
            dateFrom: "",
            dateTo: "",
        }
        setFilters(clearedFilters)
        onClearFilters()
    }

    const hasActiveFilters =
        filters.status !== "all" ||
        filters.deadlineFilter !== "all" ||
        filters.dateFrom !== "" ||
        filters.dateTo !== ""

    return (
        <Card className="mb-6">
            <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <Filter className="h-4 w-4 text-gray-600" />
                        <h3 className="font-semibold text-gray-900">Filtros</h3>
                        {hasActiveFilters && (
                            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                Ativo
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        {hasActiveFilters && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleClearFilters}
                                className="text-gray-600 hover:text-gray-800"
                            >
                                <X className="h-3 w-3 mr-1" />
                                Limpar
                            </Button>
                        )}
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="text-gray-600 hover:text-gray-800"
                        >
                            {isExpanded ? "Recolher" : "Expandir"}
                        </Button>
                    </div>
                </div>

                {/* Filtros sempre visíveis */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                        <Label htmlFor="status-filter" className="text-sm font-medium flex items-center gap-1">
                            <CheckCircle className="h-3 w-3" />
                            Status
                        </Label>
                        <Select
                            value={filters.status}
                            onValueChange={(value) => handleFilterChange("status", value)}
                        >
                            <SelectTrigger id="status-filter">
                                <SelectValue placeholder="Selecione o status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos os Status</SelectItem>
                                <SelectItem value="pendente">Pendente</SelectItem>
                                <SelectItem value="em-andamento">Em Andamento</SelectItem>
                                <SelectItem value="concluida">Concluída</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="deadline-filter" className="text-sm font-medium flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Prazo
                        </Label>
                        <Select
                            value={filters.deadlineFilter}
                            onValueChange={(value) => handleFilterChange("deadlineFilter", value)}
                        >
                            <SelectTrigger id="deadline-filter">
                                <SelectValue placeholder="Selecione o prazo" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="todos">Todos os Prazos</SelectItem>
                                <SelectItem value="vencidas">Tarefas Vencidas</SelectItem>
                                <SelectItem value="hoje">Vencem Hoje</SelectItem>
                                <SelectItem value="amanha">Vencem Amanhã</SelectItem>
                                <SelectItem value="esta-semana">Esta Semana</SelectItem>
                                <SelectItem value="proximo-mes">Próximo Mês</SelectItem>
                                <SelectItem value="sem-prazo">Sem Prazo</SelectItem>
                                <SelectItem value="personalizado">Período Personalizado</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Filtros expandidos */}
                {isExpanded && (
                    <div className="border-t pt-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="date-from" className="text-sm font-medium">
                                    Data Inicial
                                </Label>
                                <Input
                                    id="date-from"
                                    type="date"
                                    value={filters.dateFrom}
                                    onChange={(e) => handleFilterChange("dateFrom", e.target.value)}
                                    className="w-full"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="date-to" className="text-sm font-medium">
                                    Data Final
                                </Label>
                                <Input
                                    id="date-to"
                                    type="date"
                                    value={filters.dateTo}
                                    onChange={(e) => handleFilterChange("dateTo", e.target.value)}
                                    className="w-full"
                                />
                            </div>
                        </div>

                        {(filters.dateFrom || filters.dateTo) && (
                            <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                                <p className="text-sm text-blue-800">
                                    <strong>Período selecionado:</strong>{" "}
                                    {filters.dateFrom && new Date(filters.dateFrom).toLocaleDateString("pt-BR")}
                                    {filters.dateFrom && filters.dateTo && " até "}
                                    {filters.dateTo && new Date(filters.dateTo).toLocaleDateString("pt-BR")}
                                </p>
                            </div>
                        )}
                    </div>
                )}

                {/* Resumo dos filtros ativos */}
                {hasActiveFilters && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-700 mb-2">
                            <strong>Filtros ativos:</strong>
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {filters.status !== "todos" && (
                                <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                                    Status: {filters.status === "pendente" ? "Pendente" :
                                        filters.status === "em-andamento" ? "Em Andamento" : "Concluída"}
                                </span>
                            )}
                            {filters.deadlineFilter !== "todos" && (
                                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                    Prazo: {filters.deadlineFilter === "vencidas" ? "Vencidas" :
                                        filters.deadlineFilter === "hoje" ? "Hoje" :
                                            filters.deadlineFilter === "amanha" ? "Amanhã" :
                                                filters.deadlineFilter === "esta-semana" ? "Esta Semana" :
                                                    filters.deadlineFilter === "proximo-mes" ? "Próximo Mês" :
                                                        filters.deadlineFilter === "sem-prazo" ? "Sem Prazo" : "Personalizado"}
                                </span>
                            )}
                            {(filters.dateFrom || filters.dateTo) && (
                                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                                    Período: {filters.dateFrom || "..."} até {filters.dateTo || "..."}
                                </span>
                            )}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
