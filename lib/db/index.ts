import "server-only";
import { hasSupabase, isProd } from "@/lib/env";
import { localStore } from "./local";
import { supabaseStore } from "./supabase";

if (isProd && !hasSupabase && process.env.NEXT_PHASE !== "phase-production-build") {
  console.warn("[db] SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY are not set. Using the local file store, which is not suitable for production.");
}

export const store = hasSupabase ? supabaseStore : localStore;
export type { Order, OrderItem, OrderStatus } from "./types";
