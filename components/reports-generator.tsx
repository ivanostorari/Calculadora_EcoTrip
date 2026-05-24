"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { FileText, Clock } from "lucide-react";
import { ReportPreview } from "@/components/report-preview";
import { generateMockData, type ReportData } from "@/lib/report-data";

export function ReportsGenerator() {
    const [selectedPeriod, setSelectedPeriod] = useState<string>("2024");
    const [selectedCompany, setSelectedCompany] =
        useState<string>("transportadora-abc");
    const [selectedReportType, setSelectedReportType] =
        useState<string>("annual");
    const [reportData, setReportData] = useState<ReportData | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);

    const companies = [
        {
            id: "transportadora-abc",
            name: "Transportadora ABC Ltda",
            cnpj: "12.345.678/0001-90",
        },
        {
            id: "logistica-xyz",
            name: "Logística XYZ S.A.",
            cnpj: "98.765.432/0001-10",
        },
        {
            id: "frota-verde",
            name: "Frota Verde Transportes",
            cnpj: "11.222.333/0001-44",
        },
    ];

    const reportTypes = [
        {
            id: "annual",
            name: "Relatório Anual",
            description: "Relatório completo do ano",
        },
        {
            id: "quarterly",
            name: "Relatório Trimestral",
            description: "Relatório dos últimos 3 meses",
        },
        {
            id: "monthly",
            name: "Relatório Mensal",
            description: "Relatório do mês atual",
        },
        {
            id: "sustainability",
            name: "Relatório de Sustentabilidade",
            description: "Foco em métricas ambientais",
        },
        {
            id: "compliance",
            name: "Relatório de Compliance",
            description: "Para órgãos reguladores",
        },
    ];

    const handleGenerateReport = async () => {
        setIsGenerating(true);

        // Simular tempo de geração
        await new Promise((resolve) => setTimeout(resolve, 2000));

        const data = generateMockData(
            selectedPeriod,
            selectedReportType,
            selectedCompany
        );
        setReportData(data);
        setIsGenerating(false);
    };

    const getCompanyInfo = () => {
        return companies.find((c) => c.id === selectedCompany);
    };

    const getReportTypeInfo = () => {
        return reportTypes.find((r) => r.id === selectedReportType);
    };

    return (
        <div className="space-y-6">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-green-800 mb-2">
                    Gerador de Relatórios
                </h2>
                <p className="text-gray-600">
                    Gere relatórios completos de emissões de CO2 e
                    sustentabilidade para sua frota
                </p>
            </div>

            <Tabs defaultValue="generator" className="w-full">
                <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto">
                    <TabsTrigger value="generator">Gerar Relatório</TabsTrigger>
                    <TabsTrigger value="templates">Modelos</TabsTrigger>
                </TabsList>

                <TabsContent value="generator" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="h-5 w-5 text-green-700" />
                                Configurações do Relatório
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid md:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="company">Empresa</Label>
                                    <Select
                                        value={selectedCompany}
                                        onValueChange={setSelectedCompany}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecione a empresa" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {companies.map((company) => (
                                                <SelectItem
                                                    key={company.id}
                                                    value={company.id}
                                                >
                                                    <div>
                                                        <div className="font-medium">
                                                            {company.name}
                                                        </div>
                                                        <div className="text-xs text-gray-500">
                                                            {company.cnpj}
                                                        </div>
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="period">Período</Label>
                                    <Select
                                        value={selectedPeriod}
                                        onValueChange={setSelectedPeriod}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecione o período" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="2024">
                                                2024
                                            </SelectItem>
                                            <SelectItem value="2023">
                                                2023
                                            </SelectItem>
                                            <SelectItem value="Q4-2024">
                                                Q4 2024
                                            </SelectItem>
                                            <SelectItem value="Q3-2024">
                                                Q3 2024
                                            </SelectItem>
                                            <SelectItem value="Nov-2024">
                                                Novembro 2024
                                            </SelectItem>
                                            <SelectItem value="Dez-2024">
                                                Dezembro 2024
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="reportType">
                                        Tipo de Relatório
                                    </Label>
                                    <Select
                                        value={selectedReportType}
                                        onValueChange={setSelectedReportType}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecione o tipo" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {reportTypes.map((type) => (
                                                <SelectItem
                                                    key={type.id}
                                                    value={type.id}
                                                >
                                                    <div>
                                                        <div className="font-medium">
                                                            {type.name}
                                                        </div>
                                                        <div className="text-xs text-gray-500">
                                                            {type.description}
                                                        </div>
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="font-medium mb-2">
                                    Resumo da Configuração
                                </h3>
                                <div className="grid md:grid-cols-3 gap-4 text-sm">
                                    <div>
                                        <span className="text-gray-600">
                                            Empresa:
                                        </span>
                                        <div className="font-medium">
                                            {getCompanyInfo()?.name}
                                        </div>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">
                                            Período:
                                        </span>
                                        <div className="font-medium">
                                            {selectedPeriod}
                                        </div>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">
                                            Tipo:
                                        </span>
                                        <div className="font-medium">
                                            {getReportTypeInfo()?.name}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <Button
                                onClick={handleGenerateReport}
                                className="w-full bg-green-600 hover:bg-green-700"
                                disabled={isGenerating}
                            >
                                {isGenerating ? (
                                    <>
                                        <Clock className="mr-2 h-4 w-4 animate-spin" />
                                        Gerando Relatório...
                                    </>
                                ) : (
                                    <>
                                        <FileText className="mr-2 h-4 w-4" />
                                        Gerar Relatório
                                    </>
                                )}
                            </Button>
                        </CardContent>
                    </Card>

                    {reportData && <ReportPreview data={reportData} />}
                </TabsContent>

                <TabsContent value="templates" className="space-y-6">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {reportTypes.map((type) => (
                            <Card
                                key={type.id}
                                className="cursor-pointer hover:shadow-lg transition-shadow"
                            >
                                <CardHeader className="pb-3">
                                    <div className="flex items-center justify-between">
                                        <div className="bg-green-100 p-2 rounded-lg">
                                            <FileText className="h-6 w-6 text-green-600" />
                                        </div>
                                        <Badge variant="outline">Modelo</Badge>
                                    </div>
                                    <CardTitle className="text-lg">
                                        {type.name}
                                    </CardTitle>
                                    <p className="text-sm text-gray-600">
                                        {type.description}
                                    </p>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        <div className="text-sm">
                                            <h4 className="font-medium mb-2">
                                                Inclui:
                                            </h4>
                                            <ul className="space-y-1 text-gray-600">
                                                {type.id === "annual" && (
                                                    <>
                                                        <li>
                                                            • Emissões totais do
                                                            ano
                                                        </li>
                                                        <li>
                                                            • Análise por
                                                            trimestre
                                                        </li>
                                                        <li>
                                                            • Comparativo com
                                                            ano anterior
                                                        </li>
                                                        <li>
                                                            • Metas de
                                                            sustentabilidade
                                                        </li>
                                                    </>
                                                )}
                                                {type.id ===
                                                    "sustainability" && (
                                                    <>
                                                        <li>
                                                            • Pegada de carbono
                                                            detalhada
                                                        </li>
                                                        <li>
                                                            • Iniciativas
                                                            ambientais
                                                        </li>
                                                        <li>
                                                            • Certificações
                                                            obtidas
                                                        </li>
                                                        <li>
                                                            • Planos de redução
                                                        </li>
                                                    </>
                                                )}
                                                {type.id === "compliance" && (
                                                    <>
                                                        <li>
                                                            • Conformidade
                                                            regulatória
                                                        </li>
                                                        <li>
                                                            • Documentação
                                                            oficial
                                                        </li>
                                                        <li>
                                                            • Auditorias
                                                            realizadas
                                                        </li>
                                                        <li>
                                                            • Certificados
                                                            válidos
                                                        </li>
                                                    </>
                                                )}
                                                {(type.id === "quarterly" ||
                                                    type.id === "monthly") && (
                                                    <>
                                                        <li>
                                                            • Emissões do
                                                            período
                                                        </li>
                                                        <li>
                                                            • Tendências
                                                            identificadas
                                                        </li>
                                                        <li>
                                                            • Ações corretivas
                                                        </li>
                                                        <li>
                                                            • Próximos passos
                                                        </li>
                                                    </>
                                                )}
                                            </ul>
                                        </div>
                                        <Button
                                            variant="outline"
                                            className="w-full"
                                            onClick={() => {
                                                setSelectedReportType(type.id);
                                                // Automatically switch to generator tab
                                                const generatorTab =
                                                    document.querySelector(
                                                        '[data-state="inactive"][value="generator"]'
                                                    ) as HTMLElement;
                                                if (generatorTab) {
                                                    generatorTab.click();
                                                }
                                            }}
                                        >
                                            Usar Este Modelo
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>
            </Tabs>

            <div className="bg-white p-6 rounded-lg border">
                <h3 className="text-lg font-semibold text-green-800 mb-3">
                    Sobre os Relatórios
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <h4 className="font-medium mb-2">
                            Características dos Relatórios:
                        </h4>
                        <ul className="space-y-1 text-sm text-gray-600">
                            <li>
                                • Dados baseados em metodologias reconhecidas
                                (GHG Protocol)
                            </li>
                            <li>
                                • Formatação profissional para apresentações
                            </li>
                            <li>• Gráficos e visualizações interativas</li>
                            <li>• Exportação em PDF de alta qualidade</li>
                            <li>• Assinatura digital e timestamp</li>
                            <li>• Conformidade com normas brasileiras</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-medium mb-2">Casos de Uso:</h4>
                        <ul className="space-y-1 text-sm text-gray-600">
                            <li>• Declaração de Imposto de Renda (PJ)</li>
                            <li>• Relatórios para investidores (ESG)</li>
                            <li>• Compliance ambiental (IBAMA, CETESB)</li>
                            <li>• Certificações de sustentabilidade</li>
                            <li>• Auditorias internas e externas</li>
                            <li>• Planejamento estratégico</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
