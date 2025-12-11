import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const CuentaDeshabilitada = () => {
  const [detalle, setDetalle] = useState("");

  const enviarCorreo = () => {
    if (!detalle.trim()) {
      toast.error("Por favor ingrese un detalle del problema.");
      return;
    }

    const email = "enzo.j.ramos@gmail.com";
    const subject = encodeURIComponent("Solicitud de habilitación de cuenta");
    const body = encodeURIComponent(
      `Hola Enzo, tengo un inconveniente con mi cuenta:\n\n${detalle}`
    );

    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
    toast.success("Abriendo cliente de correo…");
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh] w-full p-4">
      <div className="bg-neutral-900 text-white p-8 rounded-lg w-full max-w-lg relative">

        <Link
          to="/"
          className="absolute top-3 right-3 text-gray-400 hover:text-red-700 text-2xl"
        >
          &times;
        </Link>

        <h2 className="text-3xl font-bold mb-4 text-center">
          Cuenta Deshabilitada
        </h2>

        <p className="text-gray-300 mb-4 text-center">
          Tu cuenta está actualmente deshabilitada por falta de pago u otro inconveniente.
        </p>

        <p className="text-gray-400 mb-6 text-center">
          Por favor completa el siguiente formulario para contactar al administrador.
        </p>

        <textarea
          value={detalle}
          onChange={(e) => setDetalle(e.target.value)}
          placeholder="Describe tu problema..."
          className="w-full p-3 rounded bg-neutral-800 text-white h-32 border border-neutral-700"
        />

        <button
          onClick={enviarCorreo}
          className="mt-4 w-full bg-red-600 hover:bg-red-700 p-3 rounded-lg font-semibold"
        >
          Enviar correo a soporte
        </button>
      </div>
    </div>
  );
};

export default CuentaDeshabilitada;
