'use client'
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import Spinner from "./components/spinner";
import ConfirmationModal from "./components/ConfirmationModal";
import Instrucoes from "./components/Instrucoes";

export default function Home() {

  const aRef = useRef<HTMLAnchorElement>(null);
  const [sigla, setSigla] = useState('');
  const [cpfcnpj, setCpfcnpj] = useState('');
  const [codigo, setCodigo] = useState('');
  const [codigook, setCodigook] = useState(false);
  const [showbubble, setShowbubble] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [isloading, setIsloading] = useState(false);
  const [isModalOpen,setIsModalOpen] = useState(false);
  const [instrucoesOpen, setInstrucoesopen] = useState(true);

  useEffect(() => {
    if (showbubble && aRef.current) {
      const rect = aRef.current.getBoundingClientRect();
      setPosition({
        top: Math.floor((rect.top + window.scrollY - 220)),
        left: window.innerWidth / 2 - 150,
      });
    }
  }, [showbubble]);

  function handleConfirm(){
    setIsModalOpen(false);
  }

  function handleInstrucoes(){
    setInstrucoesopen(false);
  }

  return (
    <div className="flex w-full max-w-full h-dvh max-h-screen bg-white flex-wrap justify-items-center items-center justify-center content-center ">
      <Instrucoes onConfirm={handleInstrucoes} isOpen={instrucoesOpen}></Instrucoes>
      <main className="flex flex-col h-full gap-[32px] bg-white row-start-2 justify-items-center items-center justify-center content-center">
        <Image alt="LogoMinas"
          src={"https://firebasestorage.googleapis.com/v0/b/checklist-cbc61.appspot.com/o/LOGO.bmp?alt=media&token=1550beb3-d8f7-4e53-827e-d9b096202e51"}
          width={500}
          height={300}>
        </Image>
        <div className="grid grid-cols-2 items-center bg-white gap-[32px]">
          <input placeholder="Digite a SIGLA" className="text-center rounded-md border-1 border-black" onChange={
            (e) => {
              e.currentTarget.value = e.currentTarget.value.toUpperCase();
              if (e.currentTarget.value.length > 3) {
                alert('Sigla tem somente 3 caracteres!')
                e.currentTarget.value = e.currentTarget.value.substring(0, 3);
              }
              setSigla(e.currentTarget.value);
            }}>
          </input>
          <input placeholder="Digite o CPF ou CNPJ" className="w-50 text-center rounded-md border-1 border-black"
            onChange={(e) => {
              if (!(/^[0-9]+$/.test(e.currentTarget.value)) && e.currentTarget.value.length > 0) {
                alert('CPF ou CNPJ somente números!');
                e.currentTarget.value = e.currentTarget.value.substring(0, e.currentTarget.value.length - 1);
              }
              setCpfcnpj(e.currentTarget.value);
            }}>
          </input>
        </div>
        <div className="flex flex-col cols-1 bg-white justify-items-center items-center justify-center content-center gap-2 mb-52">
          <button className={`w-40 text-center bg-stone-400 rounded-md text-white font-normal hover:font-bold `} onClick={!isloading ? () => buscarCliente(sigla, cpfcnpj) : () => {}}>Gerar código</button>
          {codigook && <input className={`w-50 text-center rounded-md border-1 border-black bg-red-200 $`} value={codigo} readOnly></input>}
          {!codigook && isloading && <div className="gap-4">
            <p className="text-bold">Buscando dados do cliente e gerando o código...</p>
            <Spinner></Spinner>
          </div>
          }
        </div>
        <a className="text-sm group underline text-blue-500" href="#" ref={aRef} onMouseEnter={() => setShowbubble(!showbubble)} onMouseLeave={() => setShowbubble(!showbubble)}>Onde consigo essas informaçoes?
          {showbubble && <div className={`rounded-md border-1 border-stone-500 bg-stone-300 text-justify`} style={{ top: `${position.top}px`, left: `${position.left}px`, position: 'absolute' }}>
            <Image alt="ImagemSigla"
              src={"https://firebasestorage.googleapis.com/v0/b/checklist-cbc61.appspot.com/o/ImagemCodigo.jpeg?alt=media&token=2ab512f5-a2e1-4ed6-8c3f-efbd9d19a11c"}
              width={300}
              height={150}
              className="rounded-md">
            </Image>
            <p className="w-75 text-xs text-black ">SIGLA: A sigla aparece na tela de login do sistema (Imagem acima).<br></br>
              CPF: Em caso de PESSOA FÍSICA é o CPF do responsável.
              CNPJ: Em caso de PESSOA JURÍDICA, CNPJ da empresa que faz uso do sistema Minas Software.
            </p>
          </div>}
        </a>
        <ConfirmationModal onConfirm={handleConfirm} isOpen={isModalOpen} message="Estes dados nao foram encontrados! Confira a sigla e o CPF/CNPJ!"></ConfirmationModal>
      </main>
    </div>
  );

  async function buscarCliente(sigla: string = '', CPFCNPJ: string = '') {
    try {
      setIsloading(true);
      const res = await fetch(`/api/codigo?sigla=${encodeURIComponent(sigla)}&cpfcnpj=${encodeURIComponent(CPFCNPJ)}`, {
        method: 'GET',
      });
      if (!res.ok) {
        setIsModalOpen(true);
        setCodigook(false);
        setIsloading(false);
        return;
      }
      setCodigook(true);
      setIsloading(false);
      const data = await res.json();
      console.log(data);
      setCodigo(data);
    }
    catch (err) {
      throw new Error(`Request failed: ${err instanceof Error ? err.message : String(err)}`);
    }
  }
}


