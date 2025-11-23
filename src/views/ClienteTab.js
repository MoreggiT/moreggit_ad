// src/views/ClienteTab.js
import React from "react";

function ClienteTab() {
  return (
    <div id="cliente-tab" className="tab-content active">
      <div className="cli-card">
        {/* Header con título + badge de orden/ID (usado por el JS global) */}
        <div className="cli-title">
          <div className="cli-title-left">
            <span className="cli-dot" aria-hidden="true"></span>
            <span className="cli-title-text">Información del Cliente</span>
          </div>

          {/* Badge que el código global actualiza con orden / ID de pedido */}
          <div
            id="pedido-id-badge"
            className="pedido-id-badge"
            style={{ display: "none" }}
          >
            <span className="dot" aria-hidden="true"></span>
            <span className="txt"></span>
          </div>
        </div>

        {/* Primera fila: Nombre + Referencia */}
        <div className="cli-grid" style={{ marginBottom: "12px" }}>
          <div className="form-group">
            <label htmlFor="nombre">Nombre Completo</label>
            <input
              type="text"
              id="nombre"
              className="input-field"
              placeholder="Ingrese nombre completo"
              autoComplete="name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="referencia">Referencia del Pedido</label>
            <input
              type="text"
              id="referencia"
              className="input-field"
              placeholder="Ej: Equipo SUB13 2025"
            />
          </div>
        </div>

        {/* Segunda fila: WhatsApp + Email */}
        <div className="cli-row">
          <div className="form-group">
            <label htmlFor="whatsapp">WhatsApp</label>
            <input
              type="tel"
              id="whatsapp"
              className="input-field"
              placeholder="Ej: +598 99 123 456"
              autoComplete="tel"
            />
          </div>

          <div className="form-group">
            <label htmlFor="mail">Email</label>
            <input
              type="email"
              id="mail"
              className="input-field"
              placeholder="ejemplo@correo.com"
              autoComplete="email"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ClienteTab;
