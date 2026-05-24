"use client"

import type React from "react"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Package, Percent } from "lucide-react"
import type { CalculatorData } from "./calculator"
import { Slider } from "@/components/ui/slider"

interface CargoFormProps {
  data: CalculatorData["cargo"]
  updateData: (data: CalculatorData["cargo"]) => void
}

export function CargoForm({ data, updateData }: CargoFormProps) {
  const [localLoadFactor, setLocalLoadFactor] = useState(data.loadFactor)

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

  const handleLoadFactorChange = (value: number[]) => {
    const newValue = value[0]
    setLocalLoadFactor(newValue)
    updateData({
      ...data,
      loadFactor: newValue,
    })
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-4">
        <h2 className="text-xl font-semibold text-green-800">Dados da Carga</h2>
        <p className="text-gray-600">Informe as características da carga transportada</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5 text-green-700" />
            <Label htmlFor="weightTonnes">Peso da Carga</Label>
          </div>
          <Input
            id="weightTonnes"
            name="weightTonnes"
            type="number"
            min="0"
            step="0.1"
            placeholder="0"
            value={data.weightTonnes || ""}
            onChange={handleChange}
          />
          <p className="text-xs text-gray-500">Peso em toneladas (t)</p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5 text-green-700" />
            <Label htmlFor="cargoType">Tipo de Carga</Label>
          </div>
          <Select value={data.type} onValueChange={(value) => handleSelectChange("type", value)}>
            <SelectTrigger id="cargoType">
              <SelectValue placeholder="Selecione o tipo de carga" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="general">Carga Geral</SelectItem>
              <SelectItem value="refrigerated">Refrigerada</SelectItem>
              <SelectItem value="liquid">Líquida (Tanque)</SelectItem>
              <SelectItem value="bulk">Granel</SelectItem>
              <SelectItem value="container">Contêiner</SelectItem>
              <SelectItem value="livestock">Animais Vivos</SelectItem>
              <SelectItem value="dangerous">Produtos Perigosos</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-gray-500">Cargas refrigeradas têm maior impacto ambiental</p>
        </div>

        <div className="space-y-2 md:col-span-2">
          <div className="flex items-center gap-2">
            <Percent className="h-5 w-5 text-green-700" />
            <Label>Fator de Carga: {localLoadFactor}%</Label>
          </div>
          <Slider
            value={[localLoadFactor]}
            min={10}
            max={100}
            step={5}
            onValueChange={handleLoadFactorChange}
            className="py-4"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>10% (quase vazio)</span>
            <span>50%</span>
            <span>100% (totalmente carregado)</span>
          </div>
          <p className="text-xs text-gray-500">
            O fator de carga representa a porcentagem da capacidade do caminhão que está sendo utilizada. Caminhões mais
            cheios são mais eficientes por tonelada transportada.
          </p>
        </div>
      </div>
    </div>
  )
}
