import apiClient from './axios';

// 개인 채팅방 생성 (상대방 이메일)
export const startPrivateChat = async (otherMemberEmail) => {
  try {
    // 백엔드에서 @RequestParam("otherMemberEmail") String otherMemberEmail 사용
    const response = await apiClient.post(`/chat/room?otherMemberEmail=${encodeURIComponent(otherMemberEmail)}`);
    return response.data; // roomId 반환
  } catch (error) {
    console.error('개인 채팅 시작 실패:', error);
    throw error;
  }
};

// 나의 채팅방 목록 조회
export const getMyChatRooms = async () => {
  try {
    const response = await apiClient.get('/chat/my/rooms');
    // 항상 배열 반환
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error('나의 채팅방 목록 조회 실패:', error);
    return [];
  }
};

// 채팅 히스토리 조회
export const getChatHistory = async (roomId) => {
  try {
    const response = await apiClient.get(`/chat/history/${roomId}`);
    // 항상 배열 반환
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error('채팅 히스토리 로드 실패:', error);
    return [];
  }
};

// 채팅방 읽음 처리
export const readChatRoom = async (roomId) => {
  try {
    await apiClient.post(`/chat/room/${roomId}/read`);
  } catch (error) {
    console.error('읽음 처리 실패:', error);
    throw error;
  }
};
