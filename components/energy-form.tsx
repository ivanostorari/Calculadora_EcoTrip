"use client"

import type React from "react"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Zap, Flame, Droplet, Thermometer } from "lucide-react"

export function EnergyForm({ data, updateData }: any) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    const numValue = value === "" ? 0 : Number.parseFloat(value)
    updateData({
      ...data,
      [name]: numValue,
    })
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-4">
        <h2 className="text-xl font-semibold text-green-800">Home Energy</h2>
        <p className="text-gray-600">Enter your monthly household energy consumption</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-green-700" />
            <Label htmlFor="electricityKwh">Electricity</Label>
          </div>
          <Input
            id="electricityKwh"
            name="electricityKwh"
            type="number"
            min="0"
            placeholder="0"
            value={data.electricityKwh || ""}
            onChange={handleChange}
          />
          <p className="text-xs text-gray-500">kWh (kilowatt-hours)</p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Flame className="h-5 w-5 text-green-700" />
            <Label htmlFor="naturalGasCubicM">Natural Gas</Label>
          </div>
          <Input
            id="naturalGasCubicM"
            name="naturalGasCubicM"
            type="number"
            min="0"
            placeholder="0"
            value={data.naturalGasCubicM || ""}
            onChange={handleChange}
          />
          <p className="text-xs text-gray-500">cubic meters</p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Droplet className="h-5 w-5 text-green-700" />
            <Label htmlFor="lpgLiters">LPG</Label>
          </div>
          <Input
            id="lpgLiters"
            name="lpgLiters"
            type="number"
            min="0"
            placeholder="0"
            value={data.lpgLiters || ""}
            onChange={handleChange}
          />
          <p className="text-xs text-gray-500">liters</p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Thermometer className="h-5 w-5 text-green-700" />
            <Label htmlFor="oilLiters">Heating Oil</Label>
          </div>
          <Input
            id="oilLiters"
            name="oilLiters"
            type="number"
            min="0"
            placeholder="0"
            value={data.oilLiters || ""}
            onChange={handleChange}
          />
          <p className="text-xs text-gray-500">liters</p>
        </div>
      </div>
    </div>
  )
}
