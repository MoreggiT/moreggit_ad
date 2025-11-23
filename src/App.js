// src/App.js
import React, { useState, useEffect } from "react";
import "./index.css";
import "./styles/sidebar.css";
import "./styles/cliente.css";
import "./styles/pedido.css";
import "./styles/facturacion.css";
import "./styles/admin.css";
import "./styles/inicio.css";

import Sidebar from "./components/Sidebar";
import ClienteTab from "./views/ClienteTab";
import PedidoTab from "./views/PedidoTab";
import FacturacionTab from "./views/FacturacionTab";
import AdminView from "./views/AdminView";
import InicioView from "./views/InicioView";

function App() {
  const [view, setView] = useState("inicio"); // inicio | pedidos | administracion
  const [pedidoTab, setPedidoTab] = useState("cliente"); // cliente | pedido | facturacion

  useEffect(() => {
    try {
      const url = new URL(window.location.href);
      const v = url.searchParams.get("view");
      if (v === "pedidos" || v === "administracion" || v === "inicio") {
        setView(v);
      }
    } catch (e) {}
  }, []);

  useEffect(() => {
    try {
      const url = new URL(window.location.href);
      url.searchParams.set("view", view);
      window.history.replaceState({}, "", url.toString());
    } catch (e) {}
  }, [view]);

  const renderMainView = () => {
    if (view === "inicio") {
      return <InicioView />;
    }

    if (view === "pedidos") {
      return (
        <div className="main-card">
          <h1 className="main-title">Gestor de Pedidos</h1>

          <div className="inner-tabs">
            <button
              className={`inner-tab-btn ${
                pedidoTab === "cliente" ? "active" : ""
              }`}
              onClick={() => setPedidoTab("cliente")}
            >
              Cliente
            </button>
            <button
              className={`inner-tab-btn ${
                pedidoTab === "pedido" ? "active" : ""
              }`}
              onClick={() => setPedidoTab("pedido")}
            >
              Pedido
            </button>
            <button
              className={`inner-tab-btn ${
                pedidoTab === "facturacion" ? "active" : ""
              }`}
              onClick={() => setPedidoTab("facturacion")}
            >
              Facturación
            </button>
          </div>

          <div className="inner-tab-content">
            {pedidoTab === "cliente" && <ClienteTab />}
            {pedidoTab === "pedido" && <PedidoTab />}
            {pedidoTab === "facturacion" && <FacturacionTab />}
          </div>
        </div>
      );
    }

    if (view === "administracion") {
      return (
        <div className="main-card">
          <AdminView />
        </div>
      );
    }

    return null;
  };

  return (
    <div className="app-root">
      <Sidebar currentView={view} onNavigate={(v) => setView(v)} />
      <main className="app-main">{renderMainView()}</main>
    </div>
  );
}

export default App;
