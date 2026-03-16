import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { favoriteService } from "./services";
import { useAuth } from "@/app/providers/auth-provider";

export const useFavorites = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ["favorites"],
    queryFn: favoriteService.getFavorites,
    enabled: !!user,
  });
};

export const useAddFavorite = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: favoriteService.addFavorite,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
  });
};

export const useRemoveFavorite = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: favoriteService.removeFavorite,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
  });
};
