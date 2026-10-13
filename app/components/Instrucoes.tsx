
'use client';

import Image from 'next/image';
import { X, UserRound, Building2, AlertCircle } from 'lucide-react';

interface InstrucoesProps {
    onConfirm: () => void;
    isOpen: boolean;
}

export default function Instrucoes({
    onConfirm,
    isOpen,
}: InstrucoesProps) {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-black/50 p-1 sm:p-3"
        >
            <div className="flex h-full max-h-full w-full max-w-[1160px] flex-col overflow-hidden rounded-xl bg-white shadow-2xl sm:rounded-2xl">

                {/* Cabeçalho */}
                <header className="flex shrink-0 items-center justify-between gap-2 bg-gradient-to-r from-[#153653] to-[#245184] px-3 py-[1.2vh] text-white sm:px-7">
                    <h1 className="text-[clamp(14px,2.3vh,34px)] font-bold leading-tight">
                        Código Minas - Atualização
                    </h1>

                    <button
                        type="button"
                        aria-label="Fechar instruções"
                        onPointerUp={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onConfirm();
                        }}
                        className="relative z-[60] flex min-h-10 min-w-10 shrink-0 items-center justify-center rounded-full bg-white/10 text-white active:bg-red-500"
                    >
                        <X className="h-6 w-6 sm:h-8 sm:w-8" />
                    </button>
                </header>

                {/* Conteúdo: sem rolagem */}
                <div className="flex min-h-0 flex-1 flex-col gap-[1.1vh] overflow-hidden p-[1.2vh] sm:gap-[1.5vh] sm:p-[2vh]">

                    {/* Imagem de exemplo */}
                    <div className="relative min-h-0 flex-[2] basis-0 overflow-hidden rounded-lg bg-blue-100">
                        <Image
                            src="https://res.cloudinary.com/dxmpiopqx/image/upload/v1762973601/u2uok3ojzxra3scjf39d.jpg"
                            alt="Exemplo da tela de login do sistema Minas Software"
                            fill
                            sizes="(max-width: 768px) 100vw, 1100px"
                            className="object-contain sm:object-cover"
                        />
                    </div>

                    {/* SIGLA */}
                    <div className="flex min-h-0 flex-[0.9] basis-0 items-center gap-3 overflow-hidden rounded-xl bg-[#eaf3ff] px-3 py-1 sm:gap-6 sm:px-7">
                        <div className="flex aspect-square h-[65%] max-h-16 shrink-0 items-center justify-center rounded-lg bg-blue-700 text-[clamp(20px,4vh,48px)] font-bold text-white sm:max-h-24">
                            A
                        </div>

                        <div className="min-w-0">
                            <h2 className="text-[clamp(15px,2.5vh,34px)] font-extrabold leading-tight text-blue-800">
                                SIGLA
                            </h2>
                            <p className="text-[clamp(10px,1.8vh,22px)] leading-tight text-gray-800">
                                A sigla aparece na tela de login do sistema (imagem acima é só um exemplo. Cada cliente tem sigla diferente.).
                            </p>
                        </div>
                    </div>

                    {/* CPF */}
                    <div className="flex min-h-0 flex-[0.8] basis-0 items-center gap-3 overflow-hidden rounded-xl bg-[#edf5ed] px-3 py-1 sm:gap-6 sm:px-7">
                        <div className="flex aspect-square h-[65%] max-h-16 shrink-0 items-center justify-center rounded-lg bg-green-600 text-white sm:max-h-24">
                            <UserRound className="h-[65%] w-[65%]" />
                        </div>

                        <div className="min-w-0">
                            <h2 className="text-[clamp(15px,2.5vh,34px)] font-extrabold leading-tight text-green-800">
                                CPF
                            </h2>
                            <p className="text-[clamp(10px,1.8vh,22px)] leading-tight text-gray-800">
                                Em caso de PESSOA FÍSICA, é o CPF do responsável.
                            </p>
                        </div>
                    </div>

                    {/* CNPJ */}
                    <div className="flex min-h-0 flex-[0.95] basis-0 items-center gap-3 overflow-hidden rounded-xl bg-[#fff3df] px-3 py-1 sm:gap-6 sm:px-7">
                        <div className="flex aspect-square h-[65%] max-h-16 shrink-0 items-center justify-center rounded-lg bg-amber-500 text-white sm:max-h-24">
                            <Building2 className="h-[65%] w-[65%]" />
                        </div>

                        <div className="min-w-0">
                            <h2 className="text-[clamp(15px,2.5vh,34px)] font-extrabold leading-tight text-amber-600">
                                CNPJ
                            </h2>
                            <p className="text-[clamp(10px,1.8vh,22px)] leading-tight text-gray-800">
                                Em caso de PESSOA JURÍDICA, é o CNPJ da empresa que faz uso do sistema Minas Software.
                            </p>
                        </div>
                    </div>

                    {/* Aviso obrigatório */}
                    <div className="flex min-h-0 flex-[0.55] basis-0 shrink-0 items-center justify-center gap-2 overflow-hidden rounded-xl bg-[#fdebed] px-2">
                        <AlertCircle className="h-[4vh] w-[4vh] max-h-12 max-w-12 shrink-0 text-red-600" />

                        <p className="text-center text-[clamp(10px,2.1vh,28px)] font-extrabold leading-tight text-red-700">
                            SIGLA E CPF/CNPJ SÃO OBRIGATÓRIOS!!
                        </p>
                    </div>

                    {/* Botão OK */}
                    <div className="flex shrink-0 justify-center">
                        <button
                            type="button"
                            onClick={() => {
                                onConfirm();
                            }}
                            className="relative z-[10000] rounded-xl bg-red-600 px-8 py-3 text-xl font-bold text-white"
                        >
                            OK
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}
