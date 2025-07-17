const { VITE_API_URL, VITE_API_TIMEOUT = 10000, VITE_API_VERSION = 'v1' } = import.meta.env;

export const API_BASE_URL = 'http://localhost:7961';

export const API_CONFIG = {
  BASE_URL: `${VITE_API_URL}`,
  TIMEOUT: VITE_API_TIMEOUT,
  HEADERS: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
};

export const API_ENDPOINTS = {
  MEMBER: {
    BASE: '/api/members',
    LOGIN: '/api/members/login',
    FIND: '/api/members/email',
    FINDID: '/api/members/id',
    FINDPWD: '/api/members/pwd',
    BIRTH: 'api/members/birth',
    INFO: 'api/members/info',
    UPDATEPROFILEIMAGE: '/api/members/profileImage',
    UPDATENAME: '/api/members/name',
    UPDATEBIRTH: '/api/members/birth',
    UPDATEPWD: '/api/members/pwd',
    DELETE: '/api/members/delete',
    RESETPASSWORD: '/api/members/resetPwd',
  },
  HEALTH: {
    BASE: '/api/healths',
    FINDDATE: '/api/healths/date',
  },
  PAYMENT: {
    BASE: '/api/payments',
    PAYMENT: '/api/payments/payment',
    DETAIL: (paymentId) => `/api/payments?paymentId=${paymentId}`,
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
    LIKE: '/api/board',
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
  NOTIFICATION: {
    UNREAD: '/api/notifications/unread/count',
  },
};
