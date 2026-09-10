import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesInsert } from "@/integrations/supabase/types";

export type Asset = Tables<"assets">;
export type Character = Tables<"characters">;
export type Campaign = Tables<"campaigns">;
export type Storyboard = Tables<"storyboards">;
export type Trend = Tables<"trends">;
export type Profile = Tables<"profiles">;

async function uid() {
  const { data } = await supabase.auth.getUser();
  if (!data.user) throw new Error("Not signed in");
  return data.user.id;
}

export function useProfile() {
  return useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const id = await uid();
      const { data, error } = await supabase.from("profiles").select("*").eq("id", id).maybeSingle();
      if (error) throw error;
      return data as Profile | null;
    },
  });
}

export function useUpdateProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (patch: Partial<Profile>) => {
      const id = await uid();
      const { error } = await supabase.from("profiles").update(patch).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["profile"] }),
  });
}

export function useAssets(filter?: { kind?: string; source?: string; limit?: number; search?: string }) {
  return useQuery({
    queryKey: ["assets", filter],
    queryFn: async () => {
      let q = supabase.from("assets").select("*").order("created_at", { ascending: false });
      if (filter?.kind) q = q.eq("kind", filter.kind);
      if (filter?.source) q = q.eq("source", filter.source);
      if (filter?.search) q = q.ilike("prompt", `%${filter.search}%`);
      if (filter?.limit) q = q.limit(filter.limit);
      const { data, error } = await q;
      if (error) throw error;
      return (data ?? []) as Asset[];
    },
  });
}

export function useAsset(id: string) {
  return useQuery({
    queryKey: ["asset", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("assets").select("*").eq("id", id).maybeSingle();
      if (error) throw error;
      return data as Asset | null;
    },
  });
}

export function useAssetVersions(rootId: string | null | undefined) {
  return useQuery({
    enabled: !!rootId,
    queryKey: ["asset-versions", rootId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("assets")
        .select("*")
        .eq("parent_id", rootId!)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return (data ?? []) as Asset[];
    },
  });
}

export function useCreateAssets() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (rows: Omit<TablesInsert<"assets">, "user_id">[]) => {
      const user_id = await uid();
      const { data, error } = await supabase
        .from("assets")
        .insert(rows.map((r) => ({ ...r, user_id })))
        .select();
      if (error) throw error;
      return (data ?? []) as Asset[];
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["assets"] });
      qc.invalidateQueries({ queryKey: ["asset-versions"] });
    },
  });
}

export function useDeleteAsset() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("assets").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["assets"] }),
  });
}

export function useCharacters() {
  return useQuery({
    queryKey: ["characters"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("characters")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Character[];
    },
  });
}

export function useSaveCharacter() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (row: Omit<TablesInsert<"characters">, "user_id">) => {
      const user_id = await uid();
      const { error } = await supabase.from("characters").insert({ ...row, user_id });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["characters"] }),
  });
}

export function useDeleteCharacter() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("characters").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["characters"] }),
  });
}

export function useCampaigns() {
  return useQuery({
    queryKey: ["campaigns"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("campaigns")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Campaign[];
    },
  });
}

export function useCampaignAssets(campaignId: string | null) {
  return useQuery({
    enabled: !!campaignId,
    queryKey: ["campaign-assets", campaignId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("assets")
        .select("*")
        .eq("campaign_id", campaignId!)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return (data ?? []) as Asset[];
    },
  });
}

export function useStoryboards() {
  return useQuery({
    queryKey: ["storyboards"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("storyboards")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Storyboard[];
    },
  });
}

export function useTrends() {
  return useQuery({
    queryKey: ["trends"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("trends")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Trend[];
    },
  });
}

export async function spendCredits(amount: number) {
  const id = await uid();
  const { data } = await supabase.from("profiles").select("credits").eq("id", id).maybeSingle();
  const current = data?.credits ?? 0;
  await supabase.from("profiles").update({ credits: Math.max(0, current - amount) }).eq("id", id);
}
