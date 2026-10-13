
"use client";

import { useEffect, useState } from "react";

export default function Diagnostico() {
  const [executando, setExecutando] = useState(false);

  useEffect(() => {
    setExecutando(true);
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 999999,
        padding: 10,
        background: executando ? "green" : "red",
        color: "white",
        fontSize: 14,
      }}
    >
      JavaScript: {executando ? "EXECUTANDO" : "AGUARDANDO"}
    </div>
  );
}
