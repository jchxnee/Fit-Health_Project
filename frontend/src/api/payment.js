import api from './axios';
import { API_ENDPOINTS } from './config';

export const paymentService = {
  //결제 정보 조회
  getPaymentData: async (useremail) => {
    try {
      const { data } = await api.get(API_ENDPOINTS.PAYMENT.BASE, {
        params: {
          userEmail: useremail,
        },
      });

      return data;
    } catch (error) {
      const message = error.response?.data?.message || '결제 정보 조회에 실패했습니다.';
      throw new Error(message);
    }
  },

  //결제 진행
  goPayment: async (paymentId) => {
    try {
      const { data } = await api.put(API_ENDPOINTS.PAYMENT.PAYMENT, null, {
        params: {
          paymentId: paymentId,
        },
      });

      return data;
    } catch (error) {
      const message = error.response?.data?.message || '결제 하는데 실패했습니다.';
      throw new Error(message);
    }
  },
};
