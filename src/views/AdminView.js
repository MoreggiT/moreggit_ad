// src/views/AdminView.js
import React, { useEffect, useState } from "react";
import "../styles/admin.css";
import {
  fetchAdminResumen,
  fetchAdminMovimientos,
  createAdminMovimiento,
} from "../api/adminApi";

const nfUYU = new Intl.NumberFormat("es-UY", {
  style: "currency",
  currency: "UYU",
  minimumFractionDigits: 2,
});
const nfUSD = new Intl.NumberFormat("es-UY", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
});

function formatMoney(monto, moneda) {
  const n = Number(monto || 0);
  if (moneda === "USD") return nfUSD.format(n);
  return nfUYU.format(n).replace("UYU", "$");
}

function toDDMMYYYY(value) {
  if (!value) return "";
  // Si ya viene en formato dd/mm/yyyy
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

export default function AdminView() {
  // Estado KPIs y movimientos
  const [resumen, setResumen] = useState(null);
  const [movimientos, setMovimientos] = useState([]);
  const [loading, setLoading] = useState(false);

  // Modal / formulario
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    fecha: "",
    monto: "",
    moneda: "UYU",
    tipo: "ingreso",
    orden: "",
    descripcion: "",
  });

  // Notificaciones
  const [bannerMsg, setBannerMsg] = useState(null); // {type,text}
  const [formMsg, setFormMsg] = useState(null); // {type,text}

  // Helpers de notificación
  function showBanner(text, type = "info") {
    setBannerMsg({ text, type });
    setTimeout(() => setBannerMsg(null), 3200);
  }

  function showFormMsg(text, type = "error") {
    setFormMsg({ text, type });
    setTimeout(() => setFormMsg(null), 3200);
  }

  async function cargarTodo() {
    setLoading(true);
    try {
      const [r, rows] = await Promise.all([
        fetchAdminResumen(),
        fetchAdminMovimientos(),
      ]);
      setResumen(r);
      setMovimientos(rows || []);
    } catch (err) {
      console.error(err);
      showBanner("No se pudieron cargar los datos de administración.", "error");
    } finally {
      setLoading(false);
    }
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    // setear fecha por defecto para el form
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    setForm((prev) => ({
      ...prev,
      fecha: `${yyyy}-${mm}-${dd}`,
    }));

    cargarTodo();
  }, []);

  function abrirModal() {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");

    setForm({
      fecha: `${yyyy}-${mm}-${dd}`,
      monto: "",
      moneda: "UYU",
      tipo: "ingreso",
      orden: "",
      descripcion: "",
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
    const montoNumber = parseFloat(form.monto);

    if (!form.fecha) {
      showFormMsg("Ingresá una fecha válida.", "error");
      return;
    }
    if (!Number.isFinite(montoNumber) || montoNumber <= 0) {
      showFormMsg("Ingresá un monto válido.", "error");
      return;
    }

    try {
      setSaving(true);
      await createAdminMovimiento({
        fecha: form.fecha,
        monto: montoNumber,
        moneda: form.moneda,
        tipo: form.tipo,
        orden: form.orden || null,
        descripcion: form.descripcion || null,
      });

      showBanner("Movimiento guardado.", "success");
      setModalOpen(false);
      await cargarTodo();
    } catch (err) {
      console.error(err);
      showFormMsg(
        "No se pudo guardar el movimiento: " +
          (err?.message || "error desconocido"),
        "error"
      );
    } finally {
      setSaving(false);
    }
  }

  // KPIs seguros
  const ingUYU = resumen?.ingresos?.UYU || 0;
  const ingUSD = resumen?.ingresos?.USD || 0;
  const egrUYU = resumen?.egresos?.UYU || 0;
  const egrUSD = resumen?.egresos?.USD || 0;
  const cajaUYU = resumen?.caja?.UYU || 0;
  const cajaUSD = resumen?.caja?.USD || 0;

  return (
    <div id="admin-root">
      {/* Card de administración (KPIs + Toolbar) */}
      <div className="admin-card">
        <div className="admin-header">
          <div className="admin-title">Administración</div>
          <div className="admin-toolbar">
            <button
              type="button"
              className="btn btn-outline btn-xs"
              onClick={cargarTodo}
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
              Ingresar pago
            </button>
          </div>
        </div>

        {bannerMsg && (
          <div className={`notification ${bannerMsg.type}`}>
            {bannerMsg.text}
          </div>
        )}

        <div className="kpis" aria-live="polite">
          <div className="kpi">
            <div className="label">Ingreso $</div>
            <div
              className={
                "value num " + (ingUYU > 0 ? "pos" : ingUYU < 0 ? "neg" : "")
              }
            >
              {formatMoney(ingUYU, "UYU")}
            </div>
          </div>
          <div className="kpi">
            <div className="label">Ingreso USD</div>
            <div
              className={
                "value num " + (ingUSD > 0 ? "pos" : ingUSD < 0 ? "neg" : "")
              }
            >
              {formatMoney(ingUSD, "USD")}
            </div>
          </div>
          <div className="kpi">
            <div className="label">Egreso $</div>
            <div
              className={
                "value num " + (egrUYU > 0 ? "neg" : egrUYU < 0 ? "pos" : "")
              }
            >
              {formatMoney(egrUYU, "UYU")}
            </div>
          </div>
          <div className="kpi">
            <div className="label">Egreso USD</div>
            <div
              className={
                "value num " + (egrUSD > 0 ? "neg" : egrUSD < 0 ? "pos" : "")
              }
            >
              {formatMoney(egrUSD, "USD")}
            </div>
          </div>
          <div className="kpi">
            <div className="label">Caja $</div>
            <div
              className={
                "value num " +
                (cajaUYU > 0 ? "pos" : cajaUYU < 0 ? "neg" : "")
              }
            >
              {formatMoney(cajaUYU, "UYU")}
            </div>
          </div>
          <div className="kpi">
            <div className="label">Caja USD</div>
            <div
              className={
                "value num " +
                (cajaUSD > 0 ? "pos" : cajaUSD < 0 ? "neg" : "")
              }
            >
              {formatMoney(cajaUSD, "USD")}
            </div>
          </div>
        </div>
      </div>

      {/* Card de registros */}
      <div className="admin-card">
        <h2 className="form-title" style={{ margin: "0 0 10px" }}>
          Registros
        </h2>

        {loading && (
          <div className="muted" style={{ marginBottom: 8 }}>
            Cargando movimientos...
          </div>
        )}

        <div id="admin-cards" className="cards-wrap">
          {!loading && movimientos.length === 0 && (
            <div
              id="admin-empty"
              className="muted"
              style={{ display: "block" }}
            >
              No hay movimientos cargados aún.
            </div>
          )}

          {movimientos.map((mov) => {
            const isIngreso = mov.tipo === "ingreso";
            return (
              <div key={mov.id} className="mov-card">
                <div className="mov-title">
                  <div>Movimiento</div>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    <span className={"pill " + (isIngreso ? "ing" : "egr")}>
                      {isIngreso ? "Ingreso" : "Egreso"}
                    </span>
                    <span className="pill">
                      {mov.moneda === "USD" ? "USD" : "$ UYU"}
                    </span>
                  </div>
                </div>

                <div className="mov-data">
                  <div className="cell">
                    <div className="lbl">Fecha</div>
                    <div className="val">{toDDMMYYYY(mov.fecha)}</div>
                  </div>

                  <div className="cell">
                    <div className="lbl">Monto</div>
                    <div
                      className={
                        "val amt " + (isIngreso ? "pos" : "neg")
                      }
                    >
                      {formatMoney(mov.monto, mov.moneda)}
                    </div>
                  </div>

                  {mov.orden && mov.orden.trim() && (
                    <div className="cell">
                      <div className="lbl">Orden</div>
                      <div className="val">{mov.orden}</div>
                    </div>
                  )}

                  {mov.descripcion && mov.descripcion.trim() && (
                    <div className="cell">
                      <div className="lbl">Descripción</div>
                      <div className="val">{mov.descripcion}</div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal Ingresar pago */}
      {modalOpen && (
        <div
          className="admin-modal-backdrop"
          aria-hidden="false"
          onClick={cerrarModal}
        >
          <div
            className="admin-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="admin-modal-title"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="admin-modal-header">
              <div className="admin-modal-title" id="admin-modal-title">
                Ingresar pago
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
              <div className="admin-modal-body">
                {formMsg && (
                  <div className={`notification ${formMsg.type}`}>
                    {formMsg.text}
                  </div>
                )}

                <div className="admin-grid" style={{ marginBottom: 8 }}>
                  <div>
                    <label htmlFor="adm-fecha">Fecha</label>
                    <input
                      id="adm-fecha"
                      className="input-field"
                      type="date"
                      value={form.fecha}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, fecha: e.target.value }))
                      }
                    />
                  </div>
                  <div>
                    <label htmlFor="adm-monto">Monto</label>
                    <input
                      id="adm-monto"
                      className="input-field"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      value={form.monto}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, monto: e.target.value }))
                      }
                    />
                  </div>
                </div>

                <div className="admin-row" style={{ marginBottom: 8 }}>
                  <div>
                    <label htmlFor="adm-moneda">Moneda</label>
                    <select
                      id="adm-moneda"
                      className="select-field"
                      value={form.moneda}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, moneda: e.target.value }))
                      }
                    >
                      <option value="UYU">$ (UYU)</option>
                      <option value="USD">USD</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="adm-tipo">Tipo de movimiento</label>
                    <select
                      id="adm-tipo"
                      className="select-field"
                      value={form.tipo}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, tipo: e.target.value }))
                      }
                    >
                      <option value="ingreso">Ingreso</option>
                      <option value="egreso">Egreso</option>
                    </select>
                  </div>
                </div>

                <div className="admin-grid">
                  <div>
                    <label htmlFor="adm-orden">Orden vinculada</label>
                    <input
                      id="adm-orden"
                      className="input-field"
                      type="text"
                      placeholder="OR-123"
                      value={form.orden}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, orden: e.target.value }))
                      }
                    />
                  </div>
                  <div>
                    <label htmlFor="adm-desc">Descripción</label>
                    <input
                      id="adm-desc"
                      className="input-field"
                      type="text"
                      placeholder="Detalle del pago"
                      value={form.descripcion}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          descripcion: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="admin-modal-footer">
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
                  {saving ? "Guardando..." : "Guardar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
