"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Droplets, X } from "lucide-react"

export function WaterMethodologyDialog() {
  const [isOpen, setIsOpen] = useState(false)

  // Função para alternar o estado do modal
  const toggleModal = () => {
    setIsOpen(!isOpen)
  }

  // Efeito para travar o scroll da página quando o modal estiver aberto
  useEffect(() => {
    if (isOpen) {
      // Salvar a posição atual do scroll
      const scrollY = window.scrollY

      // Adicionar classes para travar o scroll e manter a posição visual
      document.body.style.position = "fixed"
      document.body.style.top = `-${scrollY}px`
      document.body.style.width = "100%"
      document.body.style.overflowY = "scroll" // Mantém a barra de rolagem visível para evitar saltos de layout
    } else {
      // Restaurar o scroll quando o modal for fechado
      const scrollY = document.body.style.top
      document.body.style.position = ""
      document.body.style.top = ""
      document.body.style.width = ""
      document.body.style.overflowY = ""

      // Restaurar a posição do scroll
      if (scrollY) {
        window.scrollTo(0, Number.parseInt(scrollY || "0", 10) * -1)
      }
    }

    // Limpar os estilos quando o componente for desmontado
    return () => {
      document.body.style.position = ""
      document.body.style.top = ""
      document.body.style.width = ""
      document.body.style.overflowY = ""
    }
  }, [isOpen])

  // Se o modal não estiver aberto, apenas renderize o botão
  if (!isOpen) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={toggleModal}
        className="text-green-700 border-green-200 hover:bg-green-50 font-medium shadow-sm"
      >
        <Droplets className="h-4 w-4 mr-2" />
        Metodologia de Cálculo da Água
      </Button>
    )
  }

  // Se o modal estiver aberto, renderize o modal e o botão
  return (
    <>
      {/* Overlay para o fundo escurecido */}
      <div className="fixed inset-0 bg-black/80 z-50" onClick={toggleModal} />

      {/* Modal */}
      <div className="fixed left-[50%] top-[50%] z-50 w-full max-w-md sm:max-w-lg md:max-w-2xl max-h-[90vh] translate-x-[-50%] translate-y-[-50%] bg-white rounded-lg shadow-lg flex flex-col overflow-hidden">
        {/* Cabeçalho */}
        <div className="sticky top-0 bg-white z-20 p-4 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Droplets className="h-5 w-5 text-green-700" />
              <h2 className="text-lg font-semibold">Metodologia de Cálculo da Pegada Hídrica</h2>
            </div>
            <button
              onClick={toggleModal}
              className="rounded-full bg-white p-1 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
              aria-label="Fechar modal"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Explicação detalhada sobre como calculamos o consumo de água associado à produção de diesel
          </p>
        </div>

        {/* Conteúdo com rolagem */}
        <div className="overflow-y-auto p-4 flex-grow">
          <div className="space-y-4 text-sm">
            <p>
              O cálculo da pegada hídrica na LogiCO2 é baseado em estudos científicos sobre o consumo de água na
              produção de diesel, considerando todo o ciclo de vida do combustível.
            </p>

            <h3 className="font-semibold text-green-800">Parâmetros Utilizados</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <span className="font-medium">Pegada hídrica total do diesel:</span> 2,5 litros de água por litro de
                diesel
              </li>
              <li>
                <span className="font-medium">Faixa de variação:</span> 2,0 a 4,0 litros de água por litro de diesel,
                dependendo da eficiência dos processos
              </li>
            </ul>

            <h3 className="font-semibold text-green-800">Componentes da Pegada Hídrica</h3>
            <p>O valor de 2,5 litros de água por litro de diesel inclui:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <span className="font-medium">Extração do petróleo bruto:</span> Aproximadamente 1,5 litros de água por
                litro de petróleo extraído
              </li>
              <li>
                <span className="font-medium">Refino do diesel:</span> Aproximadamente 1,0 litro de água por litro de
                diesel refinado
              </li>
            </ul>

            <h3 className="font-semibold text-green-800">Metodologia de Cálculo</h3>
            <ol className="list-decimal pl-5 space-y-1">
              <li>Calculamos o consumo de combustível com base na distância e eficiência do veículo</li>
              <li>
                Multiplicamos o volume de combustível consumido pelo fator de pegada hídrica (2,5 L de água/L de diesel)
              </li>
              <li>
                O resultado representa a quantidade de água utilizada para produzir o diesel consumido na operação
              </li>
            </ol>

            <h3 className="font-semibold text-green-800">Tipos de Água Considerados</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <span className="font-medium">Água verde:</span> Água da chuva utilizada na extração do petróleo bruto
              </li>
              <li>
                <span className="font-medium">Água azul:</span> Água superficial e subterrânea utilizada principalmente
                no refino
              </li>
              <li>
                <span className="font-medium">Água cinza:</span> Água necessária para diluir poluentes gerados nos
                processos de extração e refino
              </li>
            </ul>

            <h3 className="font-semibold text-green-800">Fontes e Referências</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                ResearchGate: "Water consumption unit contribution for diesel production" - Dados sobre consumo de água
                na extração (média de 1,5 L/L) e refino (média de 1,0 L/L)
              </li>
              <li>
                ScienceDirect: "Estimation of U.S. refinery water consumption" - Dados sobre consumo de água em
                refinarias (1,0-1,9 L/L)
              </li>
              <li>Iberdrola: "O que é a Pegada Hídrica e como calculá-la?" - Definição de pegada hídrica</li>
              <li>
                Estudos da Petrobras sobre eficiência hídrica em refinarias brasileiras - Aplicabilidade dos valores
                médios globais ao contexto brasileiro
              </li>
            </ul>

            <p className="text-xs text-gray-500 italic">
              Nota: Os valores apresentados são médias para o contexto brasileiro e podem variar conforme a região,
              método de produção e eficiência operacional de cada planta de extração e refino.
            </p>
          </div>
        </div>

        {/* Rodapé */}
        <div className="sticky bottom-0 bg-white p-4 border-t flex justify-end z-20">
          <Button type="button" variant="outline" className="px-6" onClick={toggleModal}>
            Fechar
          </Button>
        </div>
      </div>
    </>
  )
}
