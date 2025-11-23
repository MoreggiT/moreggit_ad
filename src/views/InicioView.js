// src/views/InicioView.js
import React, { useEffect, useState, useCallback } from "react";
import { supabase } from "../supabaseClient";

const ESTADOS = [
  "Estado...",
  "PARA FABRICAR",
  "FABRICANDO",
  "PRONTO",
  "ENTREGADO",
  "ESPERA DE SEÑA",
  "NUNCA RETIRADO",
  "FALTA DE PAGO Y ENTREGADO",
  "CON FALTANTE",
];

function estadoClass(estado) {
  const e = (estado || "").toUpperCase();
  if (e === "PRONTO") return "estado-pronto";
  if (e === "FABRICANDO" || e === "PARA FABRICAR") return "estado-fabricando";
  if (e === "ENTREGADO") return "estado-entregado";
  if (e === "ESPERA DE SEÑA" || e === "FALTA DE PAGO Y ENTREGADO") {
    return "estado-espera";
  }
  if (e === "CON FALTANTE" || e === "NUNCA RETIRADO") return "estado-alerta";
  return "estado-default";
}

function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("es-UY");
}

export default function InicioView() {
  const [ordenes, setOrdenes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [selected, setSelected] = useState(null);
  const [saving, setSaving] = useState(false);

  const loadOrdenes = useCallback(async () => {
    setLoading(true);
    setErrorMsg("");

    const { data, error } = await supabase
      .from("ordenes")
      .select(
        "id, codigo, referencia, nombre_cliente, whatsapp, email, estado, creado_en"
      )
      // uso id para evitar problemas con order sobre columnas raras
      .order("id", { ascending: false });

    if (error) {
      console.error("Error al cargar órdenes:", error);
      setErrorMsg(error.message || "No se pudieron cargar las órdenes.");
      setOrdenes([]);
    } else {
      setOrdenes(data || []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadOrdenes();
  }, [loadOrdenes]);

  const handleOpenModal = (orden) => {
    setSelected(orden);
  };

  const handleCloseModal = () => {
    setSelected(null);
  };

  const handleFieldChange = (field, value) => {
    setSelected((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  const handleSave = async () => {
    if (!selected) return;

    setSaving(true);
    setErrorMsg("");

    const { id, codigo, creado_en, ...rest } = selected;

    const payload = {
      referencia: rest.referencia || null,
      nombre_cliente: rest.nombre_cliente || null,
      whatsapp: rest.whatsapp || null,
      email: rest.email || null,
      estado: rest.estado || null,
    };

    const { error } = await supabase
      .from("ordenes")
      .update(payload)
      .eq("id", id);

    if (error) {
      console.error("Error al guardar orden:", error);
      alert(error.message || "No se pudo guardar la orden.");
    } else {
      await loadOrdenes();
      setSelected(null);
    }

    setSaving(false);
  };

  return (
    <div className="inicio-root">
      {/* HEADER PRINCIPAL */}
      <header className="inicio-header">
        <div>
          <h1 className="main-title">Panel</h1>
          <p className="inicio-subtitle">
            Accedé a tus órdenes o creá nuevos pedidos desde el panel.
          </p>
        </div>

        <button
          type="button"
          className="btn btn-outline btn-xs"
          onClick={loadOrdenes}
        >
          <span className="material-icons" style={{ fontSize: 16 }}>
            refresh
          </span>
          <span className="btn-text">Actualizar</span>
        </button>
      </header>

      {/* RESUMEN / TOTAL ÓRDENES */}
      <section className="inicio-resumen">
        <span className="inicio-resumen-label">Resumen</span>
        <div className="inicio-total-pill">
          <span className="material-icons" style={{ fontSize: 18 }}>
            receipt_long
          </span>
          <span className="inicio-total-text">Total órdenes:</span>
          <span className="inicio-total-value">{ordenes.length}</span>
        </div>
      </section>

      {/* MENSAJES DE ESTADO */}
      {errorMsg && (
        <div className="notification error" style={{ marginBottom: 10 }}>
          {errorMsg}
        </div>
      )}
      {loading && (
        <div className="notification info" style={{ marginBottom: 10 }}>
          Cargando órdenes…
        </div>
      )}

      {/* GRID DE TARJETAS */}
      <section className="inicio-grid">
        {!loading && ordenes.length === 0 && !errorMsg && (
          <p className="inicio-empty">No hay órdenes cargadas todavía.</p>
        )}

        {ordenes.map((ord) => (
          <button
            key={ord.id}
            type="button"
            className={`inicio-card ${estadoClass(ord.estado)}`}
            onClick={() => handleOpenModal(ord)}
          >
            <div className="inicio-card-header">
              <span className="inicio-card-codigo">
                {ord.codigo || `OR-${ord.id}`}
              </span>
              <span className="inicio-card-fecha">
                {formatDate(ord.creado_en)}
              </span>
            </div>

            <div className="inicio-card-body">
              <div className="inicio-card-nombre">
                {ord.nombre_cliente || "Sin nombre"}
              </div>
              {ord.referencia && (
                <div className="inicio-card-ref">{ord.referencia}</div>
              )}
            </div>

            <div className="inicio-card-footer">
              <span className="inicio-card-estado-label">Estado</span>
              <span className="inicio-card-estado">
                {ord.estado || "Estado..."}
              </span>
            </div>
          </button>
        ))}
      </section>

      {/* MODAL DE EDICIÓN */}
      {selected && (
        <div
          className="inicio-modal-backdrop"
          onClick={handleCloseModal}
          aria-hidden="true"
        >
          <div
            className="inicio-modal"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <header className="inicio-modal-header">
              <div>
                <div className="inicio-modal-pill">
                  {selected.codigo || `OR-${selected.id}`}
                </div>
                <div className="inicio-modal-sub">
                  Edición rápida de datos del cliente y estado.
                </div>
              </div>

              <button
                type="button"
                className="btn btn-muted btn-xs"
                onClick={handleCloseModal}
              >
                <span className="material-icons" style={{ fontSize: 16 }}>
                  close
                </span>
                <span className="btn-text">Cerrar</span>
              </button>
            </header>

            <div className="inicio-modal-body">
              <div className="inicio-modal-grid">
                <div className="form-group">
                  <label htmlFor="modal-nombre">Nombre del cliente</label>
                  <input
                    id="modal-nombre"
                    type="text"
                    className="input-field"
                    value={selected.nombre_cliente || ""}
                    onChange={(e) =>
                      handleFieldChange("nombre_cliente", e.target.value)
                    }
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="modal-ref">Referencia del pedido</label>
                  <input
                    id="modal-ref"
                    type="text"
                    className="input-field"
                    value={selected.referencia || ""}
                    onChange={(e) =>
                      handleFieldChange("referencia", e.target.value)
                    }
                  />
                </div>
              </div>

              <div className="inicio-modal-grid">
                <div className="form-group">
                  <label htmlFor="modal-whatsapp">WhatsApp</label>
                  <input
                    id="modal-whatsapp"
                    type="tel"
                    className="input-field"
                    value={selected.whatsapp || ""}
                    onChange={(e) =>
                      handleFieldChange("whatsapp", e.target.value)
                    }
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="modal-email">Email</label>
                  <input
                    id="modal-email"
                    type="email"
                    className="input-field"
                    value={selected.email || ""}
                    onChange={(e) =>
                      handleFieldChange("email", e.target.value)
                    }
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginTop: 8 }}>
                <label htmlFor="modal-estado">Estado</label>
                <select
                  id="modal-estado"
                  className="select-field"
                  value={selected.estado || "Estado..."}
                  onChange={(e) =>
                    handleFieldChange("estado", e.target.value === "Estado..." ? null : e.target.value)
                  }
                >
                  {ESTADOS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <footer className="inicio-modal-footer">
              <button
                type="button"
                className="btn btn-muted btn-xs"
                onClick={handleCloseModal}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="btn btn-xs"
                disabled={saving}
                onClick={handleSave}
              >
                {saving ? "Guardando…" : "Guardar cambios"}
              </button>
            </footer>
          </div>
        </div>
      )}
    </div>
  );
}
