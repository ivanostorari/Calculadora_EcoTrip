"use client";

import type React from "react";

import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { searchAddresses } from "@/lib/openroute-service";
import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface AddressAutocompleteProps {
    id: string;
    value: string;
    onChange: (value: string) => void;
    onSelect: (value: string) => void;
    placeholder?: string;
    className?: string;
}

export function AddressAutocomplete({
    id,
    value,
    onChange,
    onSelect,
    placeholder = "Digite um endereço",
    className,
}: AddressAutocompleteProps) {
    const [open, setOpen] = useState(false);
    const [inputValue, setInputValue] = useState(value);
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

    // Sincronizar o valor do input com o valor externo
    useEffect(() => {
        setInputValue(value);
    }, [value]);

    // Buscar sugestões quando o usuário digitar
    useEffect(() => {
        // Limpar o timer anterior
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }

        // Não buscar se o input estiver vazio ou for muito curto
        if (!inputValue || inputValue.length < 3) {
            setSuggestions([]);
            return;
        }

        // Configurar um novo timer para debounce
        debounceTimerRef.current = setTimeout(async () => {
            setLoading(true);
            try {
                const results = await searchAddresses(inputValue);
                setSuggestions(results);
            } catch (error) {
                console.error("Erro ao buscar endereços:", error);
                setSuggestions([]);
            } finally {
                setLoading(false);
            }
        }, 500); // 500ms de debounce

        // Limpar o timer quando o componente for desmontado
        return () => {
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
        };
    }, [inputValue]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setInputValue(newValue);
        onChange(newValue);
    };

    const handleSelectAddress = (address: string) => {
        setInputValue(address);
        onChange(address);
        onSelect(address);
        setOpen(false);
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <div className="relative w-full">
                    <Input
                        id={id}
                        value={inputValue}
                        onChange={handleInputChange}
                        placeholder={placeholder}
                        className={cn("w-full", className)}
                        onClick={() => inputValue.length >= 3 && setOpen(true)}
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        {loading ? (
                            <Loader2 className="h-4 w-4 text-gray-400 animate-spin" />
                        ) : (
                            <ChevronsUpDown className="h-4 w-4 text-gray-400" />
                        )}
                    </div>
                </div>
            </PopoverTrigger>
            <PopoverContent className="p-0 w-full" align="start">
                <Command>
                    <CommandInput
                        placeholder="Buscar endereço..."
                        value={inputValue}
                        onValueChange={(value:any) => {
                            setInputValue(value);
                            onChange(value);
                        }}
                    />
                    <CommandList>
                        <CommandEmpty>
                            {loading
                                ? "Buscando endereços..."
                                : "Nenhum endereço encontrado."}
                        </CommandEmpty>
                        <CommandGroup>
                            {suggestions.map((address, index) => (
                                <CommandItem
                                    key={index}
                                    value={address}
                                    onSelect={() =>
                                        handleSelectAddress(address)
                                    }
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            address === value
                                                ? "opacity-100"
                                                : "opacity-0"
                                        )}
                                    />
                                    <span className="text-sm truncate">
                                        {address}
                                    </span>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
