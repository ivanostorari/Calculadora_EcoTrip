"use client";

import { useState, useEffect, Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
    Loader2,
    MapPin,
    LocateFixed,
    Clock,
    RouteIcon,
    AlertCircle,
    ArrowRightLeft,
    Info,
} from "lucide-react";
import dynamic from "next/dynamic";
import { AddressAutocomplete } from "@/components/address-autocomplete";
import {
    geocodeAddress,
    calculateRouteWithFallback,
} from "@/lib/openroute-service";

// Carregamento dinâmico do componente do mapa para evitar SSR
const RouteMap = dynamic(
    () =>
        import("@/components/route-map").then((mod) => ({
            default: mod.RouteMap,
        })),
    {
        ssr: false,
        loading: () => (
            <div className="h-[500px] w-full flex items-center justify-center bg-gray-100">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-2"></div>
                    <p className="text-gray-600">Carregando mapa...</p>
                </div>
            </div>
        ),
    }
);

export interface Coordinates {
    lat: number;
    lng: number;
}

export interface RouteData {
    distance: number; // metros
    duration: number; // segundos
    geometry: any; // GeoJSON LineString
    isEstimated?: boolean; // Se é uma estimativa ou rota real
}

export function RoutePlanner() {
    const [origin, setOrigin] = useState<string>("");
    const [destination, setDestination] = useState<string>("");
    const [originCoords, setOriginCoords] = useState<Coordinates | null>(null);
    const [destinationCoords, setDestinationCoords] =
        useState<Coordinates | null>(null);
    const [route, setRoute] = useState<RouteData | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<string>("map");

    // Limpar erro quando os inputs mudam
    useEffect(() => {
        if (error) setError(null);
    }, [origin, destination]);

    const handleSwapLocations = () => {
        setOrigin(destination);
        setDestination(origin);
        setOriginCoords(destinationCoords);
        setDestinationCoords(originCoords);

        if (originCoords && destinationCoords) {
            calculateRouteHandler(destinationCoords, originCoords);
        }
    };

    const handleOriginSelect = async (address: string) => {
        setOrigin(address);
        try {
            const coords = await geocodeAddress(address);
            setOriginCoords(coords);

            if (destinationCoords) {
                calculateRouteHandler(coords, destinationCoords);
            }
        } catch (err) {
            console.error("Erro ao geocodificar origem:", err);
            setError(
                "Não foi possível encontrar o endereço de origem. Tente ser mais específico."
            );
        }
    };

    const handleDestinationSelect = async (address: string) => {
        setDestination(address);
        try {
            const coords = await geocodeAddress(address);
            setDestinationCoords(coords);

            if (originCoords) {
                calculateRouteHandler(originCoords, coords);
            }
        } catch (err) {
            console.error("Erro ao geocodificar destino:", err);
            setError(
                "Não foi possível encontrar o endereço de destino. Tente ser mais específico."
            );
        }
    };

    const calculateRouteHandler = async (
        start: Coordinates,
        end: Coordinates
    ) => {
        setLoading(true);
        setError(null);

        try {
            const routeData = await calculateRouteWithFallback(start, end);

            // Marcar como estimativa se não veio de uma API de roteamento real
            const isEstimated =
                !routeData.geometry.coordinates ||
                routeData.geometry.coordinates.length <= 3;

            setRoute({
                ...routeData,
                isEstimated,
            });
            setActiveTab("map"); // Mudar para a aba do mapa quando a rota for calculada
        } catch (err) {
            console.error("Erro ao calcular rota:", err);
            setError(
                "Não foi possível calcular a rota entre os pontos selecionados. Isso pode acontecer quando não há rotas terrestres diretas disponíveis ou quando os serviços de roteamento estão indisponíveis."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleCalculateRoute = async () => {
        if (!origin || !destination) {
            setError("Por favor, informe os endereços de origem e destino.");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // Geocodificar endereços se ainda não tiverem coordenadas
            let startCoords = originCoords;
            let endCoords = destinationCoords;

            if (!startCoords) {
                startCoords = await geocodeAddress(origin);
                setOriginCoords(startCoords);
            }

            if (!endCoords) {
                endCoords = await geocodeAddress(destination);
                setDestinationCoords(endCoords);
            }

            if (startCoords && endCoords) {
                await calculateRouteHandler(startCoords, endCoords);
            } else {
                throw new Error(
                    "Não foi possível obter as coordenadas dos endereços."
                );
            }
        } catch (err) {
            console.error("Erro:", err);
            setError(
                "Não foi possível encontrar os endereços informados. Verifique a ortografia e tente novamente."
            );
        } finally {
            setLoading(false);
        }
    };

    const formatDistance = (meters: number) => {
        if (meters < 1000) {
            return `${meters.toFixed(0)} m`;
        } else {
            return `${(meters / 1000).toFixed(1)} km`;
        }
    };

    const formatDuration = (seconds: number) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);

        if (hours > 0) {
            return `${hours}h ${minutes}min`;
        } else {
            return `${minutes} minutos`;
        }
    };

    return (
        <div className="space-y-6">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-green-800 mb-2">
                    Planejador de Rotas
                </h2>
                <p className="text-gray-600">
                    Calcule rotas otimizadas entre dois pontos e visualize o
                    trajeto no mapa
                </p>
            </div>

            <Card>
                <CardHeader className="pb-3">
                    <CardTitle>Endereços</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-6">
                        <div className="grid gap-4">
                            <div className="space-y-2">
                                <Label
                                    htmlFor="origin"
                                    className="flex items-center gap-2"
                                >
                                    <MapPin className="h-4 w-4 text-green-700" />
                                    Origem
                                </Label>
                                <AddressAutocomplete
                                    id="origin"
                                    value={origin}
                                    onChange={setOrigin}
                                    onSelect={handleOriginSelect}
                                    placeholder="Ex: Vila Andrade, São Paulo, SP"
                                />
                            </div>

                            <div className="flex justify-center">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={handleSwapLocations}
                                    className="rounded-full h-8 w-8 bg-gray-100 hover:bg-gray-200"
                                >
                                    <ArrowRightLeft className="h-4 w-4" />
                                    <span className="sr-only">
                                        Trocar origem e destino
                                    </span>
                                </Button>
                            </div>

                            <div className="space-y-2">
                                <Label
                                    htmlFor="destination"
                                    className="flex items-center gap-2"
                                >
                                    <LocateFixed className="h-4 w-4 text-green-700" />
                                    Destino
                                </Label>
                                <AddressAutocomplete
                                    id="destination"
                                    value={destination}
                                    onChange={setDestination}
                                    onSelect={handleDestinationSelect}
                                    placeholder="Ex: Copacabana, Rio de Janeiro, RJ"
                                />
                            </div>
                        </div>

                        <Button
                            onClick={handleCalculateRoute}
                            className="bg-green-600 hover:bg-green-700"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Calculando...
                                </>
                            ) : (
                                <>Calcular Rota</>
                            )}
                        </Button>

                        {error && (
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertTitle>Erro</AlertTitle>
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}
                    </div>
                </CardContent>
            </Card>

            {route && (
                <Tabs
                    value={activeTab}
                    onValueChange={setActiveTab}
                    className="w-full"
                >
                    <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto">
                        <TabsTrigger value="map">Mapa</TabsTrigger>
                        <TabsTrigger value="details">Detalhes</TabsTrigger>
                    </TabsList>

                    <TabsContent value="map" className="mt-4">
                        <Card>
                            <CardContent className="p-0 overflow-hidden rounded-lg">
                                <div className="h-[500px] w-full">
                                    <Suspense
                                        fallback={
                                            <div className="h-full w-full flex items-center justify-center bg-gray-100">
                                                <div className="text-center">
                                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-2"></div>
                                                    <p className="text-gray-600">
                                                        Carregando mapa...
                                                    </p>
                                                </div>
                                            </div>
                                        }
                                    >
                                        <RouteMap
                                            origin={originCoords}
                                            destination={destinationCoords}
                                            route={route.geometry}
                                        />
                                    </Suspense>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="details" className="mt-4">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    Detalhes da Rota
                                    {route.isEstimated && (
                                        <Badge
                                            variant="outline"
                                            className="text-orange-700 border-orange-300"
                                        >
                                            <Info className="h-3 w-3 mr-1" />
                                            Estimativa
                                        </Badge>
                                    )}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-6">
                                    {route.isEstimated && (
                                        <Alert>
                                            <Info className="h-4 w-4" />
                                            <AlertTitle>
                                                Rota Estimada
                                            </AlertTitle>
                                            <AlertDescription>
                                                Esta é uma estimativa baseada em
                                                cálculos geográficos e
                                                principais rodovias brasileiras.
                                                Os valores podem variar da rota
                                                real devido a condições de
                                                tráfego, obras e outras
                                                variáveis.
                                            </AlertDescription>
                                        </Alert>
                                    )}

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <div className="flex items-center gap-2 mb-2">
                                                <RouteIcon className="h-5 w-5 text-green-700" />
                                                <h3 className="font-medium">
                                                    Distância
                                                </h3>
                                            </div>
                                            <p className="text-2xl font-bold">
                                                {formatDistance(route.distance)}
                                            </p>
                                            {route.isEstimated && (
                                                <p className="text-xs text-gray-500 mt-1">
                                                    Estimativa por rodovias
                                                </p>
                                            )}
                                        </div>

                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Clock className="h-5 w-5 text-green-700" />
                                                <h3 className="font-medium">
                                                    Tempo Estimado
                                                </h3>
                                            </div>
                                            <p className="text-2xl font-bold">
                                                {formatDuration(route.duration)}
                                            </p>
                                            {route.isEstimated && (
                                                <p className="text-xs text-gray-500 mt-1">
                                                    Baseado em 80 km/h médio
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-start gap-3">
                                            <div className="bg-green-100 p-2 rounded-full mt-1">
                                                <MapPin className="h-4 w-4 text-green-700" />
                                            </div>
                                            <div>
                                                <h4 className="font-medium">
                                                    Origem
                                                </h4>
                                                <p className="text-gray-600">
                                                    {origin}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3">
                                            <div className="bg-green-100 p-2 rounded-full mt-1">
                                                <LocateFixed className="h-4 w-4 text-green-700" />
                                            </div>
                                            <div>
                                                <h4 className="font-medium">
                                                    Destino
                                                </h4>
                                                <p className="text-gray-600">
                                                    {destination}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            )}

            <div className="bg-white p-6 rounded-lg border">
                <h3 className="text-lg font-semibold text-green-800 mb-3">
                    Sobre o Planejador de Rotas
                </h3>
                <p className="mb-4">
                    O Planejador de Rotas da LogiCO2 utiliza múltiplas fontes de
                    dados para calcular trajetos otimizados entre dois pontos no
                    Brasil. Quando possível, utilizamos APIs de roteamento em
                    tempo real. Em casos onde isso não é possível, fornecemos
                    estimativas inteligentes baseadas na geografia e principais
                    rodovias brasileiras.
                </p>
                <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
                    <div>
                        <h4 className="font-medium text-gray-800 mb-2">
                            Fontes de Dados:
                        </h4>
                        <ul className="space-y-1">
                            <li>• OpenRouteService (principal)</li>
                            <li>• OSRM (fallback)</li>
                            <li>• Nominatim/OpenStreetMap</li>
                            <li>• Cálculos geográficos inteligentes</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-medium text-gray-800 mb-2">
                            Considerações:
                        </h4>
                        <ul className="space-y-1">
                            <li>• Rotas terrestres prioritárias</li>
                            <li>• Principais rodovias brasileiras</li>
                            <li>• Estimativas conservadoras</li>
                            <li>• Velocidade média de 80 km/h</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
