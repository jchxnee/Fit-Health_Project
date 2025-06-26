import api from './axios';
import { API_ENDPOINTS } from './config';

export const paymentService = {
  //결제 생성(신청)
  insertPayment: async (requestData) => {
    try {
      const { data } = await api.post(API_ENDPOINTS.PAYMENT.BASE, {
        user_email: requestData.userEmail,
        trainer_email: requestData.trainerEmail,
        product_price: requestData.totalPrice,
        product_name: requestData.productName,
        total_count: requestData.totalCount,
        first_reservation: requestData.firstReservation,
      });

      return data;
    } catch (error) {
      if (error.response) {
        const message = error.response?.data?.message || '신청에 실패했습니다.';
        throw new Error(message);
      }

      throw new Error('서버 통신 불량');
    }
  },

  //결제 정보 조회
  getPaymentData: async (paymentId) => {
    try {
      const { data } = await api.get(API_ENDPOINTS.PAYMENT.BASE, {
        params: {
          paymentId: paymentId,
        },
      });

      return data;
    } catch (error) {
      const message = error.response?.data?.message || '결제 정보 조회에 실패했습니다.';
      throw new Error(message);
    }
  },

  //결제 진행
  goPayment: async (paymentId, firstReservation) => {
    console.log(paymentId);
    console.log(firstReservation);
    try {
      const { data } = await api.put(API_ENDPOINTS.PAYMENT.PAYMENT, {
        payment_id: paymentId,
        select_date: firstReservation,
      });

      return data;
    } catch (error) {
      const message = error.response?.data?.message || '결제 하는데 실패했습니다.';
      throw new Error(message);
    }
  },

  //진행된 레슨 회차 정보 조회
  getReservationData: async (paymentId) => {
    try {
      const { data } = await api.get(API_ENDPOINTS.PAYMENT.RESERVATION, {
        params: {
          paymentId: paymentId,
        },
      });

      return data;
    } catch (error) {
      const message = error.response?.data?.message || '결제 정보 조회에 실패했습니다.';
      throw new Error(message);
    }
  },

  //환불 진행
  goRefund: async (paymentId, refundPrice, refundFee) => {
    try {
      const { data } = await api.put(API_ENDPOINTS.PAYMENT.REFUND, {
        payment_id: paymentId,
        refund_price: refundPrice,
        refund_fee: refundFee,
      });
      return data;
    } catch (error) {
      const message = error.response?.data?.message || '환불 하는데 실패했습니다.';
      throw new Error(message);
    }
  },

  //정산 신청 진행
  goSalary: async (paymentId, salaryPrice, salaryFee) => {
    try {
      const { data } = await api.put(API_ENDPOINTS.PAYMENT.SALARY, {
        payment_id: paymentId,
        salary_price: salaryPrice,
        salary_fee: salaryFee,
      });
      return data;
    } catch (error) {
      const message = error.response?.data?.message || '환불 하는데 실패했습니다.';
      throw new Error(message);
    }
  },
};
