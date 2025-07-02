const { VITE_API_URL, VITE_API_TIMEOUT = 5000, VITE_API_VERSION = 'v1' } = import.meta.env;

export const API_BASE_URL = 'http://localhost:7961';

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
    BIRTH: 'api/members/birth',
    INFO: 'api/members/info',
    UPDATEPROFILEIMAGE: '/api/members/profileImage',
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
    LIST: '/api/payments/list',
    TRAINERLIST: '/api/payments/trainerlist',
    RESERVATION: '/api/payments/reservation',
    SALARY: '/api/payments/salary',
    APPROVED: '/api/payments/approve',
    REJECT: '/api/payments/reject',
  },
  REVIEW: {
    CREATE: '/api/review',
    SELECT: '/api/review/',
    MYREVIEW: '/api/review/my',
    FIND: '/api/review/exsists/',
    DELETE: '/api/review/delete/',
  },
  BOARD: {
    ALL: 'api/board/all',
    CREATE: '/api/board',
    DETAIL: '/api/board',
    UPDATE: '/api/board',
    DELETE: '/api/board/delete',
    MYPOSTS: '/api/board/myposts',
  },
  NOTICE: {
    LIST: '/api/notice/all',
    DETAIL: '/api/notice',
    CREATE: '/api/notice',
    UPDATE: '/api/notice',
    DELETE: '/api/notice/delete',
  },
  COMMENT: {
    ALL: 'api/comment',
    CREATE: '/api/comment',
    DELETE: '/api/comment',
    MYCOMMENTS: '/api/comment/mycomments',
  },
  COACH: {
    LIST: '/api/trainer',
  },
};
