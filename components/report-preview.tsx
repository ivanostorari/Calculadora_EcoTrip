"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
    Download,
    FileText,
    TrendingUp,
    TrendingDown,
    Truck,
    Navigation,
    Leaf,
    Target,
    AlertTriangle,
    CheckCircle,
    BarChart3,
    Calendar,
    MapPin,
    Fuel,
    Droplets,
    Clock,
    Shield,
    Loader2,
    ArrowLeft,
} from "lucide-react";
import type { ReportData } from "@/lib/report-data";
import { generateAndDownloadPDF } from "@/lib/pdf-generator";

interface ReportPreviewProps {
    data: ReportData;
    onBack?: () => void;
}

export function ReportPreview({ data, onBack }: ReportPreviewProps) {
    const [activeSection, setActiveSection] = useState("summary");
    const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

    const formatNumber = (num: number) => {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + "M";
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + "K";
        } else {
            return num.toLocaleString("pt-BR");
        }
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
        }).format(value);
    };

    const formatDateBR = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("pt-BR", {
            timeZone: "America/Sao_Paulo",
        });
    };

    const formatDateTimeBR = (dateString: string) => {
        return new Date(dateString).toLocaleString("pt-BR", {
            timeZone: "America/Sao_Paulo",
        });
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "valid":
            case "active":
            case "completed":
            case "achieved":
                return <CheckCircle className="h-4 w-4 text-green-600" />;
            case "expired":
            case "inactive":
            case "at-risk":
                return <AlertTriangle className="h-4 w-4 text-red-600" />;
            case "pending":
            case "maintenance":
            case "in-progress":
            case "on-track":
                return <Clock className="h-4 w-4 text-yellow-600" />;
            default:
                return <CheckCircle className="h-4 w-4 text-gray-400" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "valid":
            case "active":
            case "completed":
            case "achieved":
                return "bg-green-100 text-green-800";
            case "expired":
            case "inactive":
            case "at-risk":
                return "bg-red-100 text-red-800";
            case "pending":
            case "maintenance":
            case "in-progress":
            case "on-track":
                return "bg-yellow-100 text-yellow-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const calculateEmissionChange = () => {
        const current = data.summary.totalEmissions;
        const previous = data.comparison.previousPeriod.emissions;
        return (((current - previous) / previous) * 100).toFixed(1);
    };

    const calculateEfficiencyChange = () => {
        const current = data.summary.averageEfficiency;
        const previous = data.comparison.previousPeriod.efficiency;
        return (((current - previous) / previous) * 100).toFixed(1);
    };

    const handleDownloadPDF = async () => {
        setIsGeneratingPDF(true);
        try {
            await generateAndDownloadPDF(data);
        } catch (error) {
            console.error("Erro ao gerar PDF:", error);
            alert("Erro ao gerar PDF. Tente novamente.");
        } finally {
            setIsGeneratingPDF(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Back button if onBack is provided */}
            {onBack && (
                <Button variant="outline" onClick={onBack} className="mb-4">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Voltar aos Modelos
                </Button>
            )}

            {/* Header do Relatório */}
            <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <div>
                            <CardTitle className="text-2xl text-green-800 mb-2">
                                Relatório de Sustentabilidade
                            </CardTitle>
                            <div className="space-y-1 text-sm text-green-700">
                                <p className="font-semibold">
                                    {data.company.name}
                                </p>
                                <p>CNPJ: {data.company.cnpj}</p>
                                <p>
                                    Período: {formatDateBR(data.period.start)} a{" "}
                                    {formatDateBR(data.period.end)}
                                </p>
                                <p>
                                    Gerado em:{" "}
                                    {formatDateTimeBR(data.generatedAt)}
                                </p>
                            </div>
                        </div>
                        <div className="text-right">
                            <Badge className="mb-2 bg-green-600">
                                {data.reportType === "annual"
                                    ? "Relatório Anual"
                                    : data.reportType === "quarterly"
                                    ? "Relatório Trimestral"
                                    : data.reportType === "monthly"
                                    ? "Relatório Mensal"
                                    : data.reportType === "sustainability"
                                    ? "Sustentabilidade"
                                    : "Compliance"}
                            </Badge>
                            <div className="text-xs text-green-600">
                                ID: RPT-{Date.now().toString().slice(-6)}
                            </div>
                        </div>
                    </div>
                </CardHeader>
            </Card>

            {/* Resumo Executivo */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5 text-green-700" />
                        Resumo Executivo
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid md:grid-cols-4 gap-6">
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                                <Leaf className="h-5 w-5 text-green-700" />
                                <h3 className="font-medium">Emissões Totais</h3>
                            </div>
                            <p className="text-2xl font-bold">
                                {formatNumber(data.summary.totalEmissions)} kg
                                CO2
                            </p>
                            <div className="flex items-center gap-1 mt-1">
                                {Number(calculateEmissionChange()) < 0 ? (
                                    <TrendingDown className="h-4 w-4 text-green-600" />
                                ) : (
                                    <TrendingUp className="h-4 w-4 text-red-600" />
                                )}
                                <span
                                    className={`text-sm ${
                                        Number(calculateEmissionChange()) < 0
                                            ? "text-green-600"
                                            : "text-red-600"
                                    }`}
                                >
                                    {Math.abs(
                                        Number(calculateEmissionChange())
                                    )}
                                    % vs período anterior
                                </span>
                            </div>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                                <Navigation className="h-5 w-5 text-green-700" />
                                <h3 className="font-medium">Distância Total</h3>
                            </div>
                            <p className="text-2xl font-bold">
                                {formatNumber(data.summary.totalDistance)} km
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                                {data.summary.totalTrips} viagens realizadas
                            </p>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                                <Fuel className="h-5 w-5 text-green-700" />
                                <h3 className="font-medium">
                                    Eficiência Média
                                </h3>
                            </div>
                            <p className="text-2xl font-bold">
                                {data.summary.averageEfficiency} km/L
                            </p>
                            <div className="flex items-center gap-1 mt-1">
                                {Number(calculateEfficiencyChange()) > 0 ? (
                                    <TrendingUp className="h-4 w-4 text-green-600" />
                                ) : (
                                    <TrendingDown className="h-4 w-4 text-red-600" />
                                )}
                                <span
                                    className={`text-sm ${
                                        Number(calculateEfficiencyChange()) > 0
                                            ? "text-green-600"
                                            : "text-red-600"
                                    }`}
                                >
                                    {Math.abs(
                                        Number(calculateEfficiencyChange())
                                    )}
                                    % vs período anterior
                                </span>
                            </div>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                                <Droplets className="h-5 w-5 text-green-700" />
                                <h3 className="font-medium">Pegada Hídrica</h3>
                            </div>
                            <p className="text-2xl font-bold">
                                {formatNumber(data.summary.waterFootprint)} L
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                                {formatNumber(data.summary.treesEquivalent)}{" "}
                                árvores equiv.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Navegação por Seções */}
            <Tabs
                value={activeSection}
                onValueChange={setActiveSection}
                className="w-full"
            >
                <TabsList className="grid grid-cols-6 w-full">
                    <TabsTrigger value="summary">Resumo</TabsTrigger>
                    <TabsTrigger value="vehicles">Frota</TabsTrigger>
                    <TabsTrigger value="routes">Rotas</TabsTrigger>
                    <TabsTrigger value="timeline">Temporal</TabsTrigger>
                    <TabsTrigger value="initiatives">Iniciativas</TabsTrigger>
                    <TabsTrigger value="compliance">Compliance</TabsTrigger>
                </TabsList>

                <TabsContent value="summary" className="space-y-6">
                    {/* Comparativo com Setor */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Target className="h-5 w-5 text-green-700" />
                                Posicionamento no Setor
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid md:grid-cols-3 gap-6">
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-green-600 mb-2">
                                        #{data.comparison.industry.ranking}
                                    </div>
                                    <p className="text-sm text-gray-600">
                                        Posição no ranking de sustentabilidade
                                    </p>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-green-600 mb-2">
                                        {(
                                            ((data.comparison.industry
                                                .avgEmissions -
                                                data.summary.totalEmissions) /
                                                data.comparison.industry
                                                    .avgEmissions) *
                                            100
                                        ).toFixed(1)}
                                        %
                                    </div>
                                    <p className="text-sm text-gray-600">
                                        Abaixo da média do setor em emissões
                                    </p>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-green-600 mb-2">
                                        {(
                                            ((data.summary.averageEfficiency -
                                                data.comparison.industry
                                                    .avgEfficiency) /
                                                data.comparison.industry
                                                    .avgEfficiency) *
                                            100
                                        ).toFixed(1)}
                                        %
                                    </div>
                                    <p className="text-sm text-gray-600">
                                        Acima da média do setor em eficiência
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Metas e Objetivos */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Target className="h-5 w-5 text-green-700" />
                                Metas de Sustentabilidade 2025
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="font-medium">
                                            Redução de Emissões
                                        </span>
                                        <span className="text-sm text-gray-600">
                                            {data.targets.emissionReduction}%
                                            até{" "}
                                            {new Date(
                                                data.targets.deadline
                                            ).getFullYear()}
                                        </span>
                                    </div>
                                    <Progress value={65} className="h-2" />
                                    <p className="text-xs text-gray-500 mt-1">
                                        65% do progresso alcançado
                                    </p>
                                </div>
                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="font-medium">
                                            Melhoria de Eficiência
                                        </span>
                                        <span className="text-sm text-gray-600">
                                            {data.targets.efficiencyImprovement}
                                            % até{" "}
                                            {new Date(
                                                data.targets.deadline
                                            ).getFullYear()}
                                        </span>
                                    </div>
                                    <Progress value={45} className="h-2" />
                                    <p className="text-xs text-gray-500 mt-1">
                                        45% do progresso alcançado
                                    </p>
                                </div>
                                <div className="flex items-center gap-2 mt-4">
                                    {getStatusIcon(data.targets.status)}
                                    <Badge
                                        className={getStatusColor(
                                            data.targets.status
                                        )}
                                    >
                                        {data.targets.status === "on-track"
                                            ? "No Prazo"
                                            : data.targets.status === "at-risk"
                                            ? "Em Risco"
                                            : "Alcançado"}
                                    </Badge>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="vehicles" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Truck className="h-5 w-5 text-green-700" />
                                Análise da Frota ({data.vehicles.length}{" "}
                                veículos)
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {data.vehicles.map((vehicle) => (
                                    <div
                                        key={vehicle.id}
                                        className="border rounded-lg p-4"
                                    >
                                        <div className="flex justify-between items-start mb-3">
                                            <div>
                                                <h3 className="font-medium">
                                                    {vehicle.model} -{" "}
                                                    {vehicle.plate}
                                                </h3>
                                                <p className="text-sm text-gray-600">
                                                    {vehicle.year} •{" "}
                                                    {vehicle.fuelType}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {getStatusIcon(vehicle.status)}
                                                <Badge
                                                    className={getStatusColor(
                                                        vehicle.status
                                                    )}
                                                >
                                                    {vehicle.status === "active"
                                                        ? "Ativo"
                                                        : vehicle.status ===
                                                          "maintenance"
                                                        ? "Manutenção"
                                                        : "Inativo"}
                                                </Badge>
                                            </div>
                                        </div>
                                        <div className="grid md:grid-cols-4 gap-4 text-sm">
                                            <div>
                                                <span className="text-gray-600">
                                                    Emissões:
                                                </span>
                                                <div className="font-medium">
                                                    {formatNumber(
                                                        vehicle.emissions
                                                    )}{" "}
                                                    kg CO2
                                                </div>
                                            </div>
                                            <div>
                                                <span className="text-gray-600">
                                                    Distância:
                                                </span>
                                                <div className="font-medium">
                                                    {formatNumber(
                                                        vehicle.distance
                                                    )}{" "}
                                                    km
                                                </div>
                                            </div>
                                            <div>
                                                <span className="text-gray-600">
                                                    Viagens:
                                                </span>
                                                <div className="font-medium">
                                                    {vehicle.trips}
                                                </div>
                                            </div>
                                            <div>
                                                <span className="text-gray-600">
                                                    Eficiência:
                                                </span>
                                                <div className="font-medium">
                                                    {vehicle.efficiency} km/L
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="routes" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Navigation className="h-5 w-5 text-green-700" />
                                Principais Rotas ({data.routes.length} rotas)
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {data.routes.map((route) => (
                                    <div
                                        key={route.id}
                                        className="border rounded-lg p-4"
                                    >
                                        <div className="flex justify-between items-start mb-3">
                                            <div>
                                                <h3 className="font-medium">
                                                    {route.name}
                                                </h3>
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <MapPin className="h-4 w-4" />
                                                    {route.origin} →{" "}
                                                    {route.destination}
                                                </div>
                                            </div>
                                            <Badge variant="outline">
                                                {route.frequency} viagens
                                            </Badge>
                                        </div>
                                        <div className="grid md:grid-cols-4 gap-4 text-sm">
                                            <div>
                                                <span className="text-gray-600">
                                                    Distância:
                                                </span>
                                                <div className="font-medium">
                                                    {route.distance} km
                                                </div>
                                            </div>
                                            <div>
                                                <span className="text-gray-600">
                                                    Emissões:
                                                </span>
                                                <div className="font-medium">
                                                    {formatNumber(
                                                        route.emissions
                                                    )}{" "}
                                                    kg CO2
                                                </div>
                                            </div>
                                            <div>
                                                <span className="text-gray-600">
                                                    Tempo Médio:
                                                </span>
                                                <div className="font-medium">
                                                    {Math.floor(
                                                        route.avgTime / 60
                                                    )}
                                                    h {route.avgTime % 60}min
                                                </div>
                                            </div>
                                            <div>
                                                <span className="text-gray-600">
                                                    CO2/km:
                                                </span>
                                                <div className="font-medium">
                                                    {(
                                                        route.emissions /
                                                        (route.distance *
                                                            route.frequency)
                                                    ).toFixed(2)}{" "}
                                                    kg
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="timeline" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Calendar className="h-5 w-5 text-green-700" />
                                Evolução Temporal
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="grid grid-cols-12 gap-2 text-xs text-gray-600 mb-2">
                                    <div>Mês</div>
                                    <div className="col-span-3">
                                        Emissões (kg CO2)
                                    </div>
                                    <div className="col-span-3">
                                        Distância (km)
                                    </div>
                                    <div className="col-span-2">Viagens</div>
                                    <div className="col-span-3">
                                        Eficiência (km/L)
                                    </div>
                                </div>
                                {data.timeline
                                    .slice(-6)
                                    .map((period, index) => (
                                        <div
                                            key={period.period}
                                            className="grid grid-cols-12 gap-2 items-center py-2 border-b"
                                        >
                                            <div className="font-medium">
                                                {new Date(
                                                    period.period
                                                ).toLocaleDateString("pt-BR", {
                                                    month: "short",
                                                    timeZone:
                                                        "America/Sao_Paulo",
                                                })}
                                            </div>
                                            <div className="col-span-3">
                                                {formatNumber(period.emissions)}
                                            </div>
                                            <div className="col-span-3">
                                                {formatNumber(period.distance)}
                                            </div>
                                            <div className="col-span-2">
                                                {period.trips}
                                            </div>
                                            <div className="col-span-3">
                                                {period.efficiency}
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="initiatives" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Leaf className="h-5 w-5 text-green-700" />
                                Iniciativas de Sustentabilidade
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {data.initiatives.map((initiative, index) => (
                                    <div
                                        key={index}
                                        className="border rounded-lg p-4"
                                    >
                                        <div className="flex justify-between items-start mb-3">
                                            <div>
                                                <h3 className="font-medium">
                                                    {initiative.name}
                                                </h3>
                                                <p className="text-sm text-gray-600 mt-1">
                                                    {initiative.description}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {getStatusIcon(
                                                    initiative.status
                                                )}
                                                <Badge
                                                    className={getStatusColor(
                                                        initiative.status
                                                    )}
                                                >
                                                    {initiative.status ===
                                                    "completed"
                                                        ? "Concluído"
                                                        : initiative.status ===
                                                          "in-progress"
                                                        ? "Em Andamento"
                                                        : "Planejado"}
                                                </Badge>
                                            </div>
                                        </div>
                                        <div className="grid md:grid-cols-3 gap-4 text-sm">
                                            <div>
                                                <span className="text-gray-600">
                                                    Impacto:
                                                </span>
                                                <div className="font-medium text-green-600">
                                                    -
                                                    {formatNumber(
                                                        initiative.impact
                                                    )}{" "}
                                                    kg CO2
                                                </div>
                                            </div>
                                            <div>
                                                <span className="text-gray-600">
                                                    Investimento:
                                                </span>
                                                <div className="font-medium">
                                                    {formatCurrency(
                                                        initiative.investment
                                                    )}
                                                </div>
                                            </div>
                                            <div>
                                                <span className="text-gray-600">
                                                    ROI Ambiental:
                                                </span>
                                                <div className="font-medium">
                                                    {(
                                                        initiative.impact /
                                                        (initiative.investment /
                                                            1000)
                                                    ).toFixed(1)}{" "}
                                                    kg CO2/R$ mil
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="compliance" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Shield className="h-5 w-5 text-green-700" />
                                Certificações e Compliance
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {data.certifications.map((cert, index) => (
                                    <div
                                        key={index}
                                        className="border rounded-lg p-4"
                                    >
                                        <div className="flex justify-between items-start mb-3">
                                            <div>
                                                <h3 className="font-medium">
                                                    {cert.name}
                                                </h3>
                                                <p className="text-sm text-gray-600">
                                                    Emissor: {cert.issuer}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {getStatusIcon(cert.status)}
                                                <Badge
                                                    className={getStatusColor(
                                                        cert.status
                                                    )}
                                                >
                                                    {cert.status === "valid"
                                                        ? "Válido"
                                                        : cert.status ===
                                                          "expired"
                                                        ? "Expirado"
                                                        : "Pendente"}
                                                </Badge>
                                            </div>
                                        </div>
                                        <div className="text-sm">
                                            <span className="text-gray-600">
                                                Válido até:
                                            </span>
                                            <span className="font-medium ml-2">
                                                {formatDateBR(cert.validUntil)}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Ações do Relatório */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h3 className="font-medium mb-1">
                                Relatório Gerado com Sucesso
                            </h3>
                            <p className="text-sm text-gray-600">
                                Este relatório contém {data.vehicles.length}{" "}
                                veículos, {data.routes.length} rotas principais
                                e {data.initiatives.length} iniciativas de
                                sustentabilidade.
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <Button
                                onClick={handleDownloadPDF}
                                className="bg-green-600 hover:bg-green-700"
                                disabled={isGeneratingPDF}
                            >
                                {isGeneratingPDF ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Gerando PDF...
                                    </>
                                ) : (
                                    <>
                                        <Download className="mr-2 h-4 w-4" />
                                        Baixar PDF
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
