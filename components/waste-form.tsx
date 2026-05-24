"use client"

import type React from "react"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Trash2, Recycle, Leaf } from "lucide-react"

export function WasteForm({ data, updateData }: any) {
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
        <h2 className="text-xl font-semibold text-green-800">Waste Management</h2>
        <p className="text-gray-600">Enter your monthly waste production in kilograms</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Trash2 className="h-5 w-5 text-green-700" />
            <Label htmlFor="generalWasteKg">General Waste</Label>
          </div>
          <Input
            id="generalWasteKg"
            name="generalWasteKg"
            type="number"
            min="0"
            placeholder="0"
            value={data.generalWasteKg || ""}
            onChange={handleChange}
          />
          <p className="text-xs text-gray-500">Landfill waste (kg)</p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Recycle className="h-5 w-5 text-green-700" />
            <Label htmlFor="recyclingKg">Recycling</Label>
          </div>
          <Input
            id="recyclingKg"
            name="recyclingKg"
            type="number"
            min="0"
            placeholder="0"
            value={data.recyclingKg || ""}
            onChange={handleChange}
          />
          <p className="text-xs text-gray-500">Recycled materials (kg)</p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Leaf className="h-5 w-5 text-green-700" />
            <Label htmlFor="compostKg">Compost</Label>
          </div>
          <Input
            id="compostKg"
            name="compostKg"
            type="number"
            min="0"
            placeholder="0"
            value={data.compostKg || ""}
            onChange={handleChange}
          />
          <p className="text-xs text-gray-500">Composted waste (kg)</p>
        </div>
      </div>
    </div>
  )
}
