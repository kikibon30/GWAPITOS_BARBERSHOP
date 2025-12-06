// services/dashboardService.js
export const dashboardService = {
  getBarberProfile: async (barberId) => {
    try {
      const response = await api.get(`/api/barbers/${barberId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getShopBarbers: async (shopId) => {
    try {
      const response = await api.get(`/api/shops/${shopId}/barbers`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};