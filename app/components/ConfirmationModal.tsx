import React from 'react';

type ConfirmationModalProps = {
    isOpen: boolean;
    message: string;
    onConfirm: () => void;
  };

export default function ConfirmationModal ({isOpen, message, onConfirm}:ConfirmationModalProps){
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <p className="text-lg text-gray-800">{message}</p>
        <div className="mt-6 flex justify-center space-x-4">
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded bg-red-400 text-white hover:bg-red-500"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};