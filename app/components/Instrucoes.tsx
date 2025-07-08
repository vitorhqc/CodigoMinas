import React from 'react';
import Image from 'next/image';

type InstrucoesModalProps = {
    isOpen: boolean;
    onConfirm: () => void;
  };

export default function ConfirmationModal ({isOpen, onConfirm}:InstrucoesModalProps){
  if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white flex flex-col rounded-lg items-center justify-center shadow-lg p-2 w-full h-1/2 max-w-md">
                <div className={`relative rounded-md w-full h-1/2 bg-white items-center justify-center text-justify`}>
                    <Image alt="ImagemSigla"
                        src={"https://firebasestorage.googleapis.com/v0/b/checklist-cbc61.appspot.com/o/ImagemCodigo.jpeg?alt=media&token=2ab512f5-a2e1-4ed6-8c3f-efbd9d19a11c"}
                        fill={true}
                        className="rounded-md">
                    </Image>
                </div>
                <div className='flex-col items-center justify-center w-full flex'>
                    <p className="w-full text-md text-black ">SIGLA: A sigla aparece na tela de login do sistema (Imagem acima).<br></br>
                        CPF: Em caso de PESSOA FÍSICA é o CPF do responsável.
                        CNPJ: Em caso de PESSOA JURÍDICA, CNPJ da empresa que faz uso do sistema Minas Software.<br></br>                        
                    </p>
                    <p className="w-full place-self-center justify-center text-lg text-black font-extrabold">
                        SIGLA E CPF/CNPJ SÃO OBRIGATÓRIOS!!
                        </p>
                </div>
                <div className="mt-6 flex place-self-center justify-center space-x-4">
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 self-end rounded bg-red-400 text-white hover:bg-red-500"
                    >
                        OK
                    </button>
                </div>
            </div>
        </div>
    );
};