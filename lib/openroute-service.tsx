import type { Coordinates } from "@/components/route-planner"

// Usando uma chave de API pública para demonstração
const API_KEY = "5b3ce3597851110001cf6248966022c28d91427e8098a2d2728242f7"
const BASE_URL = "https://api.openrouteservice.org"

/**
 * Geocodifica um endereço para obter suas coordenadas
 */
export async function geocodeAddress(address: string): Promise<Coordinates> {
  try {
    // Primeiro tenta com OpenRouteService
    const url = `${BASE_URL}/geocode/search?api_key=${API_KEY}&text=${encodeURIComponent(address)}&boundary.country=BRA&size=1`

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    })

    if (response.ok) {
      const data = await response.json()
      if (data.features && data.features.length > 0) {
        const [lng, lat] = data.features[0].geometry.coordinates
        return { lat, lng }
      }
    }

    // Fallback para Nominatim (OpenStreetMap)
    return await geocodeWithNominatim(address)
  } catch (error) {
    console.error("Geocoding error:", error)
    // Fallback para Nominatim
    return await geocodeWithNominatim(address)
  }
}

/**
 * Geocodificação usando Nominatim (OpenStreetMap) como fallback
 */
async function geocodeWithNominatim(address: string): Promise<Coordinates> {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&countrycodes=br&limit=1`

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "User-Agent": "LogiCO2-Calculator/1.0",
    },
  })

  if (!response.ok) {
    throw new Error(`Erro ao geocodificar endereço: ${response.statusText}`)
  }

  const data = await response.json()

  if (!data || data.length === 0) {
    throw new Error("Endereço não encontrado")
  }

  return {
    lat: Number.parseFloat(data[0].lat),
    lng: Number.parseFloat(data[0].lon),
  }
}

/**
 * Busca endereços com base em um texto de pesquisa
 */
export async function searchAddresses(text: string): Promise<string[]> {
  try {
    // Primeiro tenta com OpenRouteService
    const url = `${BASE_URL}/geocode/autocomplete?api_key=${API_KEY}&text=${encodeURIComponent(text)}&boundary.country=BRA&size=5`

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    })

    if (response.ok) {
      const data = await response.json()
      if (data.features && data.features.length > 0) {
        return data.features.map((feature: any) => feature.properties.label)
      }
    }

    // Fallback para Nominatim
    return await searchWithNominatim(text)
  } catch (error) {
    console.error("Search error:", error)
    return await searchWithNominatim(text)
  }
}

/**
 * Busca com Nominatim como fallback
 */
async function searchWithNominatim(text: string): Promise<string[]> {
  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(text)}&countrycodes=br&limit=5`

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "User-Agent": "LogiCO2-Calculator/1.0",
      },
    })

    if (!response.ok) {
      return []
    }

    const data = await response.json()
    return data.map((item: any) => item.display_name)
  } catch (error) {
    console.error("Nominatim search error:", error)
    return []
  }
}

/**
 * Calcula uma rota entre dois pontos
 */
export async function calculateRoute(start: Coordinates, end: Coordinates) {
  try {
    const url = `${BASE_URL}/v2/directions/driving-car`

    const body = {
      coordinates: [
        [start.lng, start.lat],
        [end.lng, end.lat],
      ],
      format: "geojson",
      instructions: false,
      geometry: true,
    }

    console.log("Route request:", { url, body })

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: API_KEY,
      },
      body: JSON.stringify(body),
    })

    console.log("Route response status:", response.status, response.statusText)

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Route error response:", errorText)
      throw new Error(`Erro ao calcular rota: ${response.status} - ${response.statusText}`)
    }

    const data = await response.json()
    console.log("Route data:", data)

    if (!data.features || data.features.length === 0) {
      throw new Error("Não foi possível calcular a rota")
    }

    const route = data.features[0]

    return {
      distance: route.properties.summary.distance,
      duration: route.properties.summary.duration,
      geometry: route.geometry,
    }
  } catch (error) {
    console.error("Route calculation error:", error)
    throw error
  }
}

/**
 * Função alternativa usando uma API de fallback caso o OpenRouteService falhe
 */
export async function calculateRouteWithFallback(start: Coordinates, end: Coordinates) {
  try {
    // Primeiro tenta com OpenRouteService
    return await calculateRoute(start, end)
  } catch (error) {
    console.warn("OpenRouteService failed, trying OSRM fallback")

    try {
      // Fallback 1: OSRM (Open Source Routing Machine)
      return await calculateRouteWithOSRM(start, end)
    } catch (osrmError) {
      console.warn("OSRM also failed, using intelligent straight line calculation")

      // Fallback 2: Cálculo inteligente considerando geografia brasileira
      return await calculateIntelligentRoute(start, end)
    }
  }
}

/**
 * Calcula rota usando OSRM como fallback
 */
async function calculateRouteWithOSRM(start: Coordinates, end: Coordinates) {
  const url = `https://router.project-osrm.org/route/v1/driving/${start.lng},${start.lat};${end.lng},${end.lat}?overview=full&geometries=geojson`

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  })

  if (!response.ok) {
    throw new Error(`OSRM error: ${response.status}`)
  }

  const data = await response.json()

  if (!data.routes || data.routes.length === 0) {
    throw new Error("Nenhuma rota encontrada pelo OSRM")
  }

  const route = data.routes[0]

  return {
    distance: route.distance,
    duration: route.duration,
    geometry: route.geometry,
  }
}

/**
 * Cálculo inteligente de rota considerando a geografia brasileira
 */
async function calculateIntelligentRoute(start: Coordinates, end: Coordinates) {
  // Pontos de passagem importantes para rotas terrestres no Brasil
  const waypoints = await calculateWaypoints(start, end)

  // Calcular distância total considerando waypoints
  let totalDistance = 0
  const coordinates = [start]

  for (const waypoint of waypoints) {
    totalDistance += calculateStraightLineDistance(coordinates[coordinates.length - 1], waypoint)
    coordinates.push(waypoint)
  }

  totalDistance += calculateStraightLineDistance(coordinates[coordinates.length - 1], end)
  coordinates.push(end)

  // Ajustar distância para considerar estradas (fator de correção)
  const roadFactor = 1.3 // Estradas são ~30% mais longas que linha reta
  const adjustedDistance = totalDistance * roadFactor

  // Estimar tempo baseado em velocidade média de 80 km/h para rodovias
  const estimatedDuration = (adjustedDistance / 1000) * 45 // 45 segundos por km (80 km/h)

  // Criar geometria com waypoints
  const geometry = {
    type: "LineString",
    coordinates: coordinates.map((coord) => [coord.lng, coord.lat]),
  }

  return {
    distance: adjustedDistance,
    duration: estimatedDuration,
    geometry: geometry,
  }
}

/**
 * Calcula waypoints inteligentes para rotas terrestres brasileiras
 */
async function calculateWaypoints(start: Coordinates, end: Coordinates): Promise<Coordinates[]> {
  const waypoints: Coordinates[] = []

  // Principais cidades/pontos de passagem no Brasil
  const majorCities = [
    { name: "São Paulo", lat: -23.5505, lng: -46.6333 },
    { name: "Rio de Janeiro", lat: -22.9068, lng: -43.1729 },
    { name: "Belo Horizonte", lat: -19.9167, lng: -43.9345 },
    { name: "Brasília", lat: -15.7942, lng: -47.8822 },
    { name: "Salvador", lat: -12.9714, lng: -38.5014 },
    { name: "Curitiba", lat: -25.4284, lng: -49.2733 },
    { name: "Porto Alegre", lat: -30.0346, lng: -51.2177 },
    { name: "Recife", lat: -8.0476, lng: -34.877 },
    { name: "Fortaleza", lat: -3.7172, lng: -38.5433 },
    { name: "Goiânia", lat: -16.6869, lng: -49.2648 },
  ]

  // Encontrar cidades intermediárias relevantes
  const startToEndDistance = calculateStraightLineDistance(start, end)

  for (const city of majorCities) {
    const distanceFromStart = calculateStraightLineDistance(start, city)
    const distanceFromEnd = calculateStraightLineDistance(city, end)
    const totalViaCity = distanceFromStart + distanceFromEnd

    // Se passar pela cidade não adiciona mais que 50% da distância direta, considerar
    if (totalViaCity < startToEndDistance * 1.5 && distanceFromStart > startToEndDistance * 0.1) {
      waypoints.push(city)
    }
  }

  // Ordenar waypoints pela distância do ponto de origem
  waypoints.sort((a, b) => {
    const distA = calculateStraightLineDistance(start, a)
    const distB = calculateStraightLineDistance(start, b)
    return distA - distB
  })

  // Limitar a 2 waypoints para não complicar demais
  return waypoints.slice(0, 2)
}

/**
 * Calcula a distância em linha reta entre dois pontos (fórmula de Haversine)
 */
function calculateStraightLineDistance(start: Coordinates, end: Coordinates): number {
  const R = 6371000 // Raio da Terra em metros
  const φ1 = (start.lat * Math.PI) / 180
  const φ2 = (end.lat * Math.PI) / 180
  const Δφ = ((end.lat - start.lat) * Math.PI) / 180
  const Δλ = ((end.lng - start.lng) * Math.PI) / 180

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return R * c // Distância em metros
}
