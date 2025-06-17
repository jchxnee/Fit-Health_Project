import React, { useState } from 'react';
import styled from 'styled-components';
import ButtonStyle from '../../styles/common/Button';
import { Button, Item, List, Wrapper } from '../../styles/common/SelectGoal';
import * as S from '../../styles/common/SelectGoal';
import RegionSection from '../../components/CoachRegister/RegionSection';
import RegionSelect from '../../components/RegionSelect';

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

const MyInfoPage = () => {
  const [selectedGender, setSelectedGender] = useState('');
  const [height, setHeight] = useState('');
  const [phone, setPhone] = useState('');
  const [selected, setSelected] = useState('근력향상');

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <>
      <CustomInfoContainer>
        <CustomInfoForm onSubmit={handleSubmit}>
          <PageTitle>내 정보 관리</PageTitle>

          {/* 전화번호 섹션 */}
          <InputGroup>
            <Label htmlFor="phone">전화번호</Label>
            <InputWithUnit>
              <StyledInput type="text" id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </InputWithUnit>
          </InputGroup>

          {/* 주소 섹션 */}
          <InputGroup>
            <Label>주소</Label>
            <RegionSelect className="Select" />
          </InputGroup>

          {/* 성별 섹션 */}
          <InputGroup>
            <Label>성별</Label>
            <GenderSelection>
              <GenderButton
                type="button"
                $isSelected={selectedGender === 'male'}
                onClick={() => setSelectedGender('male')}
              >
                남성
              </GenderButton>
              <GenderButton
                type="button"
                $isSelected={selectedGender === 'female'}
                onClick={() => setSelectedGender('female')}
              >
                여성
              </GenderButton>
            </GenderSelection>
          </InputGroup>

          {/* 키 섹션 */}
          <InputGroup>
            <Label htmlFor="height">키</Label>
            <InputWithUnit>
              <StyledInput
                type="number"
                id="height"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                placeholder="예) 175"
              />
              <UnitText>cm</UnitText>
            </InputWithUnit>
          </InputGroup>

          {/* 목표 섹션 (컴포넌트가 있다고 가정) */}
          <InputGroup>
            <Label>목표</Label>
            <Wrapper>
              <Button>
                <List>
                  {categories.map((cat) => (
                    <Item key={cat} selected={selected === cat} onClick={() => setSelected(cat)}>
                      <Label>{cat}</Label>
                    </Item>
                  ))}
                </List>
              </Button>
            </Wrapper>
          </InputGroup>

          <SubmitButton type="submit">내 정보 변경</SubmitButton>
        </CustomInfoForm>
      </CustomInfoContainer>
    </>
  );
};

export default MyInfoPage;

const CustomInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: ${({ theme }) => theme.spacing['10']};
  background-color: #f9fafa;
  min-height: calc(100vh - 60px);
  box-sizing: border-box;
  width: 100%;
  font-family: 'Noto Sans KR', sans-serif;
`;

const CustomInfoForm = styled.form`
  background-color: ${({ theme }) => theme.colors.white};
  padding: ${({ theme }) => theme.spacing['10']} ${({ theme }) => theme.spacing['20']};
  border-radius: ${({ theme }) => theme.borderRadius.ten};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  width: 100%;
  max-width: 700px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const PageTitle = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing['10']};
  width: 100%;
  text-align: center;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: ${({ theme }) => theme.spacing['6']};
  width: 100%;
  max-width: 200px;
  text-align: left;
`;

const Label = styled.label`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.primary};
  font-weight: ${({ theme }) => theme.fontWeights.normal};
  margin-bottom: ${({ theme }) => theme.spacing['2']};
`;

const StyledInput = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.spacing['2']} 0;
  border: none;
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray['300']};
  font-size: ${({ theme }) => theme.fontSizes.base};
  color: ${({ theme }) => theme.colors.primary};
  box-sizing: border-box;
  outline: none;
  transition: border-color 0.2s ease;

  &::placeholder {
    color: ${({ theme }) => theme.colors.gray['400']};
  }

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

export const GenderSelection = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing['2']};
  width: 100%;
  max-width: 480px;
  margin-top: ${({ theme }) => theme.spacing['2']};
`;

export const GenderButton = styled.button`
  flex: 1;
  /* Use the same padding and border-radius as Item for consistency */
  padding: ${({ theme }) => theme.spacing['2']} ${({ theme }) => theme.spacing['3']};
  border-radius: 24px; /* Consistent with Item's border-radius */
  border: 1.5px solid #cdcdcd; /* Consistent with Item's border */

  /* Apply background and color based on $isSelected, similar to Item's 'selected' prop */
  background: ${({ $isSelected, theme }) => ($isSelected ? theme.colors.button : 'transparent')};
  color: ${({ $isSelected, theme }) => ($isSelected ? '#fff' : theme.colors.primary)};

  font-size: ${({ theme }) => theme.fontSizes.sm}; /* Consistent font-size, or base if preferred for buttons */
  font-weight: 500; /* Consistent font-weight */
  text-align: center;
  cursor: pointer;
  transition:
    background 0.2s,
    color 0.2s; /* Consistent transition */
  outline: none;
  box-shadow: none;

  &:hover {
    background: ${({ theme }) => theme.colors.button}; /* Consistent hover effect */
    color: #fff; /* Consistent hover effect */
  }
`;

const UnitText = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.primary};
  margin-left: ${({ theme }) => theme.spacing['1']};
`;

const InputWithUnit = styled.div`
  display: flex;
  align-items: flex-end;
  width: 100%;
  ${StyledInput} {
    flex-grow: 1;
    width: auto;
  }
`;

const RegionSelectionBox = styled.div`
  width: 100%;
  max-width: 480px;
  padding: ${({ theme }) => theme.spacing['3']};
  border: 1px solid ${({ theme }) => theme.colors.gray['300']};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  background-color: ${({ theme }) => theme.colors.white};
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: ${({ theme }) => theme.fontSizes.base};
  color: ${({ theme }) => theme.colors.primary};
  box-sizing: border-box;
  margin-top: ${({ theme }) => theme.spacing['2']};

  &:hover {
    border-color: ${({ theme }) => theme.colors.gray['400']};
  }
`;

const SelectedRegionText = styled.span`
  color: ${({ theme, $hasSelected }) => ($hasSelected ? theme.colors.gray['800'] : theme.colors.gray['500'])};
`;

// --- 지역 선택 모달 관련 Styled Components ---
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5); /* 반투명 오버레이 */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000; /* 다른 요소보다 위에 오도록 설정 */
`;

const RegionModalContent = styled.div`
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 500px; /* 모달의 최대 너비 */
  height: 400px; /* 모달의 높이 */
  display: flex;
  flex-direction: column;
  overflow: hidden; /* 내부 컨텐츠 스크롤 처리 */
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing['4']};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray['200']};
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.primary};
`;

const ResetButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.gray['500']};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  cursor: pointer;
  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const ModalBody = styled.div`
  display: flex;
  flex-grow: 1; /* 남은 공간을 채우도록 함 */
  overflow: hidden;
`;

const ProvinceList = styled.div`
  flex-basis: 35%; /* 이미지처럼 왼쪽 목록 너비 조정 */
  border-right: 1px solid ${({ theme }) => theme.colors.gray['200']};
  overflow-y: auto; /* 내용이 넘치면 스크롤 */
  background-color: ${({ theme }) => theme.colors.gray['100']}; /* 왼쪽 배경색 */
`;

const CityList = styled.div`
  flex-basis: 65%; /* 이미지처럼 오른쪽 목록 너비 조정 */
  overflow-y: auto; /* 내용이 넘치면 스크롤 */
`;

const ListItem = styled.div`
  padding: ${({ theme }) => theme.spacing['3']} ${({ theme }) => theme.spacing['4']};
  font-size: ${({ theme }) => theme.fontSizes.base};
  color: ${({ theme }) => theme.colors.primary};
  cursor: pointer;
  &:hover {
    background-color: ${({ theme }) => theme.colors.gray['200']};
  }
  background-color: ${({ theme, $isSelected }) => ($isSelected ? theme.colors.gray['200'] : 'transparent')};
  font-weight: ${({ theme, $isSelected }) => ($isSelected ? theme.fontWeights.semibold : theme.fontWeights.normal)};
`;

const SubmitButton = styled(ButtonStyle)`
  width: 80%;
  align-self: center;
  margin-top: ${({ theme }) => theme.spacing['8']};
`;

const Section = styled.section`
  width: 100%;
  padding: 0 12px;
`;
