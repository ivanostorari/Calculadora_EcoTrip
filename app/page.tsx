"use client";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Calculator,
    BarChart3,
    FileText,
    Route,
    Truck,
    Zap,
    CheckCircle,
    ArrowRight,
    Leaf,
    Target,
    TrendingDown,
    Shield,
} from "lucide-react";
import { LogoHeader } from "@/components/logo-header";
import Link from "next/link";

const features = [
    {
        id: "calculator",
        title: "Calculadora de Impacto CO2",
        description:
            "Calcule precisamente as emissões de CO2 do transporte rodoviário brasileiro com base em dados técnicos detalhados.",
        icon: Calculator,
        status: "available",
        href: "/calculator",
        highlights: [
            "Cálculos precisos",
            "Dados brasileiros",
            "Múltiplos combustíveis",
            "Relatório detalhado",
        ],
    },
    {
        id: "routes",
        title: "Planejamento de Rotas",
        description:
            "Calcule rotas otimizadas entre dois pontos e visualize o trajeto no mapa com detalhes de distância e tempo.",
        icon: Route,
        status: "available",
        href: "/routes",
        highlights: [
            "Geocodificação brasileira",
            "Cálculo em tempo real",
            "Visualização no mapa",
            "Distância e tempo estimado",
        ],
    },
    {
        id: "reports",
        title: "Relatórios e Análises",
        description:
            "Gere relatórios completos de sustentabilidade e análises comparativas para tomada de decisão.",
        icon: FileText,
        status: "available",
        href: "/reports",
        highlights: [
            "Relatórios automáticos",
            "Análises comparativas",
            "Exportação PDF",
            "Compliance ambiental",
        ],
    }
];

const benefits = [
    {
        icon: Target,
        title: "Precisão Brasileira",
        description:
            "Cálculos baseados em dados específicos do Brasil, considerando tipos de combustível, regulamentações e condições locais.",
    },
    {
        icon: TrendingDown,
        title: "Redução de Custos",
        description:
            "Identifique oportunidades de economia através da otimização de rotas e melhoria da eficiência energética.",
    },
    {
        icon: Shield,
        title: "Compliance Ambiental",
        description:
            "Mantenha-se em conformidade com regulamentações ambientais e prepare-se para futuras legislações.",
    },
    {
        icon: Leaf,
        title: "Sustentabilidade Real",
        description:
            "Contribua efetivamente para a redução das emissões de CO2 no setor de transporte brasileiro.",
    },
];

export default function LandingPage() {
    const handleFeatureClick = (feature: (typeof features)[0]) => {
        if (feature.status !== "available") {
            alert(
                "Esta funcionalidade está em desenvolvimento e será disponibilizada em breve!"
            );
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "available":
                return (
                    <Badge
                        variant="green"
                        className="bg-green-100 text-green-800"
                    >
                        Disponível
                    </Badge>
                );
            case "development":
                return (
                    <Badge
                        variant="outline"
                        className="border-orange-300 text-orange-700"
                    >
                        Em Desenvolvimento
                    </Badge>
                );
            default:
                return null;
        }
    };

    return (
        <main className="min-h-screen bg-white">
            <LogoHeader />

            {/* Hero Section */}
            <section className="py-12 bg-gradient-to-b from-green-50 to-white">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                        Transforme o Transporte Rodoviário em uma
                        <span className="text-green-600">
                            {" "}
                            Operação Sustentável
                        </span>
                    </h1>
                    <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                        A LogiCO2 oferece ferramentas avançadas para calcular,
                        monitorar e reduzir as emissões de CO2 no transporte
                        rodoviário brasileiro, ajudando empresas a alcançar suas
                        metas de sustentabilidade.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/calculator">
                            <Button
                                size="lg"
                                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3"
                            >
                                Testar Calculadora
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                        <Button
                            size="lg"
                            variant="outline"
                            className="border-green-600 text-green-600 hover:bg-green-50 px-8 py-3"
                            onClick={() =>
                                document
                                    .getElementById("features")
                                    ?.scrollIntoView({ behavior: "smooth" })
                            }
                        >
                            Ver Funcionalidades
                        </Button>
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">
                            Por que Escolher a LogiCO2?
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Nossa solução foi desenvolvida especificamente para
                            o mercado brasileiro, considerando as
                            particularidades do transporte rodoviário nacional.
                        </p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {benefits.map((benefit, index) => (
                            <div key={index} className="text-center">
                                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <benefit.icon className="h-8 w-8 text-green-600" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    {benefit.title}
                                </h3>
                                <p className="text-gray-600">
                                    {benefit.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-16 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">
                            Funcionalidades da Plataforma
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Explore as principais funcionalidades da LogiCO2. A
                            calculadora, o planejador de rotas e o gerador de
                            relatórios estão disponíveis para teste, enquanto
                            outras funcionalidades estão em desenvolvimento.
                        </p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature) => (
                            <Card
                                key={feature.id}
                                className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                                    feature.status === "available"
                                        ? "border-green-200 hover:border-green-300 bg-green-50/30"
                                        : "hover:border-gray-300"
                                }`}
                                onClick={() => handleFeatureClick(feature)}
                            >
                                <CardHeader>
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center">
                                            <feature.icon className="h-6 w-6 text-green-600" />
                                        </div>
                                        {getStatusBadge(feature.status)}
                                    </div>
                                    <CardTitle className="text-lg">
                                        {feature.title}
                                    </CardTitle>
                                    <CardDescription>
                                        {feature.description}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-2">
                                        {feature.highlights.map(
                                            (highlight, index) => (
                                                <li
                                                    key={index}
                                                    className="flex items-center text-sm text-gray-600"
                                                >
                                                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                                                    {highlight}
                                                </li>
                                            )
                                        )}
                                    </ul>
                                    <div className="mt-4">
                                        {feature.status === "available" ? (
                                            <Link href={feature.href}>
                                                <Button className="w-full bg-green-600 hover:bg-green-700">
                                                    Testar Agora
                                                    <ArrowRight className="ml-2 h-4 w-4" />
                                                </Button>
                                            </Link>
                                        ) : (
                                            <Button
                                                className="w-full bg-gray-400 hover:bg-gray-500"
                                                disabled
                                            >
                                                Em Breve
                                            </Button>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 bg-green-600">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">
                        Pronto para Reduzir o Impacto Ambiental da sua Frota?
                    </h2>
                    <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
                        Comece agora mesmo testando nossas ferramentas e
                        descubra como sua operação pode se tornar mais
                        sustentável.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/calculator">
                            <Button
                                size="lg"
                                className="bg-white text-green-600 hover:bg-gray-100 px-8 py-3"
                            >
                                Testar Calculadora
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                        <Link href="/routes">
                            <Button
                                size="lg"
                                className="bg-green-700 text-white hover:bg-green-800 px-8 py-3"
                            >
                                Planejar Rotas
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                        <Link href="/reports">
                            <Button
                                size="lg"
                                className="bg-green-500 text-white hover:bg-green-600 px-8 py-3"
                            >
                                Gerar Relatórios
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-8 bg-gray-900 text-white">
                <div className="container mx-auto px-4 text-center">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <div className="relative">
                            <div className="bg-green-600 p-2 rounded-lg">
                                <Truck className="h-6 w-6 text-white" />
                            </div>
                            <div className="absolute -bottom-1 -right-1 bg-white p-1 rounded-full border-2 border-green-600">
                                <Leaf className="h-3 w-3 text-green-600" />
                            </div>
                        </div>
                        <h3 className="text-2xl font-bold">
                            <span className="text-white">Logi</span>
                            <span className="text-green-400">CO</span>
                            <span className="text-green-300 text-xl align-text-top">
                                2
                            </span>
                        </h3>
                    </div>
                    <p className="text-gray-400 mb-4">
                        Transformando o transporte rodoviário brasileiro através
                        da sustentabilidade e tecnologia.
                    </p>
                    <p className="text-sm text-gray-500">
                        © 2025 LogiCO
                        <span className="text-xs align-text-top">2</span> -
                        Protótipo desenvolvido para hackathon
                    </p>
                </div>
            </footer>
        </main>
    );
}
