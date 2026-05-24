"use client"

import type React from "react"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Car, Bus, Train, Plane } from "lucide-react"

export function TransportationForm({ data, updateData }: any) {
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
        <h2 className="text-xl font-semibold text-green-800">Transportation</h2>
        <p className="text-gray-600">Enter your monthly travel distance in kilometers</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Car className="h-5 w-5 text-green-700" />
            <Label htmlFor="carKm">Car Travel</Label>
          </div>
          <Input
            id="carKm"
            name="carKm"
            type="number"
            min="0"
            placeholder="0"
            value={data.carKm || ""}
            onChange={handleChange}
          />
          <p className="text-xs text-gray-500">Average emissions: 192g CO2 per km</p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Bus className="h-5 w-5 text-green-700" />
            <Label htmlFor="busKm">Bus Travel</Label>
          </div>
          <Input
            id="busKm"
            name="busKm"
            type="number"
            min="0"
            placeholder="0"
            value={data.busKm || ""}
            onChange={handleChange}
          />
          <p className="text-xs text-gray-500">Average emissions: 105g CO2 per km</p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Train className="h-5 w-5 text-green-700" />
            <Label htmlFor="trainKm">Train Travel</Label>
          </div>
          <Input
            id="trainKm"
            name="trainKm"
            type="number"
            min="0"
            placeholder="0"
            value={data.trainKm || ""}
            onChange={handleChange}
          />
          <p className="text-xs text-gray-500">Average emissions: 41g CO2 per km</p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Plane className="h-5 w-5 text-green-700" />
            <Label htmlFor="planeKm">Air Travel</Label>
          </div>
          <Input
            id="planeKm"
            name="planeKm"
            type="number"
            min="0"
            placeholder="0"
            value={data.planeKm || ""}
            onChange={handleChange}
          />
          <p className="text-xs text-gray-500">Average emissions: 255g CO2 per km</p>
        </div>
      </div>
    </div>
  )
}
