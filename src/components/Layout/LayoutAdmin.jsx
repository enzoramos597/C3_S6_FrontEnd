// LayoutAdmin.jsx
import { useState } from "react";
import HeaderAdmin from "../PagesAdmin/HeaderAdmin";
import FooterAdmin from "../PagesAdmin/FooterAdmin";
import { Outlet } from "react-router-dom";
import FavoritosModalAdmin from "../PagesAdmin/FavoritosModalAdmin"; // default export

const LayoutAdmin = () => {
  const [openFavModal, setOpenFavModal] = useState(false);

  return (
    <div className="w-full min-h-screen flex flex-col bg-black/60">
      {/* HEADER FULL WIDTH */}
      {/* 🛑 CORRECCIÓN: Pasamos la función onOpenFavoritos */}
      <HeaderAdmin onOpenFavoritos={() => setOpenFavModal(true)} />

      {/* MAIN FULL WIDTH */}
      <main className="flex-1 w-full">
        <Outlet />
      </main>

      {/* FOOTER FULL WIDTH */}
      <FooterAdmin />

      {/* Modal */}
      <FavoritosModalAdmin
        isOpen={openFavModal}
        onClose={() => setOpenFavModal(false)}
      />
    </div>
  );
};

export default LayoutAdmin;