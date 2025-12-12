// LayoutAdmin.jsx
import { useState } from "react";
import HeaderUser from "../PagesUser/HeaderUser";
import FooterUser from "../PagesUser/FooterUser";
import { Outlet } from "react-router-dom";
import FavoritosModalAdmin from "../PagesAdmin/FavoritosModalAdmin"; // default export

const LayoutUser = () => {
  const [openFavModal, setOpenFavModal] = useState(false);

  return (
    <div className="w-full min-h-screen flex flex-col bg-black/60">
      {/* HEADER FULL WIDTH */}
      {/* 🛑 CORRECCIÓN: Pasamos la función onOpenFavoritos */}
      <HeaderUser onOpenFavoritos={() => setOpenFavModal(true)} />

      {/* MAIN FULL WIDTH */}
      <main className="flex-1 w-full">
        <Outlet />
      </main>

      {/* FOOTER FULL WIDTH */}
      <FooterUser />

      {/* Modal */}
      <FavoritosModalAdmin
        isOpen={openFavModal}
        onClose={() => setOpenFavModal(false)}
      />
    </div>
  );
};

export default LayoutUser;