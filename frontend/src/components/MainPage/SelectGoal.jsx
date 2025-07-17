import React, { useState } from 'react';
import styled from 'styled-components';
import media from '../../utils/media'; // media 헬퍼 함수 임포트 (경로 확인 필요)

const Wrapper = styled.section`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 0 ${({ theme }) => theme.spacing[6]} 0; // 이 부분 수정

  ${media.md`
    padding: 0 0 ${({ theme }) => theme.spacing[6]} 0; // 이 부분 수정
  `}
  ${media.sm`
    padding: 0 0 ${({ theme }) => theme.spacing[4]} 0; // 이 부분 수정
  `}
`;

const Button = styled.div`
  width: ${({ theme }) => theme.width.lg};
  display: flex;
  padding: 0 ${({ theme }) => theme.spacing[4]} 0; // 이 부분 수정
  box-sizing: border-box;

  ${media.lg`
    width: 90%;
  `}
  ${media.md`
    width: 95%;
  `}
`;

const List = styled.div`
  width: 674px; // 기존 너비
  display: flex;
  flex-direction: row;
  flex-wrap: wrap; // 버튼이 많아지면 줄 바꿈
  gap: ${({ theme }) => theme.spacing[4]}; // 이 부분 수정

  ${media.lg`
    width: 100%; // 더 넓은 화면에서 유연하게
    max-width: 674px; // 최대 너비 유지
  `}
  ${media.md`
    width: 100%;
    gap: ${({ theme }) => theme.spacing[2]}; // 이 부분 수정
  `}
  ${media.sm`
    width: 100%;
    gap: ${({ theme }) => theme.spacing[1]}; // 이 부분 수정
    justify-content: flex-start; // 왼쪽 정렬 유지
    padding: 0 ${({ theme }) => theme.spacing[2]}; // 이 부분 수정 (버튼 그룹 자체에 패딩)
    overflow-x: auto; // 가로 스크롤 허용
    white-space: nowrap; // 버튼이 줄 바꿈되지 않도록
    &::-webkit-scrollbar { // 스크롤바 숨기기 (선택 사항)
      display: none;
    }
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
  `}
`;

const CategoryBtn = styled.button`
  min-width: 74px;
  padding: ${({ theme }) => theme.spacing[2]}; // 이 부분 수정
  border-radius: ${({ theme }) => theme.borderRadius['3xl']};
  border: 1.5px solid ${({ theme }) => theme.colors.gray[300]};
  background: ${({ selected, theme }) => (selected ? theme.colors.secondary : 'transparent')};
  color: ${({ selected, theme }) => (selected ? theme.colors.white : theme.colors.primary)};
  font-size: ${({ theme }) => theme.fontSizes.base};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  cursor: pointer;
  transition:
    background 0.2s,
    color 0.2s;
  outline: none;
  box-shadow: none;
  flex-shrink: 0; // 버튼이 줄어들지 않도록

  &:hover {
    background: ${({ theme }) => theme.colors.secondary};
    color: ${({ theme }) => theme.colors.white};
  }

  ${media.md`
    min-width: 60px;
    padding: ${({ theme }) => theme.spacing[1]} ${({ theme }) => theme.spacing[2]}; // 이 부분 수정
    font-size: ${({ theme }) => theme.fontSizes.sm};
  `}
  ${media.sm`
    min-width: unset; // 모바일에서 최소 너비 제거 (콘텐츠에 맞게)
    padding: ${({ theme }) => theme.spacing.base} ${({ theme }) => theme.spacing[2]}; // 이 부분 수정
    font-size: ${({ theme }) => theme.fontSizes.xs};
    border-radius: ${({ theme }) => theme.borderRadius.xl};
  `}
`;

const VideoWrapper = styled.div`
  margin-top: 32px;
  height: 500px;
  display: flex; // 중앙 정렬 유지 (iframe 자체를 가운데로)
  justify-content: center; // 중앙 정렬

  ${media.md`
    margin-top: ${({ theme }) => theme.spacing[6]}; // 이 부분 수정
    height: 400px; // 높이 줄이기
  `}
  ${media.sm`
    margin-top: ${({ theme }) => theme.spacing[4]}; // 이 부분 수정
    height: 250px; // 높이 더 줄이기
  `}
  ${media.xs`
    height: 200px;
  `}

  iframe {
    width: ${({ theme }) => theme.width.lg}; // 기본 너비
    height: 100%; // 부모 VideoWrapper의 높이 따름
    border: none;
    border-radius: ${({ theme }) => theme.borderRadius.xl};

    ${media.lg`
      width: 90%; // 더 작은 화면에서 너비 조정
    `}
    ${media.md`
      width: 95%;
      border-radius: ${({ theme }) => theme.borderRadius.lg};
    `}
    ${media.sm`
      width: 98%;
      border-radius: ${({ theme }) => theme.borderRadius.md};
    `}
  }
`;

const categories = [
  '체형교정·가벼운통증',
  '헬스',
  '다이어트',
  '근력향상',
  '산전·후운동',
  '만성통증·재활운동',
  '요가명상',
  '근골격계 케어',
];

const categoryVideos = {
  '체형교정·가벼운통증': 'https://www.youtube.com/embed/NO1mncOrbdI?si=LBxNkxzr-_egOba2',
  헬스: 'https://www.youtube.com/embed/_buwjp1ogAQ?si=lUF81j70vEfNTfPK',
  다이어트: 'https://www.youtube.com/embed/CYcLODSeC-c?si=lVohpAnbdqWvcSHf',
  근력향상: 'https://www.youtube.com/embed/w0WQHVYKsss?si=SpWoaZGHBLd4olNv',
  '산전·후운동': 'https://www.youtube.com/embed/zDcOqeLGymE?si=_WgS29ftGimrXeVq',
  '만성통증·재활운동': 'https://www.youtube.com/embed/dismp4Vw7UQ?si=AvVzLej5Z6Jkec4W',
  요가명상: 'https://www.youtube.com/embed/HtHS8oO9Tg8?si=b4g5jPe8KRj1cQjp',
  '근골격계 케어': 'https://www.youtube.com/embed/pdKENkJjWkc?si=lU5AgVWs9BSHq4P4',
};

const SelectGoal = () => {
  const [selected, setSelected] = useState('근력향상');

  return (
    <Wrapper>
      <Button>
        <List>
          {categories.map((cat) => (
            <CategoryBtn key={cat} selected={selected === cat} onClick={() => setSelected(cat)}>
              {cat}
            </CategoryBtn>
          ))}
        </List>
      </Button>

      <VideoWrapper>
        <iframe
          title={selected}
          src={categoryVideos[selected]} // 기존 URL 사용
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </VideoWrapper>
    </Wrapper>
  );
};

export default SelectGoal;
