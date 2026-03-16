import api from "@/lib/axios";

export const favoriteService = {
  getFavorites: async () => {
    const response = await api.get("/favorites");
    return response.data;
  },
  addFavorite: async (eventId: string | number) => {
    const response = await api.post(`/favorites/${eventId}`);
    return response.data;
  },
  removeFavorite: async (eventId: string | number) => {
    const response = await api.delete(`/favorites/${eventId}`);
    return response.data;
  },
};
