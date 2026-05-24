"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import { createRoot } from "react-dom/client"
import type { Coordinates } from "./route-planner"
import 'leaflet/dist/leaflet.css'

interface RouteMapProps {
  origin: Coordinates | null
  destination: Coordinates | null
  route: any // GeoJSON LineString
}

// Função para criar ícone personalizado com Lucide React
const createCustomIcon = (IconComponent: React.ComponentType<any>, color: string, bgColor: string) => {
  const iconElement = document.createElement("div")
  iconElement.className = "custom-marker-wrapper"

  const root = createRoot(iconElement)
  root.render(
    <div
      className={`w-8 h-8 ${bgColor} rounded-full flex items-center justify-center border-2 border-white shadow-lg`}
      style={{ backgroundColor: bgColor === "bg-green-600" ? "#16a34a" : "#dc2626" }}
    >
      <IconComponent className={`h-5 w-5 ${color}`} style={{ color: "white" }} />
    </div>,
  )

  return {
    className: "custom-marker-icon",
    html: iconElement.outerHTML,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  }
}

export function RouteMap({ origin, destination, route }: RouteMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const leafletMapRef = useRef<any>(null)
  const routeLayerRef = useRef<any>(null)
  const markersLayerRef = useRef<any>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [L, setL] = useState<any>(null)
  const [MapPin, setMapPin] = useState<any>(null)
  const [Target, setTarget] = useState<any>(null)

  // Carregar Leaflet e ícones dinamicamente apenas no cliente
useEffect(() => {
  const loadLeaflet = async () => {
    try {
      // Importar Leaflet dinamicamente
      const leaflet = await import("leaflet")
      // Importar ícones do Lucide
      const { MapPin: MapPinIcon, Target: TargetIcon } = await import("lucide-react")
      setL(leaflet.default)
      setMapPin(() => MapPinIcon)
      setTarget(() => TargetIcon)
      setIsLoaded(true)
    } catch (error) {
      console.error("Erro ao carregar Leaflet:", error)
    }
  }
  loadLeaflet()
}, [])

  // Inicializar o mapa
  useEffect(() => {
    if (!mapRef.current || !isLoaded || !L) return

    // Verificar se o mapa já foi inicializado
    if (!leafletMapRef.current) {
      // Criar o mapa
      const map = L.map(mapRef.current).setView([-15.77972, -47.92972], 5) // Centro no Brasil

      // Adicionar camada de tiles (OpenStreetMap)
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map)

      // Salvar referência do mapa
      leafletMapRef.current = map

      // Criar layer group para marcadores
      markersLayerRef.current = L.layerGroup().addTo(map)
    }

    // Limpar ao desmontar
    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove()
        leafletMapRef.current = null
      }
    }
  }, [isLoaded, L])

  // Atualizar marcadores e rota quando as coordenadas ou a rota mudarem
  useEffect(() => {
    if (!isLoaded || !L || !MapPin || !Target) return

    const map = leafletMapRef.current
    const markersLayer = markersLayerRef.current

    if (!map || !markersLayer) return

    // Limpar marcadores existentes
    markersLayer.clearLayers()

    // Criar ícones personalizados usando Lucide React
    const originIcon = L.divIcon(createCustomIcon(MapPin, "text-white", "bg-green-600"))
    const destinationIcon = L.divIcon(createCustomIcon(Target, "text-white", "bg-red-600"))

    // Adicionar marcadores se as coordenadas existirem
    const bounds = new L.LatLngBounds([])

    if (origin) {
      L.marker([origin.lat, origin.lng], { icon: originIcon })
        .bindPopup("Origem", { offset: [0, -16] })
        .addTo(markersLayer)
      bounds.extend([origin.lat, origin.lng])
    }

    if (destination) {
      L.marker([destination.lat, destination.lng], { icon: destinationIcon })
        .bindPopup("Destino", { offset: [0, -16] })
        .addTo(markersLayer)
      bounds.extend([destination.lat, destination.lng])
    }

    // Adicionar ou atualizar a rota
    if (route) {
      // Remover rota anterior se existir
      if (routeLayerRef.current) {
        map.removeLayer(routeLayerRef.current)
      }

      // Adicionar nova rota
      routeLayerRef.current = L.geoJSON(route, {
        style: {
          color: "#16a34a",
          weight: 5,
          opacity: 0.8,
          lineCap: "round",
          lineJoin: "round",
        },
      }).addTo(map)

      // Ajustar os limites do mapa para incluir a rota
      if (routeLayerRef.current) {
        const routeBounds = routeLayerRef.current.getBounds()
        if (routeBounds.isValid()) {
          bounds.extend(routeBounds)
        }
      }
    }

    // Ajustar o zoom para mostrar todos os elementos
    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [50, 50] })
    }
  }, [origin, destination, route, isLoaded, L, MapPin, Target])

  if (!isLoaded) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-2"></div>
          <p className="text-gray-600">Carregando mapa...</p>
        </div>
      </div>
    )
  }

  return <div ref={mapRef} className="h-full w-full" />
}
