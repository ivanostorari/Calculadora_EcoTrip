import Image from "next/image";

export function LogoHeader() {
  return (
    <div className="flex flex-col items-center justify-center py-6 bg-gradient-to-r from-green-50 via-green-100 to-green-50 border-b border-green-200">
      <div className="flex items-center gap-2 mb-2">
        <div className="relative">
          <div className="bg-white p-2 rounded-lg">
            <Image
              src="/logico2_logo.svg"
              alt="Logo da LogiCO2"
              width={60}
              height={60}
            />
          </div>
        </div>
        <h1 className="text-4xl font-bold tracking-tight">
          <span className="text-gray-800">Logi</span>
          <span className="text-green-600">CO</span>
          <span className="text-green-800 text-3xl align-text-bottom">2</span>
        </h1>
      </div>
      <p className="text-gray-600 text-lg px-8 text-center">Calculadora de Impacto Ambiental para Transporte Rodoviário no Brasil</p>
    </div>
  )
}
