import { ReportsGenerator } from "@/components/reports-generator";
import { LogoHeader } from "@/components/logo-header";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ReportsPage() {
    return (
        <main className="min-h-screen bg-white">
            <LogoHeader />
            <div className="container mx-auto py-4 px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="mb-6">
                        <Link href="/">
                            <Button variant="outline" className="mb-4">
                                ← Voltar para Funcionalidades
                            </Button>
                        </Link>
                    </div>
                    <ReportsGenerator />
                </div>
            </div>
        </main>
    );
}
