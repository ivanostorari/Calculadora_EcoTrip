import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: "LogiCO2 - O Futuro da Logística",
  description: "Diminuindo a emissão de CO2 no transporte rodoviário de cargas e custos para pequenas e médias empresas.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}
