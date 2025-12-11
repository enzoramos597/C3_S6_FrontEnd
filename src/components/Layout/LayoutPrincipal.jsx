import React from "react";
import HeaderPrincipal from "../PagesPrincipal/HeaderPrincipal";
import FooterPrincipal from "../PagesPrincipal/FooterPrincipal";
import { Outlet } from "react-router-dom";


const LayoutPrincipal = () => {
  return (
    <>
      <HeaderPrincipal />
      {/* 🔥 Solo el contenido dinámico va aquí */}
      <main className=" px-4 bg-black/60">
        <Outlet />
      </main>
      <FooterPrincipal />
    </>
  );
};

export default LayoutPrincipal;

