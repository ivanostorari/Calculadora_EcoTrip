"use client"

import type React from "react"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Truck, Fuel, Calendar } from "lucide-react"
import type { CalculatorData } from "./calculator"
import { Slider } from "@/components/ui/slider"

interface TruckFormProps {
  data: CalculatorData["truck"]
  updateData: (data: CalculatorData["truck"]) => void
}

export function TruckForm({ data, updateData }: TruckFormProps) {
  const [localFuelEfficiency, setLocalFuelEfficiency] = useState(data.fuelEfficiency)

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

  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    const year = value === "" ? new Date().getFullYear() : Number.parseInt(value)
    updateData({
      ...data,
      year: Math.min(Math.max(year, 1980), new Date().getFullYear()),
    })
  }

  const handleFuelEfficiencyChange = (value: number[]) => {
    const newValue = value[0]
    setLocalFuelEfficiency(newValue)
    updateData({
      ...data,
      fuelEfficiency: newValue,
    })
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-4">
        <h2 className="text-xl font-semibold text-green-800">Dados do Caminhão</h2>
        <p className="text-gray-600">Informe as características do seu veículo</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Truck className="h-5 w-5 text-green-700" />
            <Label htmlFor="truckType">Tipo de Caminhão</Label>
          </div>
          <Select value={data.type} onValueChange={(value) => handleSelectChange("type", value)}>
            <SelectTrigger id="truckType">
              <SelectValue placeholder="Selecione o tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">VUC / Caminhão Leve (até 7,5t)</SelectItem>
              <SelectItem value="medium">Toco / Médio (até 16t)</SelectItem>
              <SelectItem value="heavy">Truck / Pesado (até 23t)</SelectItem>
              <SelectItem value="semi">Carreta / Semi-reboque (até 40t)</SelectItem>
              <SelectItem value="road-train">Bi-trem / Rodotrem (acima de 40t)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-green-700" />
            <Label htmlFor="year">Ano de Fabricação</Label>
          </div>
          <Input
            id="year"
            name="year"
            type="number"
            min="1980"
            max={new Date().getFullYear()}
            value={data.year || ""}
            onChange={handleYearChange}
          />
          <p className="text-xs text-gray-500">Caminhões mais antigos geralmente emitem mais CO2</p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Fuel className="h-5 w-5 text-green-700" />
            <Label htmlFor="fuelType">Tipo de Combustível</Label>
          </div>
          <Select value={data.fuelType} onValueChange={(value) => handleSelectChange("fuelType", value)}>
            <SelectTrigger id="fuelType">
              <SelectValue placeholder="Selecione o combustível" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="diesel">Diesel S10</SelectItem>
              <SelectItem value="diesel-b12">Diesel B12 (12% biodiesel)</SelectItem>
              <SelectItem value="biodiesel">Biodiesel B100</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-gray-500">Biodiesel tem menor impacto ambiental</p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Fuel className="h-5 w-5 text-green-700" />
            <Label>Consumo de Combustível: {localFuelEfficiency.toFixed(1)} km/L</Label>
          </div>
          <Slider
            value={[localFuelEfficiency]}
            min={1}
            max={10}
            step={0.1}
            onValueChange={handleFuelEfficiencyChange}
            className="py-4"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>1 km/L</span>
            <span>5 km/L</span>
            <span>10 km/L</span>
          </div>
        </div>
      </div>
    </div>
  )
}
