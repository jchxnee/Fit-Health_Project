import React, { useState, useMemo } from 'react'; // useMemo 임포트 추가
import styled, { keyframes, css } from 'styled-components';
import TitleBar from '../../components/TitleBar';
import CustomCategoryMenu from '../../components/CustomCategoryMenu';
import Pagination from '../../components/Pagination'; // Pagination 컴포넌트 임포트
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

// 더미 데이터 (기존 데이터 그대로 사용)
const faqData = [
  {
    id: 1,
    category: '환불',
    question: '환불은 어디서 해야 하나요?',
    answer: '마이페이지 > 신청내역에서 환불 신청 가능합니다. 단, 이용권을 결제한 후 코치가 승인하기 전까지 가능합니다.',
  },
  {
    id: 2,
    category: '매칭',
    question: '매칭 신청은 어떻게 하나요?',
    answer: '매칭 서비스는 홈 화면에서 신청할 수 있습니다. 자세한 내용은 도움말을 참조해주세요.',
  },
  {
    id: 3,
    category: '회원 관리',
    question: '회원정보를 변경하고 싶어요.',
    answer: '마이페이지 > 회원정보 수정에서 변경 가능합니다.',
  },
  {
    id: 4,
    category: '환불',
    question: '환불은 얼마나 걸리나요?',
    answer: '환불은 신청일로부터 영업일 기준 3~5일 소요됩니다.',
  },
  {
    id: 5,
    category: '환불',
    question: '부분 환불도 가능한가요?',
    answer: '네, 서비스 이용 약관에 따라 부분 환불이 가능합니다. 고객센터로 문의해주세요.',
  },
  {
    id: 6,
    category: '회원 관리',
    question: '비밀번호를 잊어버렸어요.',
    answer: '로그인 페이지에서 "비밀번호 찾기"를 통해 재설정할 수 있습니다.',
  },
  {
    id: 7,
    category: '매칭',
    question: '여러 코치와 매칭 신청이 가능한가요?',
    answer: '동시 시간대에 여러 코치와 매칭 신청은 불가능하며, 한 번에 한 명의 코치와만 매칭할 수 있습니다.',
  },
  {
    id: 8,
    category: '회원 관리',
    question: '계정을 삭제하고 싶어요.',
    answer: '마이페이지 > 회원 탈퇴 메뉴에서 계정 삭제가 가능합니다. 탈퇴 전 안내사항을 꼭 확인해주세요.',
  },
  {
    id: 9,
    category: '매칭',
    question: '매칭에 실패하면 어떻게 되나요?',
    answer: '매칭 실패 시, 신청 내역이 자동으로 취소되며, 다시 매칭을 시도할 수 있습니다.',
  },
  {
    id: 10,
    category: '이용 문의', // '서비스 이용' 통합
    question: '운동 프로그램은 어떻게 선택하나요?',
    answer: '개인의 목표와 건강 상태에 맞춰 다양한 운동 프로그램을 선택할 수 있습니다.',
  },
  {
    id: 11,
    category: '코치/상담',
    question: '코치와 상담은 어떻게 진행되나요?',
    answer:
      '매칭된 코치와는 앱 내 채팅 기능을 통해 실시간으로 상담할 수 있습니다. 아직 매칭되지 않은 코치일 경우, 코치 프로필에 공개된 카카오톡 아이디나 인스타그램으로 개별 연락이 가능합니다.',
  },
  {
    id: 12,
    category: '이용 문의', // '서비스 이용' 통합
    question: '후기(피드백)는 어떻게 남길 수 있나요?',
    answer:
      '서비스 이용 후 코치나 프로그램에 대한 피드백은 "이용 내역"에서 해당 세션 선택 후 남길 수 있습니다. 여러분의 소중한 의견은 더 나은 서비스 제공에 큰 도움이 됩니다.',
  },
  {
    id: 13,
    category: '매칭',
    question: '제가 원하는 코치를 직접 선택할 수 있나요?',
    answer:
      '네, 매칭 신청 시 코치 프로필을 확인하고 직접 선택할 수 있습니다. 각 코치의 전문 분야, 경력, 리뷰 등을 참고하여 자신에게 맞는 코치를 찾아보세요.',
  },
  {
    id: 14,
    category: '이용 문의', // '서비스 이용' 통합
    question: '운동 기구나 장비가 없어도 괜찮나요?',
    answer:
      '네, 맨몸 운동이나 최소한의 장비로 진행 가능한 프로그램도 많습니다. 코치와 상담하여 현재 가지고 있는 장비나 환경에 맞는 운동 계획을 세울 수 있습니다.',
  },
  {
    id: 15,
    category: '이용 문의', // '서비스 이용' 통합
    question: '식이 관리는 어떻게 받나요?',
    answer:
      '코치와의 상담을 통해 개인의 목표와 식습관에 맞는 맞춤형 식단 가이드를 제공받을 수 있습니다. 식단 기록 및 피드백을 통해 효율적인 관리가 가능합니다.',
  },
  {
    id: 16,
    category: '안전/정책', // '안전/응급' 통합
    question: '운동 중 부상을 입으면 어떻게 해야 하나요?',
    answer:
      '운동 중 불편함이나 통증을 느끼시면 즉시 운동을 중단하고 코치에게 알려주세요. 필요한 경우 의료 전문가의 도움을 받는 것을 권장합니다.',
  },
  {
    id: 17,
    category: '이용 문의', // '기술/오류' 통합
    question: '서비스 이용 중 기술적인 문제가 발생하면 어떻게 하죠?',
    answer:
      '웹 사용 중 오류나 기술적인 문제가 발생하면 고객센터로 문의해주세요. 문제 해결을 위해 신속하게 도와드리겠습니다.',
  },
  {
    id: 18,
    category: '커뮤니티',
    question: '다른 사용자들의 운동 후기를 볼 수 있나요?',
    answer: '네, 각 코치 프로필 페이지나 "커뮤니티" 메뉴에서 다른 사용자들의 운동 후기와 경험담을 확인할 수 있습니다.',
  },
  {
    id: 19,
    category: '안전/정책', // '개인정보' 통합
    question: '개인 정보는 안전하게 보호되나요?',
    answer:
      '네, FIT-HEALTH는 사용자 개인 정보를 최우선으로 보호합니다. 개인정보처리방침에 따라 모든 정보는 암호화되며, 동의 없이 제3자에게 제공되지 않습니다. 자세한 내용은 개인정보처리방침을 확인해주세요.',
  },
  {
    id: 20,
    category: '이용 문의', // '서비스 이용' 통합
    question: '운동 목표를 달성하지 못하면 어떻게 되나요?',
    answer:
      '운동 목표 달성이 어렵다고 느껴지시면 코치와 솔직하게 상담해주세요. 목표를 재설정하거나, 프로그램 조정 등 맞춤형 솔루션을 통해 다시 동기를 부여하고 목표 달성을 도울 수 있습니다.',
  },
  {
    id: 21,
    category: '이용 문의', // '서비스 이용' 통합
    question: '여러 종류의 운동을 동시에 할 수 있나요? (예: 요가와 웨이트 트레이닝)',
    answer:
      '네, 여러 종류의 운동을 동시에 진행할 수 있습니다. 다만, 효율적인 관리를 위해 코치와 상담하여 개인의 목표와 체력에 맞는 복합 프로그램을 구성하는 것을 권장합니다.',
  },
  {
    id: 22,
    category: '이용 문의', // '서비스 이용' 통합
    question: '트레이닝 기록은 어디서 확인할 수 있나요?',
    answer: '신청내역에서 개인의 트레이닝 진행 상황, 성과, 코치의 피드백 등을 한눈에 확인할 수 있습니다.',
  },
  {
    id: 23,
    category: '이용 문의', // '서비스 이용' 통합
    question: '온라인 트레이닝도 가능한가요?',
    answer:
      'FIT-HEALTH는 기본적으로 1:1 방문형 기반의 서비스입니다. 온라인 트레이닝 가능 여부는 코치별로 상이할 수 있으므로, 코치 프로필을 확인하거나 직접 문의해주세요.',
  },
  {
    id: 24,
    category: '고객지원',
    question: '서비스에 불만족스러운 부분이 있다면 어떻게 해야 하나요?',
    answer:
      '서비스 이용 중 불만족스러운 부분이 있다면 고객센터로 연락해주세요. 여러분의 의견을 경청하고 문제 해결을 위해 최선을 다하겠습니다.',
  },
  {
    id: 25,
    category: '이용 문의', // '서비스 이용' 통합
    question: '가족이나 친구와 함께 이용할 수 있는 프로그램도 있나요?',
    answer:
      '현재는 개인 맞춤형 프로그램에 중점을 두고 있습니다. 다만, 특정 이벤트나 프로모션 기간에 한하여 그룹 트레이닝 또는 동반 이용 혜택이 제공될 수 있으니, 공지사항을 확인해주세요.',
  },
  {
    id: 26,
    category: '결제',
    question: '결제 오류가 발생했어요.',
    answer:
      '결제 오류 발생 시, 먼저 네트워크 연결 상태를 확인하고 웹을 재시작해보세요. 문제가 지속되면 결제 시간, 오류 메시지, 사용하신 결제 수단 등 상세 정보를 기재하여 고객센터로 문의해주시면 신속히 처리해 드리겠습니다.',
  },
  {
    id: 27,
    category: '이용 문의', // '서비스 이용' 통합
    question: 'FIT-HEALTH의 최신 소식이나 업데이트는 어디서 확인할 수 있나요?',
    answer:
      '앱 내 "공지사항" 또는 공식 웹사이트에서 FIT-HEALTH의 최신 소식, 업데이트, 이벤트 정보 등을 확인할 수 있습니다.',
  },
  {
    id: 28,
    category: '이용 문의', // '트레이닝 준비' 통합
    question: '트레이닝 시작 전에 준비해야 할 것이 있나요?',
    answer:
      '매칭된 코치가 첫 트레이닝 전에 필요한 준비물(예: 편안한 복장, 수분 보충을 위한 물, 간단한 운동 장비 등)에 대해 안내해 드릴 것입니다. 가이드에 따라 준비하시면 됩니다.',
  },
  {
    id: 29,
    category: '결제',
    question: '결제 취소 후 재결제는 어떻게 하나요?',
    answer:
      '결제를 취소한 후 다시 서비스를 이용하고 싶으시다면, 핏코치 신청 메뉴에서 새로운 이용권을 선택하여 재결제할 수 있습니다.',
  },
  {
    id: 30,
    category: '이용 문의', // '서비스 이용' 통합
    question: '운동 목표를 중간에 변경할 수 있나요?',
    answer:
      '네, 운동 목표는 언제든지 코치와의 상담을 통해 변경하거나 조정할 수 있습니다. 현재 상황과 달성하고 싶은 목표에 맞춰 유연하게 대처해 드립니다.',
  },
  {
    id: 31,
    category: '코치/상담',
    question: '코치의 자격이나 경력은 어떻게 확인할 수 있나요?',
    answer:
      '각 코치의 프로필 페이지에서 전문 자격증, 경력 사항, 전문 분야, 그리고 다른 사용자들의 평가를 상세하게 확인할 수 있습니다.',
  },
  {
    id: 32,
    category: '매칭',
    question: '방문 트레이닝은 어디서 진행되나요?',
    answer:
      '고객님의 자택, 지정된 스튜디오, 또는 원하시는 장소(예: 공원, 아파트 커뮤니티 시설) 등 고객님과 코치가 협의하여 편리한 장소에서 1:1 방문 트레이닝이 진행됩니다.',
  },
  {
    id: 33,
    category: '매칭',
    question: '트레이닝 장소는 어떻게 설정하나요?',
    answer:
      '매칭 신청 시 또는 코치와의 첫 상담 시, 원하시는 트레이닝 장소의 주소를 알려주시면 됩니다. 코치와 조율하여 가장 적합한 장소를 확정합니다.',
  },
  {
    id: 34,
    category: '이용 문의', // '운동 종류' 통합
    question: '도수 운동은 어떤 경우에 추천되나요?',
    answer:
      '도수 운동은 주로 자세 교정, 통증 관리, 특정 부위의 재활이 필요한 경우에 추천됩니다. 전문 도수 코치가 고객님의 신체 상태를 평가하여 맞춤형 운동을 제안합니다.',
  },
  {
    id: 35,
    category: '이용 문의', // '운동 종류' 통합
    question: '재활 운동은 어떤 식으로 진행되나요?',
    answer:
      '재활 전문 코치가 부상 부위나 수술 후 회복 단계에 맞춰 안전하고 효과적인 운동 계획을 수립합니다. 점진적인 강도 조절과 정확한 자세 지도를 통해 빠른 회복을 돕습니다.',
  },
  {
    id: 36,
    category: '코치/상담',
    question: '트레이닝 외에 식단 관리나 생활 습관 코칭도 받을 수 있나요?',
    answer:
      '네, 많은 코치들이 운동뿐만 아니라 고객님의 목표 달성을 위해 식단 가이드, 수면 관리, 스트레스 관리 등 전반적인 생활 습관 코칭을 함께 제공합니다. 코치 프로필을 확인하거나 상담 시 요청할 수 있습니다.',
  },
  {
    id: 37,
    category: '이용 문의', // '기술/접근성' 통합
    question: '웹 기반 서비스인데 모바일 앱으로도 이용 가능한가요?',
    answer:
      'FIT-HEALTH는 웹 기반 서비스로, PC나 스마트폰의 웹 브라우저를 통해 접속하여 이용할 수 있습니다. 별도의 모바일 앱은 현재 개발 중이거나 계획 중에 있을 수 있습니다.',
  },
  {
    id: 38,
    category: '이용 문의', // '서비스 이용' 통합
    question: '그룹 트레이닝이나 소수 인원 강습은 제공하지 않나요?',
    answer:
      'FIT-HEALTH는 1:1 맞춤형 방문 트레이닝에 특화된 서비스입니다. 현재는 그룹 트레이닝을 별도로 제공하지 않으며, 오직 고객님만을 위한 집중 관리에 중점을 둡니다.',
  },
  {
    id: 39,
    category: '이용 문의', // '서비스 이용' 통합
    question: '트레이닝 효과를 높이기 위한 팁이 있나요?',
    answer:
      '꾸준한 참여와 코치의 지시를 따르는 것이 중요합니다. 또한, 코치와의 솔직한 소통, 식단 관리 병행, 충분한 휴식을 통해 트레이닝 효과를 극대화할 수 있습니다.',
  },
  {
    id: 40,
    category: '코치/상담',
    question: '이용권 결제 전에 코치와 미리 상담해볼 수 있나요?',
    answer:
      '네, 이용권 결제 전에도 개인 연락처(카카오톡 아이디, 인스타그램)가 공개된 코치에 한해 간단한 사전 상담을 요청할 수 있습니다. 이를 통해 코치의 스타일을 미리 파악하고, 궁금한 점을 해소할 수 있습니다. 자세한 내용은 고객센터로 문의해주세요.',
  },
  {
    id: 41,
    category: '매칭',
    question: '도서 산간 지역에서도 방문 트레이닝이 가능한가요?',
    answer:
      '방문 트레이닝은 코치의 이동 가능 지역에 따라 제한될 수 있습니다. 매칭 신청 시 고객님의 주소를 입력하시면 방문 가능한 코치들을 확인하실 수 있습니다.',
  },
  {
    id: 42,
    category: '안전/정책', // '안전/위생' 통합
    question: '코치의 위생 및 안전 수칙은 어떻게 관리되나요?',
    answer:
      '모든 코치는 고객님의 안전과 건강을 위해 위생 수칙(예: 손 소독, 마스크 착용, 기구 소독)을 철저히 준수합니다. 또한, 정기적인 안전 교육을 통해 최상의 서비스를 제공하기 위해 노력합니다.',
  },
  {
    id: 43,
    category: '이용 문의', // '서비스 이용' 통합
    question: '운동 목표 달성 후에도 서비스를 계속 이용할 수 있나요?',
    answer:
      '네, 목표 달성 후에도 건강 유지, 새로운 목표 설정, 꾸준한 자기 관리를 위해 서비스를 계속 이용할 수 있습니다. 코치와 함께 다음 단계를 계획해 보세요.',
  },
  {
    id: 44,
    category: '고객지원',
    question: '서비스 이용 중 불편 사항이 발생하면 어떻게 보고하나요?',
    answer:
      '서비스 이용 중 코치와의 문제, 기술적 오류 등 불편 사항이 발생하면 즉시 고객센터로 연락해주세요. 신속하고 친절하게 문제를 해결해 드리겠습니다.',
  },
  {
    id: 45,
    category: '코치/상담',
    question: '코치와 소통할 수 있는 시간대가 정해져 있나요?',
    answer:
      '코치와의 소통은 앱 내 메시지를 통해 언제든 가능하지만, 원활한 답변을 위해 코치의 활동 시간(보통 09:00 ~ 22:00) 내에 문의하시는 것을 권장합니다. 긴급한 경우를 제외하고는 해당 시간 외 답변이 지연될 수 있습니다.',
  },
  {
    id: 46,
    category: '매칭',
    question: '트레이닝 예약은 언제까지 해야 하나요?',
    answer:
      '원하시는 트레이닝 시간을 확보하기 위해 결제일 기준 2일 후부터 예약이 가능합니다. 특히 인기 있는 코치나 특정 시간대는 마감될 수 있으니 미리 예약해주세요.',
  },
  {
    id: 47,
    category: '이용 문의', // '서비스 특징' 통합
    question: 'FIT-HEALTH만의 특별한 코칭 방식이 있나요?',
    answer:
      'FIT-HEALTH는 고객님 개개인의 신체 특성, 운동 목적, 생활 습관 등을 종합적으로 분석하여 100% 맞춤형 트레이닝 플랜을 제공합니다. 이는 단순히 운동만 가르치는 것이 아니라, 고객님의 건강한 라이프스타일을 전반적으로 설계하고 관리하는 데 중점을 둡니다.',
  },
  {
    id: 48,
    category: '이용 문의', // '트레이닝 준비' 통합
    question: '운동 전 스트레칭이나 워밍업도 코치가 지도해주나요?',
    answer:
      '네, 트레이닝 세션에는 운동 전 부상 방지를 위한 충분한 워밍업과 운동 후 근육 이완을 위한 쿨다운 및 스트레칭이 모두 포함됩니다. 코치가 단계별로 상세히 지도해 드립니다.',
  },
  {
    id: 49,
    category: '코치/상담',
    question: '트레이닝 후 개인적으로 연습할 만한 자료도 받을 수 있나요?',
    answer:
      '네, 많은 코치들이 고객님의 꾸준한 운동을 돕기 위해 트레이닝 후 복습 자료, 개인 운동 루틴, 식단 가이드 등 다양한 추가 자료를 제공합니다. 이는 코치와의 소통을 통해 요청할 수 있습니다.',
  },
  {
    id: 50,
    category: '결제',
    question: '이용권 구매 시 할부 결제가 가능한가요?',
    answer:
      '네, 이용권 결제 시 카드사 정책에 따라 할부 결제를 지원합니다. 결제 화면에서 할부 개월 수를 선택할 수 있습니다.',
  },
  {
    id: 51,
    category: '코치/상담',
    question: '서비스 이용 중 코치의 건강 문제가 발생하면 어떻게 되나요?',
    answer:
      '코치의 건강 문제 등으로 트레이닝 진행이 어려워질 경우, 고객님의 트레이닝 공백을 최소화하기 위해 즉시 다른 적합한 코치를 추천해 드리거나, 환불 등 적절한 조치를 취해 드립니다.',
  },
  {
    id: 52,
    category: '안전/정책', // '이용 정책' 통합
    question: 'FIT-HEALTH 서비스 이용 가능 연령대가 어떻게 되나요?',
    answer:
      'FIT-HEALTH 서비스는 만 19세 이상의 성인을 대상으로 합니다. 미성년자의 경우 법정 대리인의 동의 하에 이용이 가능하거나, 별도의 청소년 프로그램을 제공할 수 있습니다.',
  },
  {
    id: 53,
    category: '코치/상담',
    question: '트레이닝 외에 개인적인 건강 관련 질문도 코치에게 할 수 있나요?',
    answer:
      '네, 코치는 고객님의 전반적인 건강 관리를 돕는 전문가입니다. 운동 외에도 건강한 생활 습관, 영양, 스트레스 관리 등 궁금한 점이 있다면 코치에게 편하게 질문할 수 있습니다. 단, 의학적인 진단이나 처방은 불가합니다.',
  },
  {
    id: 54,
    category: '코치/상담',
    question: '매칭된 코치의 프로필을 다시 보고 싶어요.',
    answer: '매칭이 완료된 코치의 프로필은 마이페이지 > 매칭된 코치 정보에서 언제든지 다시 확인할 수 있습니다.',
  },
  {
    id: 55,
    category: '회원 관리', // '회원관리' 통합
    question: '서비스 이용 중 갑작스러운 이사로 주소가 변경되면 어떻게 되나요?',
    answer:
      '주소 변경 시 고객센터로 연락해주세요. 변경된 주소지에서 방문 가능한 코치가 있는지 확인하고, 필요한 경우 코치 변경 등 적절한 조치를 안내해 드립니다.',
  },
  {
    id: 56,
    category: '안전/정책', // '이용 정책' 통합
    question: 'FIT-HEALTH의 환불 정책 전문은 어디서 확인할 수 있나요?',
    answer:
      'FIT-HEALTH의 자세한 환불 정책은 웹사이트 하단의 "이용 약관" 또는 "환불 정책" 페이지에서 확인할 수 있습니다.',
  },
  {
    id: 57,
    category: '이용 문의', // '트레이닝 준비' 통합
    question: '트레이닝 시작 후 운동복이나 장비를 구매해야 하나요?',
    answer:
      '필수적인 것은 아닙니다. 코치가 맨몸 운동이나 고객님 자택의 소규모 장비(예: 요가 매트, 밴드)를 활용한 운동 방법을 먼저 제시해 드릴 것입니다. 필요에 따라 코치와 상의 후 구매를 결정할 수 있습니다.',
  },
  {
    id: 58,
    category: '이용 문의', // '서비스 이용' 통합
    question: '개인 트레이닝 기록이 사라질까 봐 걱정돼요.',
    answer:
      '고객님의 모든 트레이닝 기록과 코치와의 소통 내용은 FIT-HEALTH 시스템에 안전하게 저장 및 관리됩니다. 마이페이지에서 언제든지 과거 기록을 열람할 수 있습니다.',
  },
  {
    id: 59,
    category: '고객지원',
    question: '서비스에 대한 건의 사항이나 개선 아이디어가 있다면 어디에 남기나요?',
    answer:
      '고객님의 소중한 의견은 FIT-HEALTH 서비스 발전에 큰 도움이 됩니다. 웹사이트 내 "고객 의견함" 또는 고객센터를 통해 자유롭게 건의 사항이나 아이디어를 남겨주세요.',
  },
  {
    id: 60,
    category: '커뮤니티',
    question: '커뮤니티는 어떻게 이용할 수 있나요?',
    answer:
      '앱 내 "커뮤니티" 메뉴에서 다른 사용자들과 운동 정보, 건강 팁, 경험 등을 공유하고 소통할 수 있습니다. 게시글 작성, 댓글 달기, 좋아요 기능 등을 활용해 보세요.',
  },
  {
    id: 61,
    category: '커뮤니티',
    question: '커뮤니티에서 어떤 내용을 공유할 수 있나요?',
    answer:
      '운동 일지, 성공 경험, 식단 정보, 궁금한 점 질문 등 건강 및 운동과 관련된 다양한 내용을 자유롭게 공유할 수 있습니다. 긍정적이고 건전한 커뮤니티 문화를 위해 부적절한 게시물은 관리될 수 있습니다.',
  },
  {
    id: 62,
    category: '코치/상담',
    question: '코치와 1:1 채팅은 어떻게 시작하나요?',
    answer:
      '매칭된 코치의 프로필 페이지나 "내 트레이닝" 메뉴에서 "1:1 채팅" 버튼을 눌러 언제든지 코치와 직접 메시지를 주고받을 수 있습니다.',
  },
  {
    id: 63,
    category: 'AI 기능',
    question: 'AI 추천 운동은 어떤 기준으로 추천되나요?',
    answer:
      'AI 추천 운동은 고객님의 입력하신 목표, 체력 수준, 선호하는 운동 종류(헬스, 요가) 및 과거 운동 데이터를 기반으로 개인에게 최적화된 운동 루틴을 제안합니다.',
  },
  {
    id: 64,
    category: 'AI 기능',
    question: 'AI 추천 운동은 헬스와 요가만 가능한가요?',
    answer:
      '네, 현재 AI 추천 운동은 헬스와 요가 두 가지 운동 종류에 한하여 제공됩니다. 도수나 재활 운동은 1:1 코치 매칭을 통해 전문적인 지도를 받으실 수 있습니다.',
  },
  {
    id: 65,
    category: 'AI 기능',
    question: 'AI 추천 식단은 어떻게 받아볼 수 있나요?',
    answer:
      '"AI 식단 추천" 메뉴에서 고객님의 목표(예: 체중 감량, 근육 증진), 알레르기 유무, 선호 식재료 등을 입력하시면, AI가 맞춤형 식단 가이드를 제공합니다.',
  },
  {
    id: 66,
    category: 'AI 기능',
    question: 'AI 추천 식단은 매일 바뀌나요?',
    answer:
      'AI 추천 식단은 정기적으로 업데이트되며, 고객님의 필요에 따라 재설정 요청 시 새로운 식단 플랜을 제공합니다. 꾸준한 이용을 통해 더욱 정확한 추천을 받을 수 있습니다.',
  },
  {
    id: 67,
    category: '커뮤니티',
    question: '커뮤니티에서 부적절한 게시물을 발견하면 어떻게 신고하나요?',
    answer:
      '커뮤니티 게시글 우측 상단의 "신고" 버튼을 통해 부적절한 게시물을 신고할 수 있습니다. 신고 내용은 운영팀에서 신속하게 검토 후 조치합니다.',
  },
  {
    id: 68,
    category: 'AI 기능',
    question: 'AI 추천 운동/식단은 코치와의 트레이닝과 병행할 수 있나요?',
    answer:
      '네, AI 추천 기능은 코치와의 트레이닝을 보완하는 용도로 활용할 수 있습니다. AI 추천 내용을 코치와 공유하여 더욱 시너지를 낼 수도 있습니다.',
  },
  {
    id: 69,
    category: '안전/정책', // '안전/응급' 통합
    question: '트레이닝 중 긴급 상황이 발생하면 어떻게 해야 하나요?',
    answer:
      '긴급 상황 발생 시에는 무엇보다 고객님의 안전이 최우선입니다. 즉시 트레이닝을 중단하고 코치에게 상황을 알려주세요. 필요한 경우 119 등 응급 서비스에 연락하거나, 코치와 함께 상황에 맞는 대처를 하도록 안내합니다.',
  },
  {
    id: 70,
    category: '코치/상담',
    question: '코치의 학력이나 자격증 등 전문성 관련 정보를 더 자세히 알고 싶어요.',
    answer:
      '각 코치의 프로필 페이지에는 코치의 전문성을 증명하는 학력, 주요 경력, 취득 자격증 등의 정보가 상세히 기재되어 있습니다. 이를 통해 고객님에게 맞는 코치를 신뢰하고 선택할 수 있습니다.',
  },
  {
    id: 71,
    category: '이용 문의', // '서비스 특징' 통합
    question: 'FIT-HEALTH는 개인 맞춤형 서비스를 강조하는데, 어떤 점이 특히 맞춤형인가요?',
    answer:
      'FIT-HEALTH는 단순히 운동 루틴만 제공하는 것이 아니라, 고객님의 개별적인 건강 목표, 신체 조건, 생활 습관, 선호하는 운동 종류, 심지어 방문 가능한 장소까지 종합적으로 고려하여 코치를 매칭하고 프로그램을 구성합니다. AI 추천 기능 또한 이러한 개인 맞춤형 데이터에 기반하여 제공됩니다.',
  },
  {
    id: 72,
    category: '고객지원',
    question: '서비스 이용 중 제 의견이나 제안을 반영해 주나요?',
    answer:
      '네, 고객님의 소중한 의견은 FIT-HEALTH 서비스 개선에 매우 중요하게 반영됩니다. 고객센터나 앱 내 "의견 보내기" 기능을 통해 언제든지 의견을 전달해 주세요. 정기적인 설문조사 등을 통해 고객의 피드백을 적극적으로 수렴하고 있습니다.',
  },
  {
    id: 73,
    category: '안전/정책', // '개인정보' 통합
    question: 'FIT-HEALTH의 보안 시스템은 어떻게 되어 있나요?',
    answer:
      '고객님의 모든 개인 정보 및 결제 정보는 최신 암호화 기술을 사용하여 안전하게 보호됩니다. 또한, 정기적인 보안 점검과 업데이트를 통해 외부 위협으로부터 시스템을 보호하고 있습니다.',
  },
  {
    id: 74,
    category: '안전/정책', // '안전/위생' 통합
    question: '트레이닝 중 코치의 불성실한 태도나 문제 발생 시 어떻게 처리되나요?',
    answer:
      '코치의 불성실한 태도나 불쾌감을 주는 행동 등 문제가 발생할 경우, 즉시 고객센터로 신고해 주세요. FIT-HEALTH는 고객 만족을 최우선으로 하며, 접수된 사안에 대해 철저히 조사하고 재발 방지를 위한 강력한 조치를 취할 것입니다.',
  },
  {
    id: 75,
    category: '이용 문의', // '서비스 이용' 통합
    question: '제가 원하는 특정 운동 목표가 있는데, 그에 맞는 코치를 찾을 수 있을까요?',
    answer:
      '네, 가능합니다. 매칭 신청 시 "운동 목표"를 구체적으로 입력하시면, 해당 목표 달성에 특화된 전문 코치(예: 바디 프로필, 마라톤 준비, 출산 후 회복 등)를 우선적으로 추천해 드립니다.',
  },
  {
    id: 76,
    category: '이용 문의', // '서비스 이용' 통합
    question: 'FIT-HEALTH 서비스 이용 후 운동 효과를 증명할 수 있는 자료를 받을 수 있나요?',
    answer:
      '트레이닝 기록은 마이페이지에서 언제든지 확인할 수 있으며, 코치와의 상담을 통해 운동 성과 리포트나 목표 달성 인증 등 효과를 증명할 수 있는 자료를 요청할 수 있습니다.',
  },
];

function FAQPage() {
  const [activeCategory, setActiveCategory] = useState('전체');
  const [openQuestionId, setOpenQuestionId] = useState(null);
  const [keyForAnimation, setKeyForAnimation] = useState(0); // FAQContent의 애니메이션을 위한 키

  // 페이지네이션 관련 상태 추가
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // 한 페이지에 표시할 항목 수

  // 선택된 카테고리에 따라 FAQ 데이터 필터링
  const filteredFaqs = useMemo(() => {
    return activeCategory === '전체' ? faqData : faqData.filter((faq) => faq.category === activeCategory);
  }, [activeCategory]);

  // 현재 페이지에 해당하는 FAQ 항목만 추출
  const paginatedFaqs = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredFaqs.slice(startIndex, endIndex);
  }, [currentPage, filteredFaqs, itemsPerPage]);

  // 총 페이지 수 계산
  const totalPages = Math.ceil(filteredFaqs.length / itemsPerPage);

  const handleQuestionClick = (id) => {
    setOpenQuestionId(openQuestionId === id ? null : id);
  };

  // 카테고리 변경 시 애니메이션을 다시 트리거하고, 페이지를 1페이지로 초기화
  const handleSelectCategory = (category) => {
    setActiveCategory(category);
    setOpenQuestionId(null);
    setCurrentPage(1); // 카테고리 변경 시 1페이지로 초기화
    setKeyForAnimation((prevKey) => prevKey + 1); // 키를 변경하여 FAQContent 애니메이션 리트리거
  };

  // 페이지 변경 핸들러
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    setOpenQuestionId(null); // 페이지 변경 시 열려있는 질문 닫기
    setKeyForAnimation((prevKey) => prevKey + 1); // FAQContent 애니메이션 리트리거
    window.scrollTo({ top: 0, behavior: 'smooth' }); // 페이지 상단으로 스크롤
  };

  // FAQ 카테고리 목록 생성 (중복 제거)
  const categories = useMemo(() => {
    const uniqueCategories = ['전체', ...new Set(faqData.map((faq) => faq.category))];
    return uniqueCategories.map((cat) => ({ name: cat }));
  }, []);

  return (
    <>
      <PageContainer>
        <TitleBar title="자주 묻는 질문" />
        <ContentWrapper>
          <CustomCategoryMenu
            selectedCategory={activeCategory}
            onSelectCategory={handleSelectCategory}
            categories={categories}
          />
          <FAQListContainer>
            {' '}
            {/* FAQ 목록과 페이지네이션을 감싸는 컨테이너 추가 */}
            <FAQContent key={keyForAnimation}>
              {paginatedFaqs.length > 0 ? (
                paginatedFaqs.map((faq) => (
                  <FAQItem key={faq.id}>
                    <QuestionHeader onClick={() => handleQuestionClick(faq.id)}>
                      <QuestionSymbol>Q</QuestionSymbol>
                      <QuestionText>{faq.question}</QuestionText>
                      {openQuestionId === faq.id ? <FaChevronUp /> : <FaChevronDown />}
                    </QuestionHeader>
                    {openQuestionId === faq.id && (
                      <AnswerContainer open={openQuestionId === faq.id}>
                        <AnswerSymbol>A</AnswerSymbol>
                        <AnswerText>{faq.answer}</AnswerText>
                      </AnswerContainer>
                    )}
                  </FAQItem>
                ))
              ) : (
                <NoFAQMessage>해당 카테고리의 질문이 없습니다.</NoFAQMessage>
              )}
            </FAQContent>
            {totalPages > 1 && ( // 총 페이지가 1보다 많을 때만 페이지네이션 표시
              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
            )}
          </FAQListContainer>
        </ContentWrapper>
      </PageContainer>
    </>
  );
}

export default FAQPage;

// --- 애니메이션 Keyframes ---
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const slideDown = keyframes`
  from {
    max-height: 0;
    opacity: 0;
  }
  to {
    max-height: 500px; /* 실제 답변 내용에 따라 충분히 큰 값으로 설정. 이전 200px는 너무 작을 수 있습니다. */
    opacity: 1;
  }
`;

// --- 스타일 컴포넌트 ---

const PageContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ContentWrapper = styled.div`
  width: ${({ theme }) => theme.width.lg};
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.base};
  margin-top: ${({ theme }) => theme.spacing['2']};
  margin-bottom: ${({ theme }) => theme.spacing['8']};
  display: flex;
  gap: ${({ theme }) => theme.spacing['3']};
  padding: ${({ theme }) => theme.spacing['4']};
  min-height: calc(100vh - 294px); /* 이 값은 실제 컴포넌트 높이에 따라 조정해야 합니다. */
`;

const FAQListContainer = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between; /* FAQ 목록과 페이지네이션을 상단/하단으로 분리 */
`;

const FAQContent = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  border-top: 1px solid ${({ theme }) => theme.colors.gray['200']};
  animation: ${fadeIn} 0.5s ease-out; /* 카테고리 변경 시 전체 FAQ 목록 애니메이션 속도 조정 */
`;

const FAQItem = styled.div`
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray['200']};
  &:last-child {
    border-bottom: none;
  }
`;

const QuestionHeader = styled.div`
  display: flex;
  align-items: center;
  padding: ${({ theme }) => theme.spacing['4']};
  cursor: pointer;
  background-color: ${({ theme }) => theme.colors.white};
  transition: background-color 0.3s ease; /* transition 시간 조정 */
  &:hover {
    background-color: ${({ theme }) => theme.colors.gray['50']};
  }
  svg {
    margin-left: auto;
    color: ${({ theme }) => theme.colors.gray['500']};
    font-size: ${({ theme }) => theme.fontSizes.sm};
    transition: transform 0.3s ease; /* 아이콘 회전 애니메이션 시간 조정 */
    ${(props) =>
      props.open &&
      css`
        transform: rotate(180deg);
      `}
  }
`;

const QuestionSymbol = styled.span`
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.primary};
  font-size: ${({ theme }) => theme.fontSizes.lg};
  margin-right: ${({ theme }) => theme.spacing['3']};
  width: 24px;
  text-align: center;
`;

const QuestionText = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.base};
  color: ${({ theme }) => theme.colors.gray['800']};
  flex-grow: 1;
`;

const AnswerContainer = styled.div`
  display: flex;
  padding: ${({ theme }) => theme.spacing['4']};
  background-color: ${({ theme }) => theme.colors.gray['200']};
  border-top: 1px solid ${({ theme }) => theme.colors.gray['200']};
  overflow: hidden;

  ${(props) =>
    props.open
      ? css`
          animation: ${slideDown} 0.4s ease-out forwards;
        `
      : css`
          max-height: 0;
          opacity: 0;
        `}
`;

const AnswerSymbol = styled.span`
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.gray['600']};
  font-size: ${({ theme }) => theme.fontSizes.lg};
  margin-right: ${({ theme }) => theme.spacing['3']};
  width: 24px;
  text-align: center;
`;

const AnswerText = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.base};
  color: ${({ theme }) => theme.colors.gray['700']};
  line-height: 1.6;
  flex-grow: 1;
`;

const NoFAQMessage = styled.div`
  padding: ${({ theme }) => theme.spacing['8']};
  text-align: center;
  color: ${({ theme }) => theme.colors.gray['500']};
  font-size: ${({ theme }) => theme.fontSizes.md};
`;
