"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Truck, Route, Package, ArrowRight } from "lucide-react"
import type { CalculatorData } from "./calculator"
import { InfoButton } from "@/components/info-button"

interface ExamplesTabProps {
  setCalculatorData: (data: CalculatorData) => void
  setActiveTab: (tab: string) => void
}

// Define predefined examples
const examples = [
  {
    id: "regional-delivery",
    title: "Distribuição Regional",
    description: "Caminhão Toco transportando mercadorias entre cidades do interior de São Paulo",
    category: "regional",
    trees: 8.93,
    diesel: 70.0,
    data: {
      truck: {
        type: "medium",
        year: 2015,
        fuelType: "diesel",
        fuelEfficiency: 3.5, // km/L
      },
      operation: {
        distanceKm: 250,
        routeType: "mixed",
        trips: 1,
        period: "day",
      },
      cargo: {
        weightTonnes: 8.0,
        type: "general",
        loadFactor: 85, // percentage
      },
    },
  },
  {
    id: "long-haul",
    title: "Transporte de Longa Distância",
    description: "Carreta transportando carga entre São Paulo e Rio de Janeiro pela Rodovia Dutra",
    category: "highway",
    trees: 51.1,
    diesel: 400.45,
    data: {
      truck: {
        type: "semi",
        year: 2019,
        fuelType: "diesel-b12",
        fuelEfficiency: 2.2, // km/L
      },
      operation: {
        distanceKm: 430,
        routeType: "highway",
        trips: 2,
        period: "week",
      },
      cargo: {
        weightTonnes: 28.0,
        type: "container",
        loadFactor: 90, // percentage
      },
    },
  },
  {
    id: "agribusiness",
    title: "Transporte de Grãos",
    description: "Bi-trem transportando soja do Mato Grosso para o Porto de Santos",
    category: "agribusiness",
    trees: 154.56,
    diesel: 1211.12,
    data: {
      truck: {
        type: "road-train",
        year: 2020,
        fuelType: "diesel-b12",
        fuelEfficiency: 1.8, // km/L
      },
      operation: {
        distanceKm: 1800,
        routeType: "highway",
        trips: 1,
        period: "week",
      },
      cargo: {
        weightTonnes: 57.0,
        type: "bulk",
        loadFactor: 95, // percentage
      },
    },
  },
  {
    id: "mountainous",
    title: "Rota Serra do Mar",
    description: "Caminhão transportando carga pela Serra do Mar entre São Paulo e Santos",
    category: "challenging",
    trees: 6.11,
    diesel: 47.87,
    data: {
      truck: {
        type: "heavy",
        year: 2016,
        fuelType: "diesel",
        fuelEfficiency: 1.5, // km/L
      },
      operation: {
        distanceKm: 80,
        routeType: "mountainous",
        trips: 1,
        period: "day",
      },
      cargo: {
        weightTonnes: 15.0,
        type: "general",
        loadFactor: 80, // percentage
      },
    },
  },
  {
    id: "biodiesel",
    title: "Transporte com Biodiesel",
    description: "Caminhão utilizando biodiesel B100 para transporte de carga geral",
    category: "eco-friendly",
    trees: 19.16,
    diesel: 150.11,
    data: {
      truck: {
        type: "medium",
        year: 2021,
        fuelType: "biodiesel",
        fuelEfficiency: 3.0, // km/L
      },
      operation: {
        distanceKm: 300,
        routeType: "mixed",
        trips: 3,
        period: "week",
      },
      cargo: {
        weightTonnes: 10.0,
        type: "general",
        loadFactor: 75, // percentage
      },
    },
  },
  {
    id: "livestock",
    title: "Transporte de Gado",
    description: "Caminhão boiadeiro transportando gado entre fazendas e frigoríficos",
    category: "specialized",
    trees: 40.77,
    diesel: 319.48,
    data: {
      truck: {
        type: "heavy",
        year: 2014,
        fuelType: "diesel",
        fuelEfficiency: 2.2, // km/L
      },
      operation: {
        distanceKm: 350,
        routeType: "mixed",
        trips: 2,
        period: "week",
      },
      cargo: {
        weightTonnes: 20.0,
        type: "livestock",
        loadFactor: 90, // percentage
      },
    },
  },
]

export function ExamplesTab({ setCalculatorData, setActiveTab }: ExamplesTabProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  const filteredExamples =
    selectedCategory === "all" ? examples : examples.filter((example) => example.category === selectedCategory)

  const handleLoadExample = (exampleData: CalculatorData) => {
    setCalculatorData(exampleData)
    setActiveTab("truck")
  }

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(2) + "K"
    } else {
      return num.toFixed(2)
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-4">
        <h2 className="text-xl font-semibold text-green-800">Exemplos Predefinidos</h2>
        <p className="text-gray-600">Explore cenários comuns de transporte rodoviário no Brasil</p>
      </div>

      <Tabs defaultValue="all" onValueChange={setSelectedCategory}>
        <div className="flex justify-center mb-4">
          <TabsList>
            <TabsTrigger value="all">Todos</TabsTrigger>
            <TabsTrigger value="highway">Rodovia</TabsTrigger>
            <TabsTrigger value="specialized">Especializado</TabsTrigger>
            <TabsTrigger value="eco-friendly">Ecológico</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="all" className="mt-0">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredExamples.map((example) => (
              <Card key={example.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{example.title}</CardTitle>
                    <InfoButton
                      content={
                        <p>
                          Este exemplo mostra um cenário típico de transporte rodoviário no Brasil. Clique em "Carregar
                          Exemplo" para preencher automaticamente os dados do calculador.
                        </p>
                      }
                      side="top"
                    />
                  </div>
                  <CardDescription>{example.description}</CardDescription>
                </CardHeader>
                <CardContent className="pb-3">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Truck className="h-4 w-4 text-green-700" />
                      <span className="text-sm">
                        {getTruckTypeName(example.data.truck.type)} ({example.data.truck.year})
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Route className="h-4 w-4 text-green-700" />
                      <span className="text-sm">
                        {example.data.operation.distanceKm} km ({getRouteTypeName(example.data.operation.routeType)})
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-green-700" />
                      <span className="text-sm">
                        {example.data.cargo.weightTonnes} toneladas ({getCargoTypeName(example.data.cargo.type)})
                      </span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    onClick={() => handleLoadExample(example.data)}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    Carregar Exemplo
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="highway" className="mt-0">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredExamples.map((example) => (
              <Card key={example.id} className="overflow-hidden">
                {/* Same card content as above */}
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{example.title}</CardTitle>
                    <InfoButton
                      content={
                        <p>
                          Este exemplo mostra um cenário típico de transporte rodoviário no Brasil. Clique em "Carregar
                          Exemplo" para preencher automaticamente os dados do calculador.
                        </p>
                      }
                      side="top"
                    />
                  </div>
                  <CardDescription>{example.description}</CardDescription>
                </CardHeader>
                <CardContent className="pb-3">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Truck className="h-4 w-4 text-green-700" />
                      <span className="text-sm">
                        {getTruckTypeName(example.data.truck.type)} ({example.data.truck.year})
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Route className="h-4 w-4 text-green-700" />
                      <span className="text-sm">
                        {example.data.operation.distanceKm} km ({getRouteTypeName(example.data.operation.routeType)})
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-green-700" />
                      <span className="text-sm">
                        {example.data.cargo.weightTonnes} toneladas ({getCargoTypeName(example.data.cargo.type)})
                      </span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    onClick={() => handleLoadExample(example.data)}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    Carregar Exemplo
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="specialized" className="mt-0">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredExamples.map((example) => (
              <Card key={example.id} className="overflow-hidden">
                {/* Same card content as above */}
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{example.title}</CardTitle>
                    <InfoButton
                      content={
                        <p>
                          Este exemplo mostra um cenário típico de transporte rodoviário no Brasil. Clique em "Carregar
                          Exemplo" para preencher automaticamente os dados do calculador.
                        </p>
                      }
                      side="top"
                    />
                  </div>
                  <CardDescription>{example.description}</CardDescription>
                </CardHeader>
                <CardContent className="pb-3">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Truck className="h-4 w-4 text-green-700" />
                      <span className="text-sm">
                        {getTruckTypeName(example.data.truck.type)} ({example.data.truck.year})
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Route className="h-4 w-4 text-green-700" />
                      <span className="text-sm">
                        {example.data.operation.distanceKm} km ({getRouteTypeName(example.data.operation.routeType)})
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-green-700" />
                      <span className="text-sm">
                        {example.data.cargo.weightTonnes} toneladas ({getCargoTypeName(example.data.cargo.type)})
                      </span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    onClick={() => handleLoadExample(example.data)}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    Carregar Exemplo
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="eco-friendly" className="mt-0">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredExamples.map((example) => (
              <Card key={example.id} className="overflow-hidden">
                {/* Same card content as above */}
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{example.title}</CardTitle>
                    <InfoButton
                      content={
                        <p>
                          Este exemplo mostra um cenário típico de transporte rodoviário no Brasil. Clique em "Carregar
                          Exemplo" para preencher automaticamente os dados do calculador.
                        </p>
                      }
                      side="top"
                    />
                  </div>
                  <CardDescription>{example.description}</CardDescription>
                </CardHeader>
                <CardContent className="pb-3">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Truck className="h-4 w-4 text-green-700" />
                      <span className="text-sm">
                        {getTruckTypeName(example.data.truck.type)} ({example.data.truck.year})
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Route className="h-4 w-4 text-green-700" />
                      <span className="text-sm">
                        {example.data.operation.distanceKm} km ({getRouteTypeName(example.data.operation.routeType)})
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-green-700" />
                      <span className="text-sm">
                        {example.data.cargo.weightTonnes} toneladas ({getCargoTypeName(example.data.cargo.type)})
                      </span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={() => handleLoadExample(example.data)} className="w-full bg-green-600 hover:bg-green-700">
                    Carregar Exemplo
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Helper functions to get display names
function getTruckTypeName(type: string) {
  const types: Record<string, string> = {
    light: "VUC / Caminhão Leve",
    medium: "Toco / Médio",
    heavy: "Truck / Pesado",
    semi: "Carreta / Semi-reboque",
    "road-train": "Bi-trem / Rodotrem",
  }
  return types[type] || type
}

function getRouteTypeName(type: string) {
  const types: Record<string, string> = {
    highway: "Rodovia",
    mixed: "Mista",
    mountainous: "Montanhosa",
  }
  return types[type] || type
}

function getCargoTypeName(type: string) {
  const types: Record<string, string> = {
    general: "Carga Geral",
    refrigerated: "Refrigerada",
    liquid: "Líquida",
    bulk: "Granel",
    container: "Contêiner",
    livestock: "Animais Vivos",
    dangerous: "Produtos Perigosos",
  }
  return types[type] || type
}
