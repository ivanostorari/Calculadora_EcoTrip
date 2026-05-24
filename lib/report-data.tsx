export interface ReportData {
    // Informações básicas
    company: {
        name: string;
        cnpj: string;
        address: string;
        contact: string;
    };
    period: {
        start: string;
        end: string;
        type: string;
    };
    reportType: string;
    generatedAt: string;

    // Métricas principais
    summary: {
        totalEmissions: number; // kg CO2
        totalDistance: number; // km
        totalTrips: number;
        totalFuelConsumed: number; // litros
        averageEfficiency: number; // km/L
        waterFootprint: number; // litros
        treesEquivalent: number;
    };

    // Dados por veículo
    vehicles: Array<{
        id: string;
        plate: string;
        model: string;
        year: number;
        type: string;
        fuelType: string;
        emissions: number;
        distance: number;
        trips: number;
        efficiency: number;
        status: "active" | "maintenance" | "inactive";
    }>;

    // Dados por rota
    routes: Array<{
        id: string;
        name: string;
        origin: string;
        destination: string;
        distance: number;
        frequency: number;
        emissions: number;
        avgTime: number;
    }>;

    // Dados temporais
    timeline: Array<{
        period: string;
        emissions: number;
        distance: number;
        trips: number;
        efficiency: number;
    }>;

    // Comparativos
    comparison: {
        previousPeriod: {
            emissions: number;
            distance: number;
            efficiency: number;
        };
        industry: {
            avgEmissions: number;
            avgEfficiency: number;
            ranking: number; // posição no setor
        };
    };

    // Metas e objetivos
    targets: {
        emissionReduction: number; // % de redução planejada
        efficiencyImprovement: number; // % de melhoria planejada
        deadline: string;
        status: "on-track" | "at-risk" | "achieved";
    };

    // Iniciativas sustentáveis
    initiatives: Array<{
        name: string;
        description: string;
        impact: number; // kg CO2 economizados
        status: "planned" | "in-progress" | "completed";
        investment: number; // R$
    }>;

    // Certificações
    certifications: Array<{
        name: string;
        issuer: string;
        validUntil: string;
        status: "valid" | "expired" | "pending";
    }>;
}

export function generateMockData(
    period: string,
    reportType: string,
    companyId: string
): ReportData {
    const companies = {
        "transportadora-abc": {
            name: "Transportadora ABC Ltda",
            cnpj: "12.345.678/0001-90",
            address: "Av. Paulista, 1000 - São Paulo, SP",
            contact: "contato@transportadoraabc.com.br",
        },
        "logistica-xyz": {
            name: "Logística XYZ S.A.",
            cnpj: "98.765.432/0001-10",
            address: "Rua das Flores, 500 - Rio de Janeiro, RJ",
            contact: "admin@logisticaxyz.com.br",
        },
        "frota-verde": {
            name: "Frota Verde Transportes",
            cnpj: "11.222.333/0001-44",
            address: "Rod. Anhanguera, km 25 - Campinas, SP",
            contact: "sustentabilidade@frotaverde.com.br",
        },
    };

    const company = companies[companyId as keyof typeof companies];

    // Gerar dados baseados no período e tipo
    const isAnnual = reportType === "annual";
    const multiplier = isAnnual ? 12 : reportType === "quarterly" ? 3 : 1;

    return {
        company,
        period: {
            start: period === "2024" ? "2024-01-01" : "2024-10-01",
            end: period === "2024" ? "2024-12-31" : "2024-12-31",
            type: reportType,
        },
        reportType,
        generatedAt: new Date().toISOString(),

        summary: {
            totalEmissions: Math.round(
                45000 * multiplier + Math.random() * 5000
            ),
            totalDistance: Math.round(
                180000 * multiplier + Math.random() * 20000
            ),
            totalTrips: Math.round(850 * multiplier + Math.random() * 100),
            totalFuelConsumed: Math.round(
                18500 * multiplier + Math.random() * 2000
            ),
            averageEfficiency: Number((2.4 + Math.random() * 0.6).toFixed(1)),
            waterFootprint: Math.round(
                46250 * multiplier + Math.random() * 5000
            ),
            treesEquivalent: Math.round(
                2143 * multiplier + Math.random() * 200
            ),
        },

        vehicles: [
            {
                id: "v001",
                plate: "ABC-1234",
                model: "Volvo FH 540",
                year: 2020,
                type: "semi",
                fuelType: "diesel",
                emissions: 15420,
                distance: 65000,
                trips: 145,
                efficiency: 2.8,
                status: "active",
            },
            {
                id: "v002",
                plate: "XYZ-5678",
                model: "Scania R450",
                year: 2019,
                type: "semi",
                fuelType: "diesel-b12",
                emissions: 14230,
                distance: 58000,
                trips: 132,
                efficiency: 2.6,
                status: "active",
            },
            {
                id: "v003",
                plate: "DEF-9012",
                model: "Mercedes Actros",
                year: 2021,
                type: "heavy",
                fuelType: "diesel",
                emissions: 8950,
                distance: 42000,
                trips: 98,
                efficiency: 3.1,
                status: "maintenance",
            },
            {
                id: "v004",
                plate: "GHI-3456",
                model: "Iveco Stralis",
                year: 2018,
                type: "semi",
                fuelType: "biodiesel",
                emissions: 6400,
                distance: 35000,
                trips: 78,
                efficiency: 2.2,
                status: "active",
            },
        ],

        routes: [
            {
                id: "r001",
                name: "São Paulo - Rio de Janeiro",
                origin: "São Paulo, SP",
                destination: "Rio de Janeiro, RJ",
                distance: 430,
                frequency: 45,
                emissions: 8650,
                avgTime: 360,
            },
            {
                id: "r002",
                name: "São Paulo - Belo Horizonte",
                origin: "São Paulo, SP",
                destination: "Belo Horizonte, MG",
                distance: 586,
                frequency: 32,
                emissions: 7240,
                avgTime: 420,
            },
            {
                id: "r003",
                name: "Rio de Janeiro - Salvador",
                origin: "Rio de Janeiro, RJ",
                destination: "Salvador, BA",
                distance: 1165,
                frequency: 18,
                emissions: 12450,
                avgTime: 780,
            },
            {
                id: "r004",
                name: "São Paulo - Curitiba",
                origin: "São Paulo, SP",
                destination: "Curitiba, PR",
                distance: 408,
                frequency: 28,
                emissions: 5890,
                avgTime: 300,
            },
        ],

        timeline: Array.from({ length: 12 }, (_, i) => ({
            period: `2024-${String(i + 1).padStart(2, "0")}`,
            emissions: Math.round(
                3500 + Math.random() * 1000 + Math.sin(i / 2) * 500
            ),
            distance: Math.round(
                14000 + Math.random() * 2000 + Math.sin(i / 2) * 1000
            ),
            trips: Math.round(65 + Math.random() * 15 + Math.sin(i / 2) * 5),
            efficiency: Number(
                (2.3 + Math.random() * 0.4 + Math.sin(i / 3) * 0.1).toFixed(1)
            ),
        })),

        comparison: {
            previousPeriod: {
                emissions: 47800,
                distance: 185000,
                efficiency: 2.2,
            },
            industry: {
                avgEmissions: 52000,
                avgEfficiency: 2.1,
                ranking: 3, // 3º lugar no setor
            },
        },

        targets: {
            emissionReduction: 15, // 15% de redução
            efficiencyImprovement: 10, // 10% de melhoria
            deadline: "2025-12-31",
            status: "on-track",
        },

        initiatives: [
            {
                name: "Treinamento de Condução Econômica",
                description:
                    "Programa de capacitação para motoristas focado em técnicas de direção eficiente",
                impact: 2400,
                status: "completed",
                investment: 15000,
            },
            {
                name: "Renovação da Frota",
                description:
                    "Substituição de veículos antigos por modelos mais eficientes",
                impact: 8500,
                status: "in-progress",
                investment: 850000,
            },
            {
                name: "Sistema de Telemetria",
                description:
                    "Implementação de monitoramento em tempo real do consumo de combustível",
                impact: 3200,
                status: "planned",
                investment: 45000,
            },
            {
                name: "Uso de Biodiesel B20",
                description:
                    "Transição para combustível com maior percentual de biodiesel",
                impact: 5600,
                status: "in-progress",
                investment: 25000,
            },
        ],

        certifications: [
            {
                name: "ISO 14001 - Gestão Ambiental",
                issuer: "Bureau Veritas",
                validUntil: "2025-06-30",
                status: "valid",
            },
            {
                name: "Programa Despoluir CNT",
                issuer: "Confederação Nacional do Transporte",
                validUntil: "2024-12-31",
                status: "valid",
            },
            {
                name: "Selo Verde ANTT",
                issuer: "Agência Nacional de Transportes Terrestres",
                validUntil: "2024-08-15",
                status: "expired",
            },
        ],
    };
}
