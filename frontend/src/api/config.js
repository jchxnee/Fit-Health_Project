const { VITE_API_URL, VITE_API_TIMEOUT = 5000, VITE_API_VERSION = 'v1' } = import.meta.env;

export const API_CONFIG = {
  // BASE_URL: `${VITE_API_URL}/${VITE_API_VERSION}`, localhost:8001/api/v1
  BASE_URL: `${VITE_API_URL}`,
  TIMEOUT: VITE_API_TIMEOUT,
  HEADERS: {
    'Content-Type': 'application/json', //내가 서버로 보내는 데이터는 json이야
    Accept: 'application/json', //json으로 응답해줘.
  },
};

export const API_ENDPOINTS = {
  MEMBER: {
    BASE: '/api/members',
    LOGIN: '/api/members/login',
    FIND: '/api/members/email',
    UPDATENAME: '/api/members/name',
    UPDATEBIRTH: '/api/members/birth',
    UPDATEPWD: '/api/members/pwd',
    DELETE: '/api/members/delete',
  },
  HEALTH: {
    BASE: '/api/healths',
    FINDDATE: '/api/healths/date',
  },
  PAYMENT: {
    BASE: '/api/payments',
    PAYMENT: '/api/payments/payment',
    REFUND: '/api/payments/refund',
  },
  REVIEW: {
    CREATE: '/api/review',
    SELECT: '/api/review/',
  },
  BOARD: {
    ALL: 'api/board/all',
    CREATE: '/api/board',
    DETAIL: '/api/board',
  },
  COMMENT: {
    ALL: 'api/comment',
    CREATE: '/api/comment',
  },
};
