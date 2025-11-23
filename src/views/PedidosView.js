// src/views/PedidosView.js
import React, { useEffect, useState } from "react";
import "../styles/pedidos.css";
import { fetchPedidos, createPedido } from "../api/pedidosApi";

const nfUYU = new Intl.NumberFormat("es-UY", {
  style: "currency",
  currency: "UYU",
  minimumFractionDigits: 2,
});

function formatMoney(valor) {
  const n = Number(valor || 0);
  return nfUYU.format(n).replace("UYU", "$");
}

function toDDMMYYYY(value) {
  if (!value) return "";
  if (typeof value === "string" && /^\d{2}\/\d{2}\/\d{4}$/.test(value)) {
    return value;
  }
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yy = d.getFullYear();
  return `${dd}/${mm}/${yy}`;
}

const ESTADOS = ["Borrador", "En producción", "Entregado", "Cancelado"];

export default function PedidosView() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(false);

  // Modal / formulario
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    fecha: "",
    numero: "",
    cliente: "",
    total: "",
    estado: "Borrador",
    nota: "",
  });

  // Mensajes
  const [bannerMsg, setBannerMsg] = useState(null); // {type,text}
  const [formMsg, setFormMsg] = useState(null); // {type,text}

  function showBanner(text, type = "info") {
    setBannerMsg({ text, type });
    setTimeout(() => setBannerMsg(null), 3200);
  }

  function showFormMsg(text, type = "error") {
    setFormMsg({ text, type });
    setTimeout(() => setFormMsg(null), 3200);
  }

  async function cargarPedidos() {
    setLoading(true);
    try {
      const rows = await fetchPedidos();
      setPedidos(rows || []);
    } catch (err) {
      console.error(err);
      showBanner("No se pudieron cargar los pedidos.", "error");
    } finally {
      setLoading(false);
    }
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    // Fecha default para el formulario
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    setForm((prev) => ({
      ...prev,
      fecha: `${yyyy}-${mm}-${dd}`,
    }));

    cargarPedidos();
  }, []);

  function abrirModal() {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");

    setForm({
      fecha: `${yyyy}-${mm}-${dd}`,
      numero: "",
      cliente: "",
      total: "",
      estado: "Borrador",
      nota: "",
    });
    setFormMsg(null);
    setModalOpen(true);
  }

  function cerrarModal() {
    if (saving) return;
    setModalOpen(false);
  }

  async function handleGuardar(e) {
    e?.preventDefault?.();

    const totalNumber = parseFloat(form.total || "0");
    if (!form.fecha) {
      showFormMsg("Ingresá una fecha válida.", "error");
      return;
    }
    if (!form.numero.trim()) {
      showFormMsg("Ingresá un número de orden.", "error");
      return;
    }
    if (!form.cliente.trim()) {
      showFormMsg("Ingresá el nombre del cliente.", "error");
      return;
    }
    if (!Number.isFinite(totalNumber) || totalNumber <= 0) {
      showFormMsg("Ingresá un total válido.", "error");
      return;
    }

    try {
      setSaving(true);
      await createPedido({
        fecha: form.fecha,
        numero: form.numero.trim(),
        cliente: form.cliente.trim(),
        total: totalNumber,
        estado: form.estado,
        nota: form.nota?.trim() || null,
      });

      showBanner("Pedido guardado.", "success");
      setModalOpen(false);
      await cargarPedidos();
    } catch (err) {
      console.error(err);
      showFormMsg(
        "No se pudo guardar el pedido: " +
          (err?.message || "error desconocido"),
        "error"
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div id="pedidos-root">
      {/* Card principal de Pedidos */}
      <div className="ped-card">
        <div className="ped-header">
          <div className="ped-title">Pedidos</div>
          <div className="ped-toolbar">
            <button
              type="button"
              className="btn btn-outline btn-xs"
              onClick={cargarPedidos}
              disabled={loading}
            >
              <span className="material-icons" style={{ fontSize: 16 }}>
                refresh
              </span>
              {loading ? "Actualizando..." : "Actualizar"}
            </button>
            <button
              type="button"
              className="btn btn-xs"
              onClick={abrirModal}
              disabled={loading}
            >
              <span className="material-icons" style={{ fontSize: 16 }}>
                add_circle
              </span>
              Nuevo pedido
            </button>
          </div>
        </div>

        {bannerMsg && (
          <div className={`notification ${bannerMsg.type}`}>
            {bannerMsg.text}
          </div>
        )}

        {/* Resumen simple arriba si querés en el futuro */}
      </div>

      {/* Card de lista de pedidos */}
      <div className="ped-card">
        <h2 className="form-title" style={{ margin: "0 0 10px" }}>
          Lista de pedidos
        </h2>

        {loading && (
          <div className="muted" style={{ marginBottom: 8 }}>
            Cargando pedidos...
          </div>
        )}

        <div className="ped-cards-wrap">
          {!loading && pedidos.length === 0 && (
            <div className="muted" style={{ display: "block" }}>
              No hay pedidos cargados aún.
            </div>
          )}

          {pedidos.map((p) => {
            return (
              <div key={p.id} className="ped-mov-card">
                <div className="ped-mov-title">
                  <div>
                    <span className="pill pill-num">
                      {p.numero || "SIN NÚMERO"}
                    </span>
                  </div>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    <span className="pill pill-estado">{p.estado}</span>
                    {p.total != null && (
                      <span className="pill pill-total">
                        {formatMoney(p.total)}
                      </span>
                    )}
                  </div>
                </div>

                <div className="ped-mov-data">
                  <div className="cell">
                    <div className="lbl">Cliente</div>
                    <div className="val">{p.cliente || "Sin cliente"}</div>
                  </div>

                  <div className="cell">
                    <div className="lbl">Fecha</div>
                    <div className="val">{toDDMMYYYY(p.fecha)}</div>
                  </div>

                  {p.nota && p.nota.trim() && (
                    <div className="cell">
                      <div className="lbl">Nota</div>
                      <div className="val">{p.nota}</div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal Nuevo Pedido */}
      {modalOpen && (
        <div
          className="ped-modal-backdrop"
          aria-hidden="false"
          onClick={cerrarModal}
        >
          <div
            className="ped-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="ped-modal-title"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="ped-modal-header">
              <div className="ped-modal-title" id="ped-modal-title">
                Nuevo pedido
              </div>
              <button
                className="btn btn-muted btn-xs"
                type="button"
                onClick={cerrarModal}
                disabled={saving}
              >
                <span className="material-icons" style={{ fontSize: 16 }}>
                  close
                </span>
                Cerrar
              </button>
            </div>

            <form onSubmit={handleGuardar}>
              <div className="ped-modal-body">
                {formMsg && (
                  <div className={`notification ${formMsg.type}`}>
                    {formMsg.text}
                  </div>
                )}

                <div className="ped-grid" style={{ marginBottom: 8 }}>
                  <div>
                    <label htmlFor="ped-fecha">Fecha</label>
                    <input
                      id="ped-fecha"
                      className="input-field"
                      type="date"
                      value={form.fecha}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, fecha: e.target.value }))
                      }
                    />
                  </div>
                  <div>
                    <label htmlFor="ped-numero">Nº de orden</label>
                    <input
                      id="ped-numero"
                      className="input-field"
                      type="text"
                      placeholder="OR-123"
                      value={form.numero}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, numero: e.target.value }))
                      }
                    />
                  </div>
                </div>

                <div className="ped-grid" style={{ marginBottom: 8 }}>
                  <div>
                    <label htmlFor="ped-cliente">Cliente</label>
                    <input
                      id="ped-cliente"
                      className="input-field"
                      type="text"
                      placeholder="Nombre del cliente"
                      value={form.cliente}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, cliente: e.target.value }))
                      }
                    />
                  </div>
                  <div>
                    <label htmlFor="ped-total">Total</label>
                    <input
                      id="ped-total"
                      className="input-field"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      value={form.total}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, total: e.target.value }))
                      }
                    />
                  </div>
                </div>

                <div className="ped-row" style={{ marginBottom: 8 }}>
                  <div>
                    <label htmlFor="ped-estado">Estado</label>
                    <select
                      id="ped-estado"
                      className="select-field"
                      value={form.estado}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, estado: e.target.value }))
                      }
                    >
                      {ESTADOS.map((estado) => (
                        <option key={estado} value={estado}>
                          {estado}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="ped-grid">
                  <div>
                    <label htmlFor="ped-nota">Nota / Detalle</label>
                    <textarea
                      id="ped-nota"
                      className="input-field"
                      rows={3}
                      placeholder="Detalle del pedido"
                      value={form.nota}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, nota: e.target.value }))
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="ped-modal-footer">
                <button
                  className="btn btn-muted btn-xs"
                  type="button"
                  onClick={cerrarModal}
                  disabled={saving}
                >
                  Cancelar
                </button>
                <button className="btn btn-xs" type="submit" disabled={saving}>
                  <span className="material-icons" style={{ fontSize: 18 }}>
                    save
                  </span>
                  {saving ? "Guardando..." : "Guardar pedido"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
