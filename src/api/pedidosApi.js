// src/api/pedidosApi.js
import { supabase } from "./supabaseClient";

/**
 * Tabla: pedidos
 * Campos recomendados en Supabase:
 *  id         : uuid (PK, default uuid_generate_v4())
 *  numero     : text
 *  cliente    : text
 *  fecha      : date
 *  total      : numeric
 *  estado     : text
 *  nota       : text
 *  created_at : timestamptz (default now())
 */

// Traer todos los pedidos (más recientes primero)
export async function fetchPedidos() {
  const { data, error } = await supabase
    .from("pedidos")
    .select("*")
    .order("fecha", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

// Crear un nuevo pedido
export async function createPedido(pedido) {
  const { data, error } = await supabase
    .from("pedidos")
    .insert([pedido])
    .select()
    .single();

  if (error) throw error;
  return data;
}
