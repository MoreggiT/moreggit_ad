// src/api/adminApi.js
import { supabase } from "../supabaseClient";

/**
 * Obtiene el resumen de administración:
 *  - ingresos/egresos en UYU y USD
 *  - caja (ingresos - egresos)
 *
 * Devuelve:
 * {
 *   ingresos: { UYU, USD },
 *   egresos:  { UYU, USD },
 *   caja:     { UYU, USD }
 * }
 */
export async function fetchAdminResumen() {
  const { data, error } = await supabase
    .from("admin_movimientos")
    .select("*");

  if (error) {
    console.error("[fetchAdminResumen] Error", error);
    throw error;
  }

  let ingUYU = 0;
  let ingUSD = 0;
  let egrUYU = 0;
  let egrUSD = 0;

  (data || []).forEach((row) => {
    const monto = Number(row.monto || 0);
    if (!monto) return;
    const isIngreso = row.tipo === "ingreso";
    const isUYU = row.moneda === "UYU";
    const isUSD = row.moneda === "USD";

    if (isIngreso && isUYU) ingUYU += monto;
    if (isIngreso && isUSD) ingUSD += monto;
    if (!isIngreso && isUYU) egrUYU += monto;
    if (!isIngreso && isUSD) egrUSD += monto;
  });

  const cjUYU = ingUYU - egrUYU;
  const cjUSD = ingUSD - egrUSD;

  return {
    ingresos: { UYU: ingUYU, USD: ingUSD },
    egresos: { UYU: egrUYU, USD: egrUSD },
    caja: { UYU: cjUYU, USD: cjUSD },
  };
}

/**
 * Lista los movimientos de administración, ordenados por fecha (desc).
 *
 * Cada item:
 * {
 *   id, fecha (string YYYY-MM-DD),
 *   moneda, tipo, monto,
 *   orden, descripcion, created_at
 * }
 */
export async function fetchAdminMovimientos() {
  const { data, error } = await supabase
    .from("admin_movimientos")
    .select("*")
    .order("fecha", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[fetchAdminMovimientos] Error", error);
    throw error;
  }

  return data || [];
}

/**
 * Crea un nuevo movimiento de administración.
 *
 * payload esperado:
 * {
 *   fecha: "2025-11-22",  // formato date
 *   monto: number,
 *   moneda: "UYU" | "USD",
 *   tipo: "ingreso" | "egreso",
 *   orden?: string,
 *   descripcion?: string
 * }
 */
export async function createAdminMovimiento(payload) {
  const { fecha, monto, moneda, tipo, orden, descripcion } = payload;

  if (!fecha) throw new Error("Fecha requerida");
  if (!monto || Number(monto) <= 0) throw new Error("Monto inválido");
  if (!["UYU", "USD"].includes(moneda)) throw new Error("Moneda inválida");
  if (!["ingreso", "egreso"].includes(tipo)) throw new Error("Tipo inválido");

  const { data, error } = await supabase
    .from("admin_movimientos")
    .insert([
      {
        fecha,
        monto,
        moneda,
        tipo,
        orden: orden || null,
        descripcion: descripcion || null,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("[createAdminMovimiento] Error", error);
    throw error;
  }

  return data;
}

/* ===========================
 * PAGOS POR ORDEN (Facturación)
 * =========================== */

/**
 * Obtiene todos los pagos de una orden específica.
 *
 * @param {string} orden Ejemplo: "OR-123"
 */
export async function fetchPagosPorOrden(orden) {
  if (!orden) throw new Error("Orden requerida");

  const { data, error } = await supabase
    .from("pagos_orden")
    .select("*")
    .eq("orden", orden)
    .order("fecha", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    console.error("[fetchPagosPorOrden] Error", error);
    throw error;
  }

  return data || [];
}

/**
 * Crea un pago asociado a una orden.
 *
 * payload esperado:
 * {
 *   orden: "OR-123",
 *   fecha: "2025-11-22",
 *   monto: number,
 *   moneda: "UYU" | "USD",
 *   tipo: "ingreso" | "egreso",
 *   descripcion?: string
 * }
 */
export async function createPagoOrden(payload) {
  const { orden, fecha, monto, moneda, tipo, descripcion } = payload;

  if (!orden) throw new Error("Orden requerida");
  if (!fecha) throw new Error("Fecha requerida");
  if (!monto || Number(monto) <= 0) throw new Error("Monto inválido");
  if (!["UYU", "USD"].includes(moneda)) throw new Error("Moneda inválida");
  if (!["ingreso", "egreso"].includes(tipo)) throw new Error("Tipo inválido");

  const { data, error } = await supabase
    .from("pagos_orden")
    .insert([
      {
        orden,
        fecha,
        monto,
        moneda,
        tipo,
        descripcion: descripcion || null,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("[createPagoOrden] Error", error);
    throw error;
  }

  return data;
}
