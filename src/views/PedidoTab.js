// src/views/PedidoTab.js
import React, { useEffect } from "react";

function PedidoTab() {
  // Al montar la pestaña, intentamos inicializar talles y filas
  useEffect(() => {
    // Estas funciones vienen del JS global (el que pegaste con GP_PEDIDO_...)
    try {
      if (window.GP_PEDIDO_cargarTalles) {
        window.GP_PEDIDO_cargarTalles();
      }
      if (window.GP_PEDIDO_generarFilasIniciales) {
        window.GP_PEDIDO_generarFilasIniciales();
      }
    } catch (e) {
      // En local sin esos scripts simplemente no hace nada
      console.warn("Init GP_PEDIDO_* no disponible:", e);
    }
  }, []);

  const handleGuardar = () => {
    if (window.guardarPedidos) {
      window.guardarPedidos();
    } else {
      console.warn("guardarPedidos() no está definido en window");
    }
  };

  const handleImprimir = () => {
    if (window.GP_PEDIDO_imprimirPedido) {
      window.GP_PEDIDO_imprimirPedido();
    } else if (window.imprimirPedido) {
      window.imprimirPedido();
    }
  };

  const handleCSV = () => {
    if (window.GP_PEDIDO_descargarCSV) {
      window.GP_PEDIDO_descargarCSV();
    } else if (window.descargarCSV) {
      window.descargarCSV();
    }
  };

  const handleAgregarFilas = () => {
    if (window.GP_PEDIDO_agregarFilasCantidad) {
      window.GP_PEDIDO_agregarFilasCantidad();
    } else if (window.agregarFilasCantidad) {
      window.agregarFilasCantidad();
    }
  };

  return (
    <div id="pedido-tab" className="tab-content">
      <div className="card">
        <h2 className="form-title">
          <span>Detalles del Pedido</span>

          {/* Toolbar derecha: Guardar, Imprimir, CSV */}
          <div className="tab-actions-toolbar">
            <button
              type="button"
              id="btn-guardar-pedido"
              className="btn btn-xs"
              onClick={handleGuardar}
            >
              <i className="material-icons" style={{ fontSize: 16 }}>
                cloud_upload
              </i>
              <span className="btn-text">Guardar pedido</span>
            </button>

            <button
              type="button"
              className="btn btn-outline btn-xs"
              onClick={handleImprimir}
            >
              <i className="material-icons" style={{ fontSize: 16 }}>
                print
              </i>
              <span className="btn-text">Imprimir</span>
            </button>

            <button
              type="button"
              className="btn btn-outline btn-xs"
              onClick={handleCSV}
            >
              <i className="material-icons" style={{ fontSize: 16 }}>
                download
              </i>
              <span className="btn-text">CSV</span>
            </button>
          </div>
        </h2>

        {/* Notificaciones (mismos IDs que el código original) */}
        <div
          className="notification info"
          id="pedido-info"
          style={{ display: "none" }}
        ></div>
        <div className="notification" id="pedido-notification"></div>

        {/* Toolbar de cantidad de filas */}
        <div className="table-header">
          <div className="quantity-control">
            <label htmlFor="cantidad-filas">Agregar filas:</label>
            <input
              type="number"
              id="cantidad-filas"
              className="quantity-input input-field"
              defaultValue="1"
              min="1"
              max="50"
              style={{ padding: "6px 10px" }}
            />
            <button
              type="button"
              className="btn btn-outline btn-xs"
              onClick={handleAgregarFilas}
            >
              <i className="material-icons" style={{ fontSize: 16 }}>
                add
              </i>
              <span className="btn-text">Agregar</span>
            </button>
          </div>
        </div>

        {/* Tabla principal: cuerpo se llena con JS (agregarFilaATabla) */}
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Talle Superior</th>
                <th>Talle Inferior</th>
                <th className="right">Medias</th>
                <th className="right">N°</th>
                <th>Nombre</th>
                <th>Diseño</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody id="pedidos-tbody"></tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default PedidoTab;
