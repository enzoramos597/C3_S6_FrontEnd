import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function ProfileSelectorUser() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const perfiles = user?.perfiles || [];

  const handleCrearPerfil = () => {
    navigate("createperfiluser"); // o donde tengas tu form
  };

  const handleSeleccionarPerfil = (perfil) => {
    navigate("/user/peliculas");
  };

  return (
    <div style={{ padding: "40px", textAlign: "center", color: "white" }}>
      <h1>Selecciona un Perfil</h1>

      {/* 🟥 Si NO tiene perfiles */}
      {perfiles.length === 0 && (
        <div>
          <p>No tienes perfiles aún.</p>
          <button 
            onClick={handleCrearPerfil}
            style={{
              padding: "10px 20px",
              backgroundColor: "#ff3b3b",
              border: "none",
              borderRadius: "6px",
              marginTop: "20px",
              cursor: "pointer",
            }}
          >
            Crear Perfil
          </button>
        </div>
      )}

      {/* 🟩 Si SÍ tiene perfiles */}
      {perfiles.length > 0 && (
        <div style={{ display: "flex", justifyContent: "center", gap: "20px", marginTop: "30px" }}>
          {perfiles.map((perfil) => (
            <div
              key={perfil._id}
              onClick={() => handleSeleccionarPerfil(perfil)}
              style={{
                cursor: "pointer",
                width: "150px"
              }}
            >
              <img 
                src={perfil.avatar}
                alt="avatar"
                style={{
                  width: "100%",
                  borderRadius: "8px"
                }}
              />
              <p style={{ marginTop: "10px" }}>{perfil.nombre}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
