"use client"

import { Card, CardContent } from "@/components/ui/card"
import type { CalculatorData, CalculatorResults } from "./calculator"
import { CircleDollarSign, Droplets, Leaf, Truck, Route, Package } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { WaterMethodologyDialog } from "@/components/water-methodology"

interface ResultsDisplayProps {
  results: CalculatorResults
  data: CalculatorData
}

export function ResultsDisplay({ results, data }: ResultsDisplayProps) {
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(2) + "M"
    } else if (num >= 1000) {
      return (num / 1000).toFixed(2) + "K"
    } else {
      return num.toFixed(2)
    }
  }

  // Determine impact level
  const getImpactLevel = (co2: number) => {
    if (co2 < 100) return { level: "Baixo", color: "bg-green-500" }
    if (co2 < 500) return { level: "Moderado", color: "bg-yellow-500" }
    if (co2 < 1000) return { level: "Alto", color: "bg-orange-500" }
    return { level: "Muito Alto", color: "bg-red-500" }
  }

  const impact = getImpactLevel(results.totalCO2)

  // Calculate progress percentage (capped at 100%)
  const progressPercentage = Math.min((results.totalCO2 / 1000) * 100, 100)

  // Get truck type display name
  const getTruckTypeName = (type: string) => {
    const types: Record<string, string> = {
      light: "VUC / Caminhão Leve",
      medium: "Toco / Médio",
      heavy: "Truck / Pesado",
      semi: "Carreta / Semi-reboque",
      "road-train": "Bi-trem / Rodotrem",
    }
    return types[type] || type
  }

  // Get fuel type display name
  const getFuelTypeName = (type: string) => {
    const types: Record<string, string> = {
      diesel: "Diesel S10",
      "diesel-b12": "Diesel B12 (12% biodiesel)",
      biodiesel: "Biodiesel B100",
    }
    return types[type] || type
  }

  // Get route type display name
  const getRouteTypeName = (type: string) => {
    const types: Record<string, string> = {
      highway: "Rodovia",
      urban: "Urbana",
      mixed: "Mista",
      mountainous: "Montanhosa",
    }
    return types[type] || type
  }

  // Get cargo type display name
  const getCargoTypeName = (type: string) => {
    const types: Record<string, string> = {
      general: "Carga Geral",
      refrigerated: "Refrigerada",
      liquid: "Líquida (Tanque)",
      bulk: "Granel",
      container: "Contêiner",
      livestock: "Animais Vivos",
      dangerous: "Produtos Perigosos",
    }
    return types[type] || type
  }

  // Get period display name
  const getPeriodName = (period: string) => {
    const periods: Record<string, string> = {
      day: "Diário",
      week: "Semanal",
      month: "Mensal",
      year: "Anual",
    }
    return periods[period] || period
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-green-800 mb-2">Impacto Ambiental do Transporte</h2>
        <p className="text-gray-600">Com base nos dados informados, aqui está a estimativa do impacto ambiental</p>
      </div>

      <Card className="bg-green-50 border-green-200">
        <CardContent className="pt-6">
          <div className="text-center mb-6">
            <h3 className="text-xl font-semibold text-green-800 mb-2">Emissões Totais de CO2</h3>
            <div className="text-4xl font-bold text-green-900">{formatNumber(results.totalCO2)} kg CO2</div>
            <div className="mt-2 flex items-center justify-center gap-2">
              <span>Nível de Impacto:</span>
              <span className={`px-2 py-1 rounded-full text-white text-sm ${impact.color}`}>{impact.level}</span>
            </div>
            <div className="mt-4">
              <Progress value={progressPercentage} className="h-2" />
            </div>
          </div>

          <Tabs defaultValue="equivalents" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="equivalents">Equivalências</TabsTrigger>
              <TabsTrigger value="details">Detalhes da Operação</TabsTrigger>
            </TabsList>
            <TabsContent value="equivalents" className="pt-4">
              <div className="grid gap-6 md:grid-cols-3">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="flex justify-center mb-2">
                    <div className="p-2 bg-green-100 rounded-full">
                      <Leaf className="h-6 w-6 text-green-700" />
                    </div>
                  </div>
                  <h4 className="text-center text-green-800 font-medium mb-1">Árvores Necessárias</h4>
                  <p className="text-center text-2xl font-bold">{formatNumber(results.equivalentTrees)}</p>
                  <p className="text-center text-xs text-gray-500 mt-1">
                    Árvores necessárias por um ano para absorver este CO2
                  </p>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="flex justify-center mb-2">
                    <div className="p-2 bg-green-100 rounded-full">
                      <CircleDollarSign className="h-6 w-6 text-green-700" />
                    </div>
                  </div>
                  <h4 className="text-center text-green-800 font-medium mb-1">Equivalente em Diesel</h4>
                  <p className="text-center text-2xl font-bold">{formatNumber(results.equivalentDiesel)} L</p>
                  <p className="text-center text-xs text-gray-500 mt-1">
                    Litros de diesel que produziriam esta quantidade de CO2
                  </p>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="flex justify-center mb-2">
                    <div className="p-2 bg-green-100 rounded-full">
                      <Droplets className="h-6 w-6 text-green-700" />
                    </div>
                  </div>
                  <h4 className="text-center text-green-800 font-medium mb-1">Pegada Hídrica</h4>
                  <p className="text-center text-2xl font-bold">{formatNumber(results.equivalentWater)} L</p>
                  <p className="text-center text-xs text-gray-500 mt-1">
                    Água utilizada na extração e refino do diesel consumido
                  </p>
                </div>
              </div>

              <div className="flex justify-center mt-6">
                <div className="bg-green-50 p-2 rounded-lg shadow-sm border border-green-100 pulse-animation">
                  <WaterMethodologyDialog />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="details" className="pt-4">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <Truck className="h-5 w-5 text-green-700" />
                    <h4 className="text-green-800 font-medium">Dados do Veículo</h4>
                  </div>
                  <ul className="space-y-2 text-sm">
                    <li className="flex justify-between">
                      <span className="text-gray-600">Tipo:</span>
                      <span className="font-medium">{getTruckTypeName(data.truck.type)}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-600">Ano:</span>
                      <span className="font-medium">{data.truck.year}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-600">Combustível:</span>
                      <span className="font-medium">{getFuelTypeName(data.truck.fuelType)}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-600">Consumo:</span>
                      <span className="font-medium">{data.truck.fuelEfficiency.toFixed(1)} km/L</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <Route className="h-5 w-5 text-green-700" />
                    <h4 className="text-green-800 font-medium">Dados da Operação</h4>
                  </div>
                  <ul className="space-y-2 text-sm">
                    <li className="flex justify-between">
                      <span className="text-gray-600">Distância:</span>
                      <span className="font-medium">{data.operation.distanceKm} km</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-600">Tipo de Rota:</span>
                      <span className="font-medium">{getRouteTypeName(data.operation.routeType)}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-600">Viagens:</span>
                      <span className="font-medium">{data.operation.trips}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-600">Período:</span>
                      <span className="font-medium">{getPeriodName(data.operation.period)}</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <Package className="h-5 w-5 text-green-700" />
                    <h4 className="text-green-800 font-medium">Dados da Carga</h4>
                  </div>
                  <ul className="space-y-2 text-sm">
                    <li className="flex justify-between">
                      <span className="text-gray-600">Peso:</span>
                      <span className="font-medium">{data.cargo.weightTonnes} toneladas</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-600">Tipo:</span>
                      <span className="font-medium">{getCargoTypeName(data.cargo.type)}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-600">Fator de Carga:</span>
                      <span className="font-medium">{data.cargo.loadFactor}%</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <CircleDollarSign className="h-5 w-5 text-green-700" />
                    <h4 className="text-green-800 font-medium">Métricas de Eficiência</h4>
                  </div>
                  <ul className="space-y-2 text-sm">
                    <li className="flex justify-between">
                      <span className="text-gray-600">Combustível Total:</span>
                      <span className="font-medium">{results.fuelConsumed.toFixed(2)} litros</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-600">CO2 por Tonelada-km:</span>
                      <span className="font-medium">{results.co2PerTonneKm.toFixed(3)} kg CO2/t-km</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-600">Distância Total:</span>
                      <span className="font-medium">{data.operation.distanceKm * data.operation.trips} km</span>
                    </li>
                  </ul>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* <div className="bg-white p-6 rounded-lg border">
        <h3 className="text-lg font-semibold text-green-800 mb-3">Recomendações para Redução de Impacto</h3>
        <ul className="space-y-2">
          <li className="flex items-start gap-2">
            <Leaf className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
            <span>Otimize rotas para reduzir distâncias e evitar congestionamentos</span>
          </li>
          <li className="flex items-start gap-2">
            <Leaf className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
            <span>Mantenha o veículo em boas condições com manutenção preventiva regular</span>
          </li>
          <li className="flex items-start gap-2">
            <Leaf className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
            <span>Considere a transição para combustíveis alternativos como biodiesel</span>
          </li>
          <li className="flex items-start gap-2">
            <Leaf className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
            <span>Maximize o fator de carga para aumentar a eficiência por tonelada transportada</span>
          </li>
          <li className="flex items-start gap-2">
            <Leaf className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
            <span>Treine motoristas em técnicas de condução econômica (Programa Despoluir da CNT)</span>
          </li>
          <li className="flex items-start gap-2">
            <Leaf className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
            <span>Participe de programas de compensação de carbono reconhecidos no Brasil</span>
          </li>
        </ul>
      </div> */}
    </div>
  )
}
