import { Calculator } from "@/components/calculator";
import { LogoHeader } from "@/components/logo-header";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CalculatorPage() {
    return (
        <main className="min-h-screen bg-white">
            <LogoHeader />
            <div className="container mx-auto py-4 px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="mb-6">
                        <Link href="/">
                            <Button variant="outline" className="mb-4">
                                ← Voltar para Funcionalidades
                            </Button>
                        </Link>
                    </div>
                    <Calculator />
                    <div className="mt-12 bg-green-50 p-6 rounded-lg">
                        <h2 className="text-xl font-semibold text-green-800 mb-4">
                            Sobre Esta Calculadora
                        </h2>
                        <p className="mb-3">
                            Esta calculadora utiliza padrões e metodologias
                            reconhecidos internacionalmente para avaliação de
                            pegada de carbono, adaptados ao contexto brasileiro
                            de transporte rodoviário, incluindo fatores do
                            Programa Brasileiro GHG Protocol e diretrizes do
                            Ministério do Meio Ambiente.
                        </p>
                        <p className="mb-3">
                            Os cálculos de equivalência são baseados nos
                            seguintes fatores de conversão:
                        </p>
                        <ul className="list-disc pl-5 space-y-2 mb-3">
                            <li>
                                Uma árvore madura absorve aproximadamente 21 kg
                                de CO2 por ano
                            </li>
                            <li>
                                A queima de 1 litro de diesel produz
                                aproximadamente 2,68 kg de CO2
                            </li>
                            <li>
                                A produção de 1 litro de diesel consome
                                aproximadamente 2,5 litros de água (considerando
                                extração do petróleo e refino)
                            </li>
                        </ul>
                        <p>
                            Estes cálculos são estimativas e podem variar com
                            base em condições específicas e fatores regionais do
                            Brasil. Os fatores de emissão para caminhões são
                            baseados em dados da ANTT (Agência Nacional de
                            Transportes Terrestres) e do IBAMA (Instituto
                            Brasileiro do Meio Ambiente e dos Recursos Naturais
                            Renováveis).
                        </p>
                    </div>
                    <footer className="mt-8 text-center text-sm text-gray-500 pb-8">
                        <p>
                            © 2025 LogiCO
                            <span className="text-xs align-text-top">2</span> -
                            Todos os direitos reservados
                        </p>
                    </footer>
                </div>
            </div>
        </main>
    );
}
