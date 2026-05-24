"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { TruckForm } from "@/components/truck-form"
import { OperationForm } from "@/components/operation-form"
import { CargoForm } from "@/components/cargo-form"
import { ResultsDisplay } from "@/components/results-display"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ExamplesTab } from "@/components/examples-tab"
import { InfoButton } from "@/components/info-button"

export type CalculatorData = {
  truck: {
    type: string
    year: number
    fuelType: string
    fuelEfficiency: number
  }
  operation: {
    distanceKm: number
    routeType: string
    trips: number
    period: string
  }
  cargo: {
    weightTonnes: number
    type: string
    loadFactor: number
  }
}

export type CalculatorResults = {
  totalCO2: number
  equivalentTrees: number
  equivalentDiesel: number
  equivalentWater: number
  fuelConsumed: number
  co2PerTonneKm: number
}

export function Calculator() {
  const [calculatorData, setCalculatorData] = useState<CalculatorData>({
    truck: {
      type: "semi",
      year: 2020,
      fuelType: "diesel",
      fuelEfficiency: 2.5, // km/L
    },
    operation: {
      distanceKm: 0,
      routeType: "highway",
      trips: 1,
      period: "month",
    },
    cargo: {
      weightTonnes: 0,
      type: "general",
      loadFactor: 80, // percentage
    },
  })

  const [results, setResults] = useState<CalculatorResults | null>(null)
  const [activeTab, setActiveTab] = useState("examples")

  const updateTruck = (data: CalculatorData["truck"]) => {
    setCalculatorData({ ...calculatorData, truck: data })
  }

  const updateOperation = (data: CalculatorData["operation"]) => {
    setCalculatorData({ ...calculatorData, operation: data })
  }

  const updateCargo = (data: CalculatorData["cargo"]) => {
    setCalculatorData({ ...calculatorData, cargo: data })
  }

  const calculateResults = () => {
    // Calculate fuel consumption
    const { distanceKm, trips } = calculatorData.operation
    const { fuelEfficiency } = calculatorData.truck
    const { weightTonnes, loadFactor } = calculatorData.cargo

    const totalDistance = distanceKm * trips
    const fuelConsumed = totalDistance / fuelEfficiency // Liters of diesel

    // Calculate CO2 emissions
    // Brazilian diesel emission factor: ~2.68 kg CO2 per liter
    let emissionFactor = 2.68 // Default diesel

    if (calculatorData.truck.fuelType === "biodiesel") {
      // B100 (pure biodiesel) has about 75% of diesel emissions
      emissionFactor = 2.68 * 0.75
    } else if (calculatorData.truck.fuelType === "diesel-b12") {
      // B12 (12% biodiesel blend) - common in Brazil
      emissionFactor = 2.68 * 0.97
    }

    // Adjust for truck age
    const currentYear = new Date().getFullYear()
    const truckAge = currentYear - calculatorData.truck.year
    let ageMultiplier = 1.0

    if (truckAge > 20) {
      ageMultiplier = 1.3 // 30% more emissions for very old trucks
    } else if (truckAge > 10) {
      ageMultiplier = 1.15 // 15% more emissions for older trucks
    }

    // Adjust for route type
    let routeMultiplier = 1.0
    if (calculatorData.operation.routeType === "urban") {
      routeMultiplier = 1.2 // 20% more emissions in urban areas (stop and go)
    } else if (calculatorData.operation.routeType === "mixed") {
      routeMultiplier = 1.1 // 10% more emissions in mixed routes
    } else if (calculatorData.operation.routeType === "mountainous") {
      routeMultiplier = 1.25 // 25% more emissions in mountainous terrain
    }

    // Adjust for load factor
    const loadMultiplier = 0.7 + 0.3 * (loadFactor / 100)

    // Calculate total CO2 emissions
    const totalCO2 = fuelConsumed * emissionFactor * ageMultiplier * routeMultiplier * loadMultiplier

    // Calculate CO2 per tonne-km (efficiency metric)
    const tonneKm = weightTonnes * totalDistance * (loadFactor / 100)
    const co2PerTonneKm = tonneKm > 0 ? totalCO2 / tonneKm : 0

    // Equivalence calculations
    // 1 tree absorbs ~21kg CO2 per year
    const equivalentTrees = totalCO2 / 21

    // 1 liter of diesel produces ~2.68kg CO2
    const equivalentDiesel = totalCO2 / 2.68

    // Updated water footprint calculation based on scientific research:
    // Average water footprint for diesel production in Brazil: 2.5 liters of water per liter of diesel
    const waterFootprintPerLiterDiesel = 2.5 // liters of water per liter of diesel
    const equivalentWater = fuelConsumed * waterFootprintPerLiterDiesel

    setResults({
      totalCO2,
      equivalentTrees,
      equivalentDiesel,
      equivalentWater,
      fuelConsumed,
      co2PerTonneKm,
    })
  }

  const resetCalculator = () => {
    setCalculatorData({
      truck: {
        type: "semi",
        year: 2020,
        fuelType: "diesel",
        fuelEfficiency: 2.5,
      },
      operation: {
        distanceKm: 0,
        routeType: "highway",
        trips: 1,
        period: "month",
      },
      cargo: {
        weightTonnes: 0,
        type: "general",
        loadFactor: 80,
      },
    })
    setResults(null)
    setActiveTab("examples")
  }

  const handleNextTab = () => {
    if (activeTab === "examples") setActiveTab("truck")
    else if (activeTab === "truck") setActiveTab("operation")
    else if (activeTab === "operation") setActiveTab("cargo")
    else if (activeTab === "cargo") calculateResults()
  }

  const handlePrevTab = () => {
    if (activeTab === "truck") setActiveTab("examples")
    else if (activeTab === "operation") setActiveTab("truck")
    else if (activeTab === "cargo") setActiveTab("operation")
  }

  return (
    <div className="space-y-6">
      {!results ? (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex items-center justify-between mb-4">
            <TabsList className="grid grid-cols-4 w-full max-w-3xl">
              <TabsTrigger value="examples">Exemplos</TabsTrigger>
              <TabsTrigger value="truck">Caminhão</TabsTrigger>
              <TabsTrigger value="operation">Operação</TabsTrigger>
              <TabsTrigger value="cargo">Carga</TabsTrigger>
            </TabsList>

            <InfoButton
              content={
                <p>
                  Preencha os dados do seu caminhão, operação e carga para calcular o impacto ambiental. Os valores
                  devem refletir a operação no período selecionado.
                </p>
              }
            />
          </div>

          <Card>
            <CardContent className="pt-6">
              <TabsContent value="examples">
                <ExamplesTab setCalculatorData={setCalculatorData} setActiveTab={setActiveTab} />
              </TabsContent>
              <TabsContent value="truck">
                <TruckForm data={calculatorData.truck} updateData={updateTruck} />
              </TabsContent>
              <TabsContent value="operation">
                <OperationForm data={calculatorData.operation} updateData={updateOperation} />
              </TabsContent>
              <TabsContent value="cargo">
                <CargoForm data={calculatorData.cargo} updateData={updateCargo} />
              </TabsContent>

              <div className="flex justify-between mt-6">
                <Button variant="outline" onClick={handlePrevTab} disabled={activeTab === "examples"}>
                  Anterior
                </Button>
                <Button onClick={handleNextTab} className="bg-green-600 hover:bg-green-700">
                  {activeTab === "cargo" ? "Calcular Resultados" : "Próximo"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </Tabs>
      ) : (
        <div className="space-y-6">
          <ResultsDisplay results={results} data={calculatorData} />
          <div className="flex justify-center gap-4">
            <Button variant="outline" onClick={() => setResults(null)}>
              Editar Dados
            </Button>
            <Button onClick={resetCalculator} variant="destructive">
              Reiniciar Calculadora
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
