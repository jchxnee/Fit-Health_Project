import api from './axios';

export const reservationService = {
  createReservation: async ({ paymentId, selectDate }) => {
    try {
      const { data } = await api.put('/api/payments/payment', {
        payment_id: paymentId,
        select_date: selectDate,
      });
      return data;
    } catch (error) {
      throw new Error(error.response?.data?.message || '예약에 실패했습니다.');
    }
  },
}; 