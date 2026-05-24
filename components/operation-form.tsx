"use client"

import type React from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, Repeat, Calendar } from "lucide-react"
import type { CalculatorData } from "./calculator"

interface OperationFormProps {
  data: CalculatorData["operation"]
  updateData: (data: CalculatorData["operation"]) => void
}

export function OperationForm({ data, updateData }: OperationFormProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    const numValue = value === "" ? 0 : Number.parseFloat(value)
    updateData({
      ...data,
      [name]: numValue,
    })
  }

  const handleSelectChange = (name: string, value: string) => {
    updateData({
      ...data,
      [name]: value,
    })
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-4">
        <h2 className="text-xl font-semibold text-green-800">Dados da Operação</h2>
        <p className="text-gray-600">Informe os detalhes da operação de transporte</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-green-700" />
            <Label htmlFor="distanceKm">Distância por Viagem</Label>
          </div>
          <Input
            id="distanceKm"
            name="distanceKm"
            type="number"
            min="0"
            placeholder="0"
            value={data.distanceKm || ""}
            onChange={handleChange}
          />
          <p className="text-xs text-gray-500">Distância em quilômetros (km)</p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-green-700" />
            <Label htmlFor="routeType">Tipo de Rota</Label>
          </div>
          <Select value={data.routeType} onValueChange={(value) => handleSelectChange("routeType", value)}>
            <SelectTrigger id="routeType">
              <SelectValue placeholder="Selecione o tipo de rota" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="highway">Rodovia (BR/Estadual)</SelectItem>
              <SelectItem value="urban">Urbana (Cidade)</SelectItem>
              <SelectItem value="mixed">Mista (Urbana e Rodovia)</SelectItem>
              <SelectItem value="mountainous">Montanhosa (Serra)</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-gray-500">Rotas urbanas geralmente consomem mais combustível</p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Repeat className="h-5 w-5 text-green-700" />
            <Label htmlFor="trips">Número de Viagens</Label>
          </div>
          <Input
            id="trips"
            name="trips"
            type="number"
            min="1"
            placeholder="1"
            value={data.trips || ""}
            onChange={handleChange}
          />
          <p className="text-xs text-gray-500">Quantidade de viagens no período selecionado</p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-green-700" />
            <Label htmlFor="period">Período</Label>
          </div>
          <Select value={data.period} onValueChange={(value) => handleSelectChange("period", value)}>
            <SelectTrigger id="period">
              <SelectValue placeholder="Selecione o período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Diário</SelectItem>
              <SelectItem value="week">Semanal</SelectItem>
              <SelectItem value="month">Mensal</SelectItem>
              <SelectItem value="year">Anual</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-gray-500">Período de referência para os cálculos</p>
        </div>
      </div>
    </div>
  )
}
