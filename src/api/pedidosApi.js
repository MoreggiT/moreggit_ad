import { supabase } from "../supabaseClient";

// --- LECTURA ---

// Obtener todas las órdenes para el Panel (Card view)
export async function fetchOrdenes() {
  const { data, error } = await supabase
    .from("orden_facturacion_meta")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

// Obtener las líneas (camisetas, etc.) de una orden específica
export async function fetchLineasOrden(ordenId) {
  const { data, error } = await supabase
    .from("orden_facturacion_lineas")
    .select("*")
    .eq("orden_id", ordenId)
    .order("id", { ascending: true });

  if (error) throw error;
  return data || [];
}

// --- ESCRITURA (Crear / Editar) ---

// Guardar (Upsert) la cabecera de la orden (Cliente, estado, total)
export async function saveOrdenMeta(orden) {
  // Si tiene ID, actualiza. Si no, crea.
  const { data, error } = await supabase
    .from("orden_facturacion_meta")
    .upsert(orden)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Guardar líneas (borrar anteriores y crear nuevas, o upsert inteligente)
// Para simplificar, haremos un estrategia simple: Upsert individual
export async function saveOrdenLineas(lineas) {
  if (!lineas || lineas.length === 0) return;
  
  // Eliminamos propiedades temporales de frontend si las hay
  const cleanLineas = lineas.map(l => {
    const { tempId, ...rest } = l; 
    return rest;
  });

  const { data, error } = await supabase
    .from("orden_facturacion_lineas")
    .upsert(cleanLineas)
    .select();

  if (error) throw error;
  return data;
}

// Eliminar una línea específica
export async function deleteLinea(id) {
  const { error } = await supabase
    .from("orden_facturacion_lineas")
    .delete()
    .eq("id", id);
  if (error) throw error;
}