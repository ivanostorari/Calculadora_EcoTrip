import type { ReportData } from "./report-data";

// PDF generation utility using only jsPDF (without autotable)
export class PDFReportGenerator {
    private doc: any;
    private pageWidth: number;
    private pageHeight: number;
    private margin: number;
    private currentY: number;

    constructor() {
        this.pageWidth = 210; // A4 width in mm
        this.pageHeight = 297; // A4 height in mm
        this.margin = 20;
        this.currentY = this.margin;
    }

    // Helper function to format dates in Brazil timezone
    private formatDateBR(date: string | Date): string {
        const dateObj = typeof date === "string" ? new Date(date) : date;
        return dateObj.toLocaleDateString("pt-BR", {
            timeZone: "America/Sao_Paulo",
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    }

    private formatDateTimeBR(date: string | Date): string {
        const dateObj = typeof date === "string" ? new Date(date) : date;
        return dateObj.toLocaleString("pt-BR", {
            timeZone: "America/Sao_Paulo",
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    }

    async generateReport(data: ReportData): Promise<Blob> {
        try {
            // Dynamic import of jsPDF to avoid SSR issues
            const { jsPDF } = await import("jspdf");

            this.doc = new jsPDF();
            this.currentY = this.margin;

            // Generate PDF content
            this.addHeader(data);
            this.addExecutiveSummary(data);
            this.addEmissionsChart(data);
            this.addFleetAnalysis(data);
            this.addRoutesAnalysis(data);
            this.addTimelineAnalysis(data);
            this.addInitiatives(data);
            this.addCompliance(data);
            this.addFooter(data);

            // Return PDF as blob
            return this.doc.output("blob");
        } catch (error) {
            console.error("Erro detalhado na geração do PDF:", error);
            throw error;
        }
    }

    private addHeader(data: ReportData) {
        const doc = this.doc;

        // Company logo area (placeholder)
        doc.setFillColor(34, 197, 94); // Green color
        doc.rect(this.margin, this.currentY, 30, 15, "F");
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text("LogiCO₂", this.margin + 15, this.currentY + 9, {
            align: "center",
        });

        // Report title - moved down to avoid overlap
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(20);
        doc.setFont("helvetica", "bold");
        doc.text(
            "RELATÓRIO DE SUSTENTABILIDADE",
            this.pageWidth / 2,
            this.currentY + 25,
            { align: "center" }
        );

        this.currentY += 35; // Increased spacing

        // Company information
        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");
        doc.text(`Empresa: ${data.company.name}`, this.margin, this.currentY);
        this.currentY += 6;
        doc.text(`CNPJ: ${data.company.cnpj}`, this.margin, this.currentY);
        this.currentY += 6;
        doc.text(
            `Endereço: ${data.company.address}`,
            this.margin,
            this.currentY
        );
        this.currentY += 6;

        // Report period and type - using Brazil timezone
        doc.setFont("helvetica", "bold");
        doc.text(
            `Período: ${this.formatDateBR(
                data.period.start
            )} a ${this.formatDateBR(data.period.end)}`,
            this.margin,
            this.currentY
        );
        this.currentY += 6;
        doc.text(
            `Tipo: ${this.getReportTypeName(data.reportType)}`,
            this.margin,
            this.currentY
        );
        this.currentY += 6;
        doc.text(
            `Gerado em: ${this.formatDateTimeBR(data.generatedAt)}`,
            this.margin,
            this.currentY
        );

        this.currentY += 15;

        // Add separator line
        doc.setDrawColor(34, 197, 94);
        doc.setLineWidth(0.5);
        doc.line(
            this.margin,
            this.currentY,
            this.pageWidth - this.margin,
            this.currentY
        );
        this.currentY += 10;
    }

    private addExecutiveSummary(data: ReportData) {
        this.addSectionTitle("RESUMO EXECUTIVO");

        const summaryItems = [
            {
                label: "Emissões Totais de CO₂",
                value: `${this.formatNumber(data.summary.totalEmissions)} kg`,
                comparison: this.getEmissionComparison(data),
            },
            {
                label: "Distância Total Percorrida",
                value: `${this.formatNumber(data.summary.totalDistance)} km`,
                comparison: "",
            },
            {
                label: "Total de Viagens",
                value: `${data.summary.totalTrips}`,
                comparison: "",
            },
            {
                label: "Combustível Consumido",
                value: `${this.formatNumber(data.summary.totalFuelConsumed)} L`,
                comparison: "",
            },
            {
                label: "Eficiência Média",
                value: `${data.summary.averageEfficiency} km/L`,
                comparison: this.getEfficiencyComparison(data),
            },
            {
                label: "Pegada Hídrica",
                value: `${this.formatNumber(data.summary.waterFootprint)} L`,
                comparison: "",
            },
            {
                label: "Equivalente em Árvores",
                value: `${this.formatNumber(data.summary.treesEquivalent)}`,
                comparison: "Absorver CO₂",
            },
        ];

        // Further adjusted column widths to give more space to comparison column
        this.addManualTable(
            ["Métrica", "Valor", "Comparação"],
            summaryItems.map((item) => [
                item.label,
                item.value,
                item.comparison,
            ]),
            [55, 35, 80] // More space for comparison column
        );
        this.currentY += 10;
    }

    private addEmissionsChart(data: ReportData) {
        this.addSectionTitle("EVOLUÇÃO DAS EMISSÕES");

        // Create a simple bar chart using rectangles
        const chartHeight = 60;
        const chartWidth = this.pageWidth - 2 * this.margin;
        const barWidth = chartWidth / Math.max(data.timeline.length, 1);
        const maxEmissions = Math.max(
            ...data.timeline.map((t) => t.emissions),
            1
        );

        // Chart background
        this.doc.setFillColor(248, 250, 252);
        this.doc.rect(this.margin, this.currentY, chartWidth, chartHeight, "F");

        // Draw bars
        data.timeline.forEach((period, index) => {
            const barHeight =
                (period.emissions / maxEmissions) * (chartHeight - 10);
            const x = this.margin + index * barWidth + barWidth * 0.1;
            const y = this.currentY + chartHeight - barHeight - 5;

            this.doc.setFillColor(34, 197, 94);
            this.doc.rect(x, y, barWidth * 0.8, barHeight, "F");

            // Add month label
            this.doc.setFontSize(8);
            this.doc.setTextColor(0, 0, 0);
            const monthName = new Date(period.period).toLocaleDateString(
                "pt-BR",
                {
                    month: "short",
                    timeZone: "America/Sao_Paulo",
                }
            );
            this.doc.text(
                monthName,
                x + barWidth * 0.4,
                this.currentY + chartHeight + 5,
                { align: "center" }
            );
        });

        // Chart title
        this.doc.setFontSize(10);
        this.doc.setFont("helvetica", "bold");
        this.doc.text(
            "Emissões Mensais (kg CO₂)",
            this.margin,
            this.currentY - 5
        );

        this.currentY += chartHeight + 15;
    }

    private addFleetAnalysis(data: ReportData) {
        this.checkPageBreak(80);
        this.addSectionTitle("ANÁLISE DA FROTA");

        const headers = [
            "Veículo",
            "Modelo",
            "Ano",
            "Emissões",
            "Distância",
            "Eficiência",
        ];
        const rows = data.vehicles.map((vehicle) => [
            vehicle.plate,
            vehicle.model,
            vehicle.year.toString(),
            `${this.formatNumber(vehicle.emissions)} kg`,
            `${this.formatNumber(vehicle.distance)} km`,
            `${vehicle.efficiency} km/L`,
        ]);

        this.addManualTable(headers, rows, [25, 35, 15, 25, 25, 25]);

        // Fleet summary
        this.currentY += 10;
        this.doc.setFontSize(10);
        this.doc.setFont("helvetica", "normal");
        this.doc.text(
            `Total de veículos: ${data.vehicles.length}`,
            this.margin,
            this.currentY
        );
        this.currentY += 5;
        this.doc.text(
            `Veículos ativos: ${
                data.vehicles.filter((v) => v.status === "active").length
            }`,
            this.margin,
            this.currentY
        );
        this.currentY += 5;
        this.doc.text(
            `Em manutenção: ${
                data.vehicles.filter((v) => v.status === "maintenance").length
            }`,
            this.margin,
            this.currentY
        );
        this.currentY += 15;
    }

    private addRoutesAnalysis(data: ReportData) {
        this.checkPageBreak(60);
        this.addSectionTitle("PRINCIPAIS ROTAS");

        const headers = [
            "Rota",
            "Distância",
            "Frequência",
            "Emissões",
            "Tempo",
        ];
        const rows = data.routes.map((route) => [
            route.name,
            `${route.distance} km`,
            `${route.frequency} viagens`,
            `${this.formatNumber(route.emissions)} kg`,
            `${Math.floor(route.avgTime / 60)}h ${route.avgTime % 60}min`,
        ]);

        this.addManualTable(headers, rows, [40, 25, 25, 25, 25]);
        this.currentY += 15;
    }

    private addTimelineAnalysis(data: ReportData) {
        this.checkPageBreak(80);
        this.addSectionTitle("EVOLUÇÃO TEMPORAL (ÚLTIMOS 6 MESES)");

        const headers = [
            "Mês",
            "Emissões",
            "Distância",
            "Viagens",
            "Eficiência",
        ];
        const rows = data.timeline.slice(-6).map((period) => {
            const monthName = new Date(period.period).toLocaleDateString(
                "pt-BR",
                {
                    month: "short",
                    year: "2-digit",
                    timeZone: "America/Sao_Paulo",
                }
            );
            return [
                monthName,
                `${this.formatNumber(period.emissions)} kg`,
                `${this.formatNumber(period.distance)} km`,
                period.trips.toString(),
                `${period.efficiency} km/L`,
            ];
        });

        this.addManualTable(headers, rows, [30, 35, 35, 20, 30]);
        this.currentY += 15;
    }

    private addInitiatives(data: ReportData) {
        this.checkPageBreak(100);
        this.addSectionTitle("INICIATIVAS DE SUSTENTABILIDADE");

        data.initiatives.forEach((initiative) => {
            this.checkPageBreak(40);

            this.doc.setFont("helvetica", "bold");
            this.doc.setFontSize(11);
            this.doc.text(initiative.name, this.margin, this.currentY);
            this.currentY += 8;

            this.doc.setFont("helvetica", "normal");
            this.doc.setFontSize(10);

            // Split long descriptions into multiple lines
            const maxWidth = this.pageWidth - 2 * this.margin;
            const descriptionLines = this.doc.splitTextToSize(
                initiative.description,
                maxWidth
            );
            this.doc.text(descriptionLines, this.margin, this.currentY);
            this.currentY += descriptionLines.length * 5 + 5;

            this.doc.text(
                `Impacto: -${this.formatNumber(initiative.impact)} kg CO₂`,
                this.margin,
                this.currentY
            );
            this.currentY += 5;
            this.doc.text(
                `Investimento: ${this.formatCurrency(initiative.investment)}`,
                this.margin,
                this.currentY
            );
            this.currentY += 5;
            this.doc.text(
                `Status: ${this.getStatusText(initiative.status)}`,
                this.margin,
                this.currentY
            );
            this.currentY += 15;
        });
    }

    private addCompliance(data: ReportData) {
        this.checkPageBreak(60);
        this.addSectionTitle("CERTIFICAÇÕES E COMPLIANCE");

        const headers = ["Certificação", "Emissor", "Válido até", "Status"];
        const rows = data.certifications.map((cert) => [
            cert.name,
            cert.issuer,
            this.formatDateBR(cert.validUntil),
            this.getStatusText(cert.status),
        ]);

        // Better balanced column widths for compliance table
        this.addManualTable(headers, rows, [40, 60, 25, 25]);
        this.currentY += 15;
    }

    private addFooter(data: ReportData) {
        this.checkPageBreak(60);
        this.addSectionTitle("DECLARAÇÃO DE VERACIDADE");

        this.doc.setFont("helvetica", "normal");
        this.doc.setFontSize(10);
        const declaration = `Declaro que as informações contidas neste relatório são verdadeiras e foram elaboradas com base em dados reais de operação da empresa ${
            data.company.name
        }, CNPJ ${
            data.company.cnpj
        }, referentes ao período de ${this.formatDateBR(
            data.period.start
        )} a ${this.formatDateBR(data.period.end)}.`;

        const maxWidth = this.pageWidth - 2 * this.margin;
        const declarationLines = this.doc.splitTextToSize(
            declaration,
            maxWidth
        );
        this.doc.text(declarationLines, this.margin, this.currentY);
        this.currentY += declarationLines.length * 5 + 15;

        // Use Brazil timezone for current date
        const currentDate = new Date().toLocaleDateString("pt-BR", {
            timeZone: "America/Sao_Paulo",
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
        this.doc.text(
            `Local e Data: São Paulo, ${currentDate}`,
            this.margin,
            this.currentY
        );
        this.currentY += 25;

        // Signature line
        this.doc.line(
            this.margin,
            this.currentY,
            this.margin + 60,
            this.currentY
        );
        this.currentY += 8;
        this.doc.text("Assinatura do Responsável", this.margin, this.currentY);

        // Add page numbers to all pages
        const pageCount = this.doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            this.doc.setPage(i);
            this.doc.setFontSize(8);
            this.doc.setTextColor(128, 128, 128);
            this.doc.text(
                `Página ${i} de ${pageCount}`,
                this.pageWidth - this.margin,
                this.pageHeight - 10,
                {
                    align: "right",
                }
            );
            this.doc.text(
                `LogiCO₂ - Relatório de Sustentabilidade`,
                this.margin,
                this.pageHeight - 10
            );
        }
    }

    private addSectionTitle(title: string) {
        this.checkPageBreak(20);
        this.doc.setFont("helvetica", "bold");
        this.doc.setFontSize(14);
        this.doc.setTextColor(34, 197, 94);
        this.doc.text(title, this.margin, this.currentY);
        this.currentY += 12;
        this.doc.setTextColor(0, 0, 0);
    }

    private addManualTable(
        headers: string[],
        rows: string[][],
        columnWidths: number[]
    ) {
        const baseRowHeight = 10; // Increased base row height
        const headerHeight = 12; // Increased header height

        this.checkPageBreak((rows.length + 2) * baseRowHeight + headerHeight);

        // Draw header background
        this.doc.setFillColor(34, 197, 94);
        this.doc.rect(
            this.margin,
            this.currentY,
            this.pageWidth - 2 * this.margin,
            headerHeight,
            "F"
        );

        // Draw header text
        this.doc.setTextColor(255, 255, 255);
        this.doc.setFont("helvetica", "bold");
        this.doc.setFontSize(10);

        let currentX = this.margin + 2;
        headers.forEach((header, index) => {
            this.doc.text(header, currentX, this.currentY + 8);
            currentX += columnWidths[index] || 30;
        });

        this.currentY += headerHeight;

        // Draw rows
        this.doc.setTextColor(0, 0, 0);
        this.doc.setFont("helvetica", "normal");
        this.doc.setFontSize(9);

        rows.forEach((row, rowIndex) => {
            // Calculate row height based on content with better spacing
            let maxLines = 1;
            row.forEach((cell, colIndex) => {
                const maxCellWidth = (columnWidths[colIndex] || 30) - 6; // More padding
                const cellLines = this.doc.splitTextToSize(cell, maxCellWidth);
                maxLines = Math.max(maxLines, cellLines.length);
            });

            const rowHeight = Math.max(baseRowHeight, maxLines * 5 + 4); // Better line spacing

            // Alternate row colors
            if (rowIndex % 2 === 0) {
                this.doc.setFillColor(248, 250, 252);
                this.doc.rect(
                    this.margin,
                    this.currentY,
                    this.pageWidth - 2 * this.margin,
                    rowHeight,
                    "F"
                );
            }

            currentX = this.margin + 3; // More left padding
            row.forEach((cell, colIndex) => {
                const maxCellWidth = (columnWidths[colIndex] || 30) - 6;
                const cellLines = this.doc.splitTextToSize(cell, maxCellWidth);

                // Draw each line of the cell with better vertical centering
                const startY =
                    this.currentY + (rowHeight - cellLines.length * 4) / 2 + 4;
                cellLines.forEach((line: string, lineIndex: number) => {
                    if (lineIndex < 4) {
                        // Allow up to 4 lines
                        this.doc.text(line, currentX, startY + lineIndex * 4);
                    }
                });

                currentX += columnWidths[colIndex] || 30;
            });

            this.currentY += rowHeight;
        });

        // Draw table border
        this.doc.setDrawColor(200, 200, 200);
        this.doc.setLineWidth(0.1);
        this.doc.rect(
            this.margin,
            this.currentY -
                (rows.reduce((acc, row) => {
                    let maxLines = 1;
                    row.forEach((cell, colIndex) => {
                        const maxCellWidth = (columnWidths[colIndex] || 30) - 6;
                        const cellLines = this.doc.splitTextToSize(
                            cell,
                            maxCellWidth
                        );
                        maxLines = Math.max(maxLines, cellLines.length);
                    });
                    return acc + Math.max(baseRowHeight, maxLines * 5 + 4);
                }, 0) +
                    headerHeight),
            this.pageWidth - 2 * this.margin,
            rows.reduce((acc, row) => {
                let maxLines = 1;
                row.forEach((cell, colIndex) => {
                    const maxCellWidth = (columnWidths[colIndex] || 30) - 6;
                    const cellLines = this.doc.splitTextToSize(
                        cell,
                        maxCellWidth
                    );
                    maxLines = Math.max(maxLines, cellLines.length);
                });
                return acc + Math.max(baseRowHeight, maxLines * 5 + 4);
            }, 0) + headerHeight
        );
    }

    private checkPageBreak(requiredSpace: number) {
        if (
            this.currentY + requiredSpace >
            this.pageHeight - this.margin - 20
        ) {
            this.doc.addPage();
            this.currentY = this.margin;
        }
    }

    private formatNumber(num: number): string {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + "M";
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + "K";
        } else {
            return num.toLocaleString("pt-BR");
        }
    }

    private formatCurrency(value: number): string {
        return new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
        }).format(value);
    }

    private getReportTypeName(type: string): string {
        const types: Record<string, string> = {
            annual: "Relatório Anual",
            quarterly: "Relatório Trimestral",
            monthly: "Relatório Mensal",
            sustainability: "Relatório de Sustentabilidade",
            compliance: "Relatório de Compliance",
        };
        return types[type] || type;
    }

    private getEmissionComparison(data: ReportData): string {
        const current = data.summary.totalEmissions;
        const previous = data.comparison.previousPeriod.emissions;
        const change = (((current - previous) / previous) * 100).toFixed(1);
        return change.startsWith("-") ? `${change}% ↓` : `+${change}% ↑`;
    }

    private getEfficiencyComparison(data: ReportData): string {
        const current = data.summary.averageEfficiency;
        const previous = data.comparison.previousPeriod.efficiency;
        const change = (((current - previous) / previous) * 100).toFixed(1);
        return change.startsWith("-") ? `${change}% ↓` : `+${change}% ↑`;
    }

    private getStatusText(status: string): string {
        const statusMap: Record<string, string> = {
            active: "Ativo",
            inactive: "Inativo",
            maintenance: "Manutenção",
            valid: "Válido",
            expired: "Expirado",
            pending: "Pendente",
            completed: "Concluído",
            "in-progress": "Em Andamento",
            planned: "Planejado",
            "on-track": "No Prazo",
            "at-risk": "Em Risco",
            achieved: "Alcançado",
        };
        return statusMap[status] || status;
    }
}

// Export function to generate and download PDF
export async function generateAndDownloadPDF(data: ReportData): Promise<void> {
    try {
        const generator = new PDFReportGenerator();
        const pdfBlob = await generator.generateReport(data);

        // Create download link
        const url = URL.createObjectURL(pdfBlob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `relatorio-sustentabilidade-${data.company.name
            .toLowerCase()
            .replace(/\s+/g, "-")}-${data.period.start}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    } catch (error) {
        console.error("Erro ao gerar PDF:", error);
        throw new Error(
            "Não foi possível gerar o relatório PDF. Tente novamente."
        );
    }
}
