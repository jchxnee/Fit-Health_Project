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
  goPayment: async (createDto) => {
    // <-- 단일 객체 인자로 변경!
    console.log('프론트에서 백엔드로 보낼 요청 본문:', createDto); // 디버깅을 위해 추가
    try {
      // api.put의 두 번째 인자로 createDto 객체 전체를 직접 전달합니다.
      const { data } = await api.put(API_ENDPOINTS.PAYMENT.PAYMENT, createDto); // <-- 여기가 핵심 수정!

      return data;
    } catch (error) {
      console.error('API 에러 :', error.response ? error.response.data : error.message); // 에러 로그 강화
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
