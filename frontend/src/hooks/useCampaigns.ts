import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";
import type { Campaign, CreateCampaignInput } from "../types/campaign";

export function useCampaigns() {
  return useQuery({
    queryKey: ["campaigns"],
    queryFn: async () => {
      const res = await api.get<{ data: Campaign[] }>("/campaigns");
      return res.data.data;
    },
  });
}

export function useCampaign(id: string | undefined) {
  return useQuery({
    queryKey: ["campaigns", id],
    queryFn: async () => {
      const res = await api.get<{ data: Campaign }>(`/campaigns/${id}`);
      return res.data.data;
    },
    enabled: !!id,
  });
}

export function useCreateCampaign() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateCampaignInput) => {
      const res = await api.post<{ data: Campaign }>("/campaigns", input);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["campaigns"] });
    },
  });
}

export function useSyncCampaignSheet(campaignId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const res = await api.post<{ data: Campaign }>(`/campaigns/${campaignId}/sync-sheet`);
      return res.data.data;
    },
    onSuccess: (campaign) => {
      queryClient.setQueryData(["campaigns", campaignId], campaign);
      queryClient.invalidateQueries({ queryKey: ["campaigns"] });
    },
  });
}
