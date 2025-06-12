import styled from 'styled-components';

export const Wrapper = styled.section`
  width: 500px;
  display: flex;
  justify-content: center;
  padding: 0;
  max-width: 700px;
  justify-content: flex-start;
`;

export const Button = styled.div`
  width: 100%;
  display: flex;
`;

export const List = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: left;
  gap: ${({ theme }) => theme.spacing['2']}; /* 8px */
`;

export const Item = styled.button`
  min-width: auto;
  height: auto;
  padding: ${({ theme }) => theme.spacing['2']} ${({ theme }) => theme.spacing['3']};
  border-radius: 24px;
  border: 1.5px solid #cdcdcd;
  background: ${({ selected, theme }) => (selected ? theme.colors.button : 'transparent')};
  color: ${({ selected, theme }) => (selected ? '#fff' : theme.colors.primary)};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: 500;
  text-align: center;
  cursor: pointer;
  transition:
    background 0.2s,
    color 0.2s;
  outline: none;
  box-shadow: none;
  &:hover {
    background: ${({ theme }) => theme.colors.button}; /* primary hover color */
    color: #fff;
  }
`;

// 만약 아이콘 박스와 라벨이 필요하다면 여기에 정의
export const IconBox = styled.div`
  /* 스타일 정의 */
`;

export const Label = styled.span`
  /* 스타일 정의 */
`;
