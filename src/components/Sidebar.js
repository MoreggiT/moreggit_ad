// src/components/Sidebar.js
import React from "react";
import "../styles/sidebar.css"; // 👈 RUTA CORRECTA

import iconInicio from "../icons/icon-inicio.svg";
import iconPedidos from "../icons/icon-pedidos.svg";
import iconAdmin from "../icons/icon-admin.svg";

function SidebarButton({ id, label, icon, active, onClick }) {
  function handleClick() {
    if (typeof onClick === "function") {
      onClick(id);
    }
  }

  return (
    <button
      type="button"
      className={`gp-nav-btn ${active ? "active" : ""}`}
      data-view={id}
      onClick={handleClick}
      aria-current={active ? "page" : "false"}
    >
      <img src={icon} alt="" className="gp-nav-icon" aria-hidden="true" />
      <span className="gp-nav-text">{label}</span>
    </button>
  );
}

export default function Sidebar({ currentView, onNavigate }) {
  function handleNavigate(view) {
    if (typeof onNavigate === "function") {
      onNavigate(view);
    }

    // Guardar la vista en la URL (?view=)
    try {
      const url = new URL(window.location.href);
      url.searchParams.set("view", view);
      window.history.replaceState({}, "", url.toString());
    } catch (e) {
      // ignorar si falla
    }
  }

  return (
    <aside
      className="gp-sidebar"
      role="navigation"
      aria-label="Navegación principal"
    >
      <div className="gp-nav">
        <SidebarButton
          id="inicio"
          label="INICIO"
          icon={iconInicio}
          active={currentView === "inicio"}
          onClick={handleNavigate}
        />
        <SidebarButton
          id="pedidos"
          label="PEDIDOS"
          icon={iconPedidos}
          active={currentView === "pedidos"}
          onClick={handleNavigate}
        />
        <SidebarButton
          id="administracion"
          label="ADMIN"
          icon={iconAdmin}
          active={currentView === "administracion"}
          onClick={handleNavigate}
        />
      </div>
    </aside>
  );
}
