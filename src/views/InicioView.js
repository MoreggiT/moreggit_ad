// src/views/InicioView.js
import React, { useEffect, useState, useCallback } from "react";
import { supabase } from "../supabaseClient";

function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("es-UY");
}

export default function InicioView() {
  const [ordenes, setOrdenes] = useState([]);
  const [estadosOptions, setEstadosOptions] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  
  const [selected, setSelected] = useState(null);
  const [saving, setSaving] = useState(false);

  // 1. Cargar Estados y Colores desde la BD
  const loadEstados = async () => {
    try {
      // Obtenemos 'nombre' y 'color_hex'
      const { data, error } = await supabase
        .from("estados_orden")
        .select("*")
        .order("id", { ascending: true });

      if (error) throw error;
      setEstadosOptions(data || []);
    } catch (err) {
      console.error("Error al cargar estados:", err);
    }
  };

  // 2. Cargar Órdenes
  const loadOrdenes = useCallback(async () => {
    setLoading(true);
    setErrorMsg("");

    const { data, error } = await supabase
      .from("ordenes")
      .select("*")
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
    loadEstados();
    loadOrdenes();
  }, [loadOrdenes]);

  // --- CAMBIO RÁPIDO DE ESTADO DESDE LA TARJETA ---
  const handleQuickStateChange = async (e, ordenId, newEstado) => {
    e.stopPropagation(); // Evita abrir el modal

    try {
      const { error } = await supabase
        .from("ordenes")
        .update({ estado: newEstado })
        .eq("id", ordenId);

      if (error) throw error;

      // Recargamos para ver el cambio de color y texto
      await loadOrdenes();
    } catch (err) {
      alert("Error al cambiar estado: " + err.message);
    }
  };

  // --- LÓGICA DEL MODAL ---
  const handleOpenModal = (orden) => setSelected(orden);
  const handleCloseModal = () => setSelected(null);

  const handleFieldChange = (field, value) => {
    setSelected((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  const handleSaveModal = async () => {
    if (!selected) return;
    setSaving(true);
    const { id, codigo, creado_en, ...rest } = selected;

    // Asegúrate que los campos coincidan con tu tabla 'ordenes'
    const payload = {
      referencia: rest.referencia,
      nombre_cliente: rest.nombre_cliente,
      whatsapp: rest.whatsapp,
      email: rest.email,
      estado: rest.estado,
      total: rest.total
    };

    const { error } = await supabase.from("ordenes").update(payload).eq("id", id);

    if (error) {
      alert(error.message);
    } else {
      await loadOrdenes();
      setSelected(null);
    }
    setSaving(false);
  };

  // Helper para obtener el color_hex correcto
  const getColor = (estadoNombre) => {
    if (!estadoNombre) return "#ccc";
    // Buscamos en el array de estados cargado desde la BD
    const estadoObj = estadosOptions.find(e => e.nombre === estadoNombre);
    // Usamos la columna 'color_hex', o un gris por defecto si no se encuentra
    return estadoObj ? estadoObj.color_hex : "#ccc";
  };

  return (
    <div className="inicio-root">
      <header className="inicio-header">
        <div>
          <h1 className="main-title">Panel de Órdenes</h1>
          <p className="inicio-subtitle">Vista general de tarjetas.</p>
        </div>
        <button type="button" className="btn btn-outline btn-xs" onClick={loadOrdenes}>
          <span className="material-icons" style={{ fontSize: 16 }}>refresh</span>
          <span className="btn-text">Actualizar</span>
        </button>
      </header>

      {errorMsg && <div className="notification error">{errorMsg}</div>}
      {loading && <div className="notification info">Cargando órdenes…</div>}

      {/* GRID DE TARJETAS */}
      <section className="inicio-grid">
        {!loading && ordenes.length === 0 && !errorMsg && (
          <p className="inicio-empty">No hay órdenes cargadas todavía.</p>
        )}

        {ordenes.map((ord) => {
          // Obtenemos el color desde la BD usando el nombre del estado
          const borderColor = getColor(ord.estado);

          return (
            <div
              key={ord.id}
              className="inicio-card"
              // APLICAMOS EL COLOR AQUÍ:
              style={{ borderLeftColor: borderColor }}
              onClick={() => handleOpenModal(ord)}
              role="button"
              tabIndex={0}
            >
              <div className="inicio-card-header">
                <span className="inicio-card-codigo">
                  {ord.codigo || `OR-${ord.id}`}
                </span>
                {/* Mostramos el total si existe */}
                <span className="inicio-card-monto">
                  {ord.total ? `$ ${ord.total}` : ""}
                </span>
              </div>

              <div className="inicio-card-body">
                <div className="inicio-card-cliente">
                  {ord.nombre_cliente || "Sin cliente"}
                </div>
                {ord.referencia && (
                  <div className="inicio-card-ref">{ord.referencia}</div>
                )}
              </div>

              <div className="inicio-card-footer">
                {/* SELECT PARA CAMBIO RÁPIDO SIN ABRIR MODAL */}
                <div 
                  className="quick-status-wrapper" 
                  onClick={(e) => e.stopPropagation()} 
                >
                  <select
                    className="inicio-card-select"
                    value={ord.estado || ""}
                    onChange={(e) => handleQuickStateChange(e, ord.id, e.target.value)}
                  >
                    <option value="" disabled>Estado...</option>
                    {estadosOptions.map((est) => (
                      <option key={est.id} value={est.nombre}>
                        {est.nombre}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {/* MODAL DETALLE */}
      {selected && (
        <div className="inicio-modal-backdrop" onClick={handleCloseModal}>
          <div className="inicio-modal" onClick={(e) => e.stopPropagation()}>
            <header className="inicio-modal-header">
              <div>
                <div className="inicio-modal-title">
                  Orden: {selected.codigo || `#${selected.id}`}
                </div>
                <div className="inicio-modal-sub">Detalles y edición</div>
              </div>
              <button className="btn btn-muted btn-xs" onClick={handleCloseModal}>
                <span className="material-icons">close</span>
              </button>
            </header>

            <div className="inicio-modal-body">
              <div className="inicio-modal-grid">
                <div className="form-group">
                  <label>Cliente</label>
                  <input
                    type="text"
                    className="input-field"
                    value={selected.nombre_cliente || ""}
                    onChange={(e) => handleFieldChange("nombre_cliente", e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Referencia</label>
                  <input
                    type="text"
                    className="input-field"
                    value={selected.referencia || ""}
                    onChange={(e) => handleFieldChange("referencia", e.target.value)}
                  />
                </div>
              </div>

              <div className="inicio-modal-grid" style={{ marginTop: 10 }}>
                <div className="form-group">
                  <label>WhatsApp</label>
                  <input
                    type="tel"
                    className="input-field"
                    value={selected.whatsapp || ""}
                    onChange={(e) => handleFieldChange("whatsapp", e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    className="input-field"
                    value={selected.email || ""}
                    onChange={(e) => handleFieldChange("email", e.target.value)}
                  />
                </div>
              </div>

              <div className="inicio-modal-grid" style={{ marginTop: 10 }}>
                <div className="form-group">
                  <label>Estado</label>
                  <select
                    className="select-field"
                    value={selected.estado || ""}
                    onChange={(e) => handleFieldChange("estado", e.target.value)}
                  >
                    <option value="">-- Seleccionar --</option>
                    {estadosOptions.map((est) => (
                      <option key={est.id} value={est.nombre}>
                        {est.nombre}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Total ($)</label>
                  <input
                    type="number"
                    className="input-field"
                    value={selected.total || 0}
                    onChange={(e) => handleFieldChange("total", e.target.value)}
                  />
                </div>
              </div>
              
              <div style={{ marginTop: 15, fontSize: '0.85rem', color: '#666' }}>
                Fecha: {formatDate(selected.creado_en)}
              </div>
            </div>

            <footer className="inicio-modal-footer">
              <button className="btn btn-muted btn-xs" onClick={handleCloseModal}>Cancelar</button>
              <button className="btn btn-xs" disabled={saving} onClick={handleSaveModal}>
                {saving ? "Guardando..." : "Guardar cambios"}
              </button>
            </footer>
          </div>
        </div>
      )}
    </div>
  );
}