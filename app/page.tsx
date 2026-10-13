
'use client';

import Image from 'next/image';
import { useState } from 'react';
import {
  Building2,
  UserRound,
  Search,
  CircleHelp,
} from 'lucide-react';

import Spinner from './components/spinner';
import ConfirmationModal from './components/ConfirmationModal';
import Instrucoes from './components/Instrucoes';

export default function Home() {
  const [sigla, setSigla] = useState('');
  const [cpfcnpj, setCpfcnpj] = useState('');
  const [codigo, setCodigo] = useState('');
  const [codigook, setCodigook] = useState(false);
  const [isloading, setIsloading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [instrucoesOpen, setInstrucoesopen] = useState(true);

  function handleConfirm() {
    setIsModalOpen(false);
  }

  function handleInstrucoes() {
    setInstrucoesopen(false);
  }

  async function buscarCliente(
    sigla: string = '',
    CPFCNPJ: string = '',
  ) {
    if (isloading) return;

    if (!sigla.trim() || !CPFCNPJ.trim()) {
      setIsModalOpen(true);
      return;
    }

    try {
      setIsloading(true);
      setCodigook(false);
      setCodigo('');

      const res = await fetch(
        `/api/codigo?sigla=${encodeURIComponent(sigla)}&cpfcnpj=${encodeURIComponent(CPFCNPJ)}`,
        { method: 'GET' },
      );

      if (!res.ok) {
        setIsModalOpen(true);
        return;
      }

      const data = await res.json();

      setCodigo(
        typeof data === 'string' ? data : String(data),
      );
      setCodigook(true);
    } catch (err) {
      console.error('Erro ao buscar código:', err);
      setIsModalOpen(true);
    } finally {
      setIsloading(false);
    }
  }

  return (
    <div className="relative isolate min-h-dvh w-full overflow-x-hidden bg-white text-gray-700">

      {/* Fundo decorativo */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-white"
      >
        <div className="absolute -bottom-36 -left-24 h-72 w-[120%] rotate-[-7deg] rounded-[50%] border-[34px] border-gray-100 sm:-bottom-44 sm:border-[48px]" />

        <div className="absolute -bottom-48 -left-20 h-72 w-[125%] rotate-[-5deg] rounded-[50%] border-[24px] border-red-100 sm:-bottom-56 sm:border-[34px]" />

        <div className="absolute -bottom-52 -left-20 h-64 w-[125%] rotate-[-4deg] rounded-[50%] border-[20px] border-red-500 sm:-bottom-60 sm:border-[28px]" />

        <div className="absolute -bottom-64 -left-20 h-64 w-[125%] rotate-[-2deg] rounded-[50%] border-[12px] border-red-300 sm:-bottom-72 sm:border-[18px]" />

        <div className="absolute inset-0 bg-gradient-to-br from-white via-transparent to-white/30" />
      </div>

      {/* Conteúdo principal */}
      <main className="mx-auto flex min-h-dvh w-full max-w-[1500px] flex-col items-center px-5 pb-28 pt-12 sm:px-10 sm:pb-36 sm:pt-16 lg:justify-center lg:pt-10">

        {/* Logo */}
        <div className="mb-14 flex w-full justify-center sm:mb-20 lg:mb-24">
          <Image
            alt="Minas Software - Tecnologia em Sistemas"
            src="https://res.cloudinary.com/dxmpiopqx/image/upload/v1777467440/LOGOMsColor_mpi686.png"
            width={700}
            height={300}
            priority
            className="h-auto w-[min(85%,650px)] object-contain"
          />
        </div>

        {/* Formulário */}
        <div className="w-full max-w-[1220px]">

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-8">

            {/* SIGLA */}
            <label className="flex h-[76px] min-w-0 items-center rounded-2xl border border-gray-300 bg-white/90 px-5 shadow-sm transition focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-100 sm:h-[96px] sm:px-8">
              <Building2
                size={42}
                strokeWidth={2.4}
                className="shrink-0 text-gray-500 sm:h-12 sm:w-12"
              />

              <span className="mx-4 h-10 w-px shrink-0 bg-gray-300 sm:mx-6 sm:h-12" />

              <input
                type="text"
                placeholder="Digite a SIGLA"
                aria-label="Digite a SIGLA"
                autoComplete="off"
                maxLength={3}
                value={sigla}
                onChange={(e) => {
                  setSigla(
                    e.target.value
                      .replace(/[^a-zA-Z]/g, '')
                      .toUpperCase()
                      .slice(0, 3),
                  );
                }}
                className="min-w-0 w-full bg-transparent text-base text-gray-700 outline-none placeholder:text-gray-500 sm:text-2xl"
              />
            </label>

            {/* CPF / CNPJ */}
            <label className="flex h-[76px] min-w-0 items-center rounded-2xl border border-gray-300 bg-white/90 px-5 shadow-sm transition focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-100 sm:h-[96px] sm:px-8">
              <UserRound
                size={42}
                strokeWidth={2.4}
                className="shrink-0 text-gray-500 sm:h-12 sm:w-12"
              />

              <span className="mx-4 h-10 w-px shrink-0 bg-gray-300 sm:mx-6 sm:h-12" />

              <input
                type="text"
                inputMode="numeric"
                placeholder="Digite o CPF ou CNPJ"
                aria-label="Digite o CPF ou CNPJ"
                autoComplete="off"
                maxLength={14}
                value={cpfcnpj}
                onChange={(e) => {
                  setCpfcnpj(
                    e.target.value.replace(/\D/g, '').slice(0, 14),
                  );
                }}
                className="min-w-0 w-full bg-transparent text-base text-gray-700 outline-none placeholder:text-gray-500 sm:text-2xl"
              />
            </label>

          </div>

          {/* Botão Gerar código */}
          <div className="mt-9 flex flex-col items-center sm:mt-14">

            <button
              type="button"
              disabled={isloading}
              onClick={() => buscarCliente(sigla, cpfcnpj)}
              className="flex min-h-[78px] w-full max-w-[520px] items-center justify-center gap-4 rounded-2xl bg-gradient-to-r from-red-600 to-red-700 px-6 py-4 text-xl font-bold text-white shadow-lg shadow-red-200/60 transition hover:from-red-700 hover:to-red-800 hover:shadow-xl active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70 sm:min-h-[104px] sm:gap-6 sm:text-3xl"
            >
              {isloading ? (
                <>
                  <Spinner />
                  <span className="text-lg sm:text-2xl">
                    Gerando código...
                  </span>
                </>
              ) : (
                <>
                  <Search
                    size={42}
                    strokeWidth={2.8}
                    className="shrink-0 sm:h-12 sm:w-12"
                  />

                  <span className="h-10 w-px bg-white/60 sm:h-12" />

                  <span>Gerar código</span>
                </>
              )}
            </button>

            {/* Código retornado pela API */}
            {codigook && (
              <div className="mt-7 w-full max-w-[520px] rounded-2xl border border-green-200 bg-white/95 p-5 shadow-md">
                <p className="mb-3 text-center text-sm font-semibold text-gray-600 sm:text-base">
                  Código de atualização
                </p>

                <div className="flex gap-3">
                  <input
                    aria-label="Código de atualização gerado"
                    value={codigo}
                    readOnly
                    className="min-w-0 flex-1 rounded-xl border border-gray-300 bg-gray-50 px-3 py-3 text-center text-lg font-bold text-gray-800 outline-none sm:text-2xl"
                    onFocus={(e) => e.currentTarget.select()}
                  />

                  <button
                    type="button"
                    onClick={() => {
                      void navigator.clipboard.writeText(codigo);
                    }}
                    className="rounded-xl bg-gray-800 px-4 py-3 font-semibold text-white transition hover:bg-gray-700"
                  >
                    Copiar
                  </button>
                </div>
              </div>
            )}

            {/* Link de instruções */}
            <button
              type="button"
              onClick={() => setInstrucoesopen(true)}
              className="mt-7 inline-flex items-center gap-2 text-sm text-gray-500 underline decoration-gray-300 underline-offset-4 transition hover:text-red-600 sm:text-base"
            >
              <CircleHelp size={18} />
              Onde consigo essas informações?
            </button>

          </div>
        </div>
      </main>

      {/* Modais */}
      {instrucoesOpen && (
        <Instrucoes
          onConfirm={handleInstrucoes}
          isOpen={true}
        />
      )}

      <ConfirmationModal
        onConfirm={handleConfirm}
        isOpen={isModalOpen}
        message="Estes dados não foram encontrados! Confira a sigla e o CPF/CNPJ!"
      />

    </div>
  );
}
