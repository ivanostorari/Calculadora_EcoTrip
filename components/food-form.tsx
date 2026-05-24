"use client"

import type React from "react"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Beef, Drumstick, Milk, Apple } from "lucide-react"

export function FoodForm({ data, updateData }: any) {
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
        <h2 className="text-xl font-semibold text-green-800">Food Consumption</h2>
        <p className="text-gray-600">Enter your monthly food consumption (servings)</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Beef className="h-5 w-5 text-green-700" />
            <Label htmlFor="redMeatServings">Red Meat</Label>
          </div>
          <Input
            id="redMeatServings"
            name="redMeatServings"
            type="number"
            min="0"
            placeholder="0"
            value={data.redMeatServings || ""}
            onChange={handleChange}
          />
          <p className="text-xs text-gray-500">Servings per month (beef, lamb, pork)</p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Drumstick className="h-5 w-5 text-green-700" />
            <Label htmlFor="poultryServings">Poultry</Label>
          </div>
          <Input
            id="poultryServings"
            name="poultryServings"
            type="number"
            min="0"
            placeholder="0"
            value={data.poultryServings || ""}
            onChange={handleChange}
          />
          <p className="text-xs text-gray-500">Servings per month (chicken, turkey)</p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Milk className="h-5 w-5 text-green-700" />
            <Label htmlFor="dairyServings">Dairy</Label>
          </div>
          <Input
            id="dairyServings"
            name="dairyServings"
            type="number"
            min="0"
            placeholder="0"
            value={data.dairyServings || ""}
            onChange={handleChange}
          />
          <p className="text-xs text-gray-500">Servings per month (milk, cheese, yogurt)</p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Apple className="h-5 w-5 text-green-700" />
            <Label htmlFor="fruitsVeggiesServings">Fruits & Vegetables</Label>
          </div>
          <Input
            id="fruitsVeggiesServings"
            name="fruitsVeggiesServings"
            type="number"
            min="0"
            placeholder="0"
            value={data.fruitsVeggiesServings || ""}
            onChange={handleChange}
          />
          <p className="text-xs text-gray-500">Servings per month</p>
        </div>
      </div>
    </div>
  )
}
