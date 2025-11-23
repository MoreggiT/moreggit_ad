// src/views/FacturacionTab.js
import React, { useEffect } from "react";

function FacturacionTab() {
  useEffect(() => {
    // Inicializar la lógica global de Facturación (FAC_*)
    try {
      if (window.FAC_bindTop) {
        window.FAC_bindTop();
      }
      if (window.FAC_init) {
        window.FAC_init();
      } else if (window.facInit) {
        window.facInit();
      }
    } catch (e) {
      console.warn("FAC_* no disponible todavía:", e);
    }
  }, []);

  return (
    <div id="facturacion-tab" className="tab-content">
      <div className="fac-wrap">
        {/* Línea de Ganancia */}
        <div id="fac-profit-line" className="profit-line">
          <span className="muted">Ganancia:</span>
          <span id="fac-profit-amt" className="val">
            —
          </span>
          <span id="fac-profit-pct" className="val">
            —
          </span>
        </div>

        {/* Héroe / Encabezado */}
        <div className="fac-hero">
          <div className="title">Facturación</div>
          <div
            style={{
              display: "flex",
              gap: "8px",
              alignItems: "center",
            }}
          >
            <span className="badge">
              <span
                className="material-icons"
                style={{ fontSize: 18 }}
                aria-hidden="true"
              >
                payments
              </span>
              <span className="btn-text">Resumen en vivo</span>
            </span>

            <button
              id="fac-btn-print"
              className="btn btn-outline btn-xs"
              type="button"
              title="Imprimir factura"
            >
              <span
                className="material-icons"
                style={{ fontSize: 16 }}
                aria-hidden="true"
              >
                print
              </span>
              <span className="btn-text">Imprimir</span>
            </button>
          </div>
        </div>

        {/* KPIs */}
        <div className="kpis">
          <div className="kpi primary">
            <div className="label">Total</div>
            <div id="fac-kpi-total" className="value">
              $ 0,00
            </div>
          </div>
          <div className="kpi">
            <div className="label">Total pago</div>
            <div id="fac-kpi-pagos" className="value">
              $ 0,00
            </div>
          </div>
          <div className="kpi">
            <div className="label">Total a pagar</div>
            <div id="fac-kpi-resto" className="value">
              $ 0,00
            </div>
          </div>
        </div>

        {/* Resumen de descuento */}
        <div id="fac-discount-summary" className="discount-summary">
          <span className="badge secondary">
            <span
              className="material-icons"
              style={{ fontSize: 18 }}
              aria-hidden="true"
            >
              percent
            </span>
            Descuento aplicado
          </span>
          <div className="kpis" style={{ marginTop: "10px" }}>
            <div className="kpi">
              <div className="label">Descuento</div>
              <div id="fac-kpi-desc" className="value">
                0% — $ 0,00
              </div>
            </div>
            <div className="kpi">
              <div className="label">Total sin descuento</div>
              <div id="fac-kpi-total-sin" className="value">
                $ 0,00
              </div>
            </div>
            <div className="kpi">
              <div className="label">Total con descuento</div>
              <div id="fac-kpi-total-con" className="value">
                $ 0,00
              </div>
            </div>
          </div>
        </div>

        {/* Toolbar superior */}
        <div className="fac-toolbar">
          <div className="fac-add-controls">
            <label htmlFor="fac-add-count" className="muted">
              Cantidad de líneas
            </label>
            <input
              id="fac-add-count"
              className="input-field fac-count"
              type="number"
              min="1"
              max="50"
              defaultValue="1"
            />
            <button
              id="fac-btn-add"
              className="btn btn-outline btn-xs"
              type="button"
            >
              <span
                className="material-icons"
                style={{ fontSize: 16 }}
                aria-hidden="true"
              >
                add
              </span>
              <span className="btn-text">Agregar líneas</span>
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {/* Toggle Ganancia */}
            <div className="profit-row">
              <label
                className="muted"
                htmlFor="fac-toggle-profit"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  cursor: "pointer",
                }}
              >
                <input
                  id="fac-toggle-profit"
                  type="checkbox"
                  style={{ transform: "translateY(1px)" }}
                />
                <span>Aplicar ganancia</span>
              </label>
            </div>

            {/* Descuento */}
            <div className="discount-row">
              <button
                id="fac-btn-toggle-desc"
                className="btn btn-outline btn-xs"
                type="button"
              >
                <span
                  className="material-icons"
                  style={{ fontSize: 16 }}
                  aria-hidden="true"
                >
                  percent
                </span>
                <span className="btn-text">Agregar descuento</span>
              </button>

              <button
                id="fac-btn-quitar-desc"
                className="btn btn-danger btn-xs"
                type="button"
                style={{ display: "none" }}
              >
                <span
                  className="material-icons"
                  style={{ fontSize: 16 }}
                  aria-hidden="true"
                >
                  backspace
                </span>
                <span className="btn-text">Eliminar descuento</span>
              </button>

              <div id="fac-panel-desc" className="discount-panel">
                <label htmlFor="fac-input-desc" className="muted">
                  Descuento (%)
                </label>
                <input
                  id="fac-input-desc"
                  className="input-field"
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  defaultValue="0"
                  style={{ width: "140px" }}
                />
                <button
                  id="fac-btn-guardar-desc"
                  className="btn btn-xs"
                  type="button"
                >
                  <span
                    className="material-icons"
                    style={{ fontSize: 16 }}
                    aria-hidden="true"
                  >
                    check
                  </span>
                  <span className="btn-text">Aplicar</span>
                </button>
                <button
                  id="fac-btn-cancelar-desc"
                  className="btn btn-muted btn-xs"
                  type="button"
                >
                  <span
                    className="material-icons"
                    style={{ fontSize: 16 }}
                    aria-hidden="true"
                  >
                    close
                  </span>
                  <span className="btn-text">Cancelar</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tabla de ítems */}
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th style={{ width: "220px" }}>Código</th>
                <th>Descripción</th>
                <th style={{ width: "120px" }} className="right">
                  Cantidad
                </th>
                <th style={{ width: "160px" }} className="right">
                  Costo unitario
                </th>
                <th style={{ width: "160px" }} className="right">
                  Importe
                </th>
                <th style={{ width: "90px" }}>Acciones</th>
              </tr>
            </thead>
            <tbody id="fac-tbody"></tbody>
          </table>
        </div>

        {/* Pagos por orden */}
        <div className="pay-card" id="fac-pagos-card">
          <div className="pay-toolbar">
            <span id="fac-pagos-orden-label" className="muted"></span>
            <button
              id="fac-btn-pago-nuevo"
              className="btn btn-xs"
              type="button"
            >
              <span
                className="material-icons"
                style={{ fontSize: 16 }}
                aria-hidden="true"
              >
                add_circle
              </span>
              <span className="btn-text">Agregar pago</span>
            </button>
            <button
              id="fac-btn-pago-refresh"
              className="btn btn-outline btn-xs"
              type="button"
            >
              <span
                className="material-icons"
                style={{ fontSize: 16 }}
                aria-hidden="true"
              >
                refresh
              </span>
              <span className="btn-text">Refrescar</span>
            </button>
          </div>
          <div
            id="fac-pagos-empty"
            className="muted"
            style={{ display: "none" }}
          >
            No hay pagos registrados para esta orden.
          </div>
          <div className="pay-list" id="fac-pagos-list"></div>
        </div>
      </div>

      {/* Modal pago rápido */}
      <div
        id="fac-pay-modal"
        className="pay-modal-backdrop"
        aria-hidden="true"
      >
        <div
          className="pay-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="fac-pay-title"
        >
          <div className="pay-modal-header">
            <div id="fac-pay-title" className="admin-modal-title">
              Agregar pago a la orden
            </div>
            <button
              className="btn btn-muted btn-xs"
              type="button"
              id="fac-pay-close"
            >
              <span
                className="material-icons"
                style={{ fontSize: 16 }}
                aria-hidden="true"
              >
                close
              </span>
              <span className="btn-text">Cerrar</span>
            </button>
          </div>

          <div className="pay-modal-body">
            <div className="pay-grid" style={{ marginBottom: "8px" }}>
              <div>
                <label htmlFor="fac-pay-fecha" className="muted">
                  Fecha
                </label>
                <input
                  id="fac-pay-fecha"
                  className="input-field"
                  type="date"
                />
              </div>
              <div>
                <label htmlFor="fac-pay-monto" className="muted">
                  Monto
                </label>
                <input
                  id="fac-pay-monto"
                  className="input-field"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="pay-grid">
              <div>
                <label htmlFor="fac-pay-moneda" className="muted">
                  Moneda
                </label>
                <select
                  id="fac-pay-moneda"
                  className="select-field"
                  defaultValue="$"
                >
                  <option value="$">$ (UYU)</option>
                  <option value="USD">USD</option>
                </select>
              </div>
              <div>
                <label htmlFor="fac-pay-tipo" className="muted">
                  Tipo
                </label>
                <select
                  id="fac-pay-tipo"
                  className="select-field"
                  defaultValue="ingreso"
                >
                  <option value="ingreso">Ingreso</option>
                  <option value="egreso">Egreso</option>
                </select>
              </div>
            </div>

            <div style={{ marginTop: "8px" }}>
              <label htmlFor="fac-pay-desc" className="muted">
                Descripción
              </label>
              <input
                id="fac-pay-desc"
                className="input-field"
                type="text"
                placeholder="Detalle del pago"
              />
            </div>

            <div style={{ marginTop: "8px" }} className="muted">
              Orden: <strong id="fac-pay-orden"></strong>
            </div>

            <div
              id="fac-pay-msg"
              className="notification"
              style={{ display: "none" }}
            ></div>
          </div>

          <div className="pay-modal-footer">
            <button
              className="btn btn-secondary"
              type="button"
              id="fac-pay-cancel"
            >
              <span className="btn-text">Cancelar</span>
            </button>
            <button
              className="btn btn-primary"
              type="button"
              id="fac-pay-save"
            >
              <span
                className="material-icons"
                style={{ fontSize: 18 }}
                aria-hidden="true"
              >
                save
              </span>
              <span className="btn-text">Guardar pago</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FacturacionTab;
