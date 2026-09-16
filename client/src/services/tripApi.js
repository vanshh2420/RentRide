import api from './api';

export const tripApi = {
  sendTelemetry: async (bookingId, payload) => {
    return await api.post(`/trips/${bookingId}/telemetry`, payload);
  },

  getLiveTripState: async (bookingId) => {
    return await api.get(`/trips/${bookingId}/live`);
  }
};
