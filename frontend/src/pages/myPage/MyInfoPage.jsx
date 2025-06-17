import React, { useState } from 'react';
import styled from 'styled-components';
import ButtonStyle from '../../styles/common/Button';
import { Button, Item, List, Wrapper } from '../../styles/common/SelectGoal';
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
                      {cat}
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
  padding: ${({ theme }) => theme.spacing['2']} ${({ theme }) => theme.spacing['3']};
  border-radius: 24px;
  border: 1.5px solid #cdcdcd;

  background: ${({ selected, theme }) => (selected ? theme.colors.secondary : 'transparent')};
  color: ${({ $isSelected, theme }) => ($isSelected ? '#fff' : theme.colors.primary)};

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
    background: ${({ theme }) => theme.colors.secondary};
    color: #fff;
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

const SubmitButton = styled(ButtonStyle)`
  width: 80%;
  align-self: center;
  margin-top: ${({ theme }) => theme.spacing['8']};
`;
