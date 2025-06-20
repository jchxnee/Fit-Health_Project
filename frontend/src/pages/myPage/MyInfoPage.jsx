import React, { useState } from 'react';
import styled from 'styled-components';
import ButtonStyle from '../../styles/common/Button';
import { Button, Item, List, Wrapper } from '../../styles/common/SelectGoal';
import RegionSelect from '../../components/RegionSelect';
import useUserStore from '../../store/useUserStore';
import * as yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'react-toastify';
import { memberService } from '../../api/member';

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

const schema = yup.object().shape({
  phone: yup.string().matches(/^\d{11}$/, '전화번호는 11자리 숫자로만 입력해주세요.'),
  height: yup.number().typeError('숫자만 입력하세요.').min(0),
  gender: yup.string(),
  goal: yup.string(),
  address: yup.string(),
});

const MyInfoPage = () => {
  const { user, updateUser } = useUserStore();
  const [isLoading, setIsLoading] = useState(false);

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      phone: user.phone ?? '',
      height: user.height ?? '',
      gender: user.gender ?? '',
      goal: user.goal ?? '',
      address: user.address ?? '',
    },
  });

  const { handleSubmit, setValue } = methods;

  // UI 전용 상태
  const [selected, setSelected] = useState(user.goal || '');
  const [selectedGender, setSelectedGender] = useState(user.gender || '');

  // 성별 선택 시 form에도 반영
  const handleGenderSelect = (value) => {
    setSelectedGender(value);
    setValue('gender', value);
  };

  // 목표 선택 시 form에도 반영
  const handleGoalSelect = (value) => {
    setSelected(value);
    setValue('goal', value);
  };

  const onInvalid = (errors) => {
    toast.error('입력 정보를 확인해주세요.');
  };

  const onSubmit = async (data) => {
    console.log('✅ onSubmit 실행', data);
    try {
      setIsLoading(true);

      await memberService.updateInfo(user.email, data);

      updateUser(data);
      updateUser({
        phone: data.phone,
        address: data.address,
        gender: data.gender,
        height: data.height,
        goal: data.goal,
      });
      toast.success('내 정보가 성공적으로 수정되었습니다.');
    } catch (err) {
      if (err.response?.data?.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error('정보 수정 중 오류가 발생했습니다.');
        console.error(err);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <CustomInfoContainer>
        <CustomInfoForm onSubmit={handleSubmit(onSubmit, onInvalid)}>
          <PageTitle>내 정보 관리</PageTitle>

          {/* 전화번호 섹션 */}
          <InputGroup>
            <Label htmlFor="phone">전화번호</Label>
            <InputWithUnit>
              <StyledInput type="text" id="phone" {...methods.register('phone')} />
            </InputWithUnit>
          </InputGroup>

          {/* 주소 섹션 */}
          <InputGroup>
            <Label>주소</Label>
            <Controller
              name="address"
              control={methods.control}
              render={({ field }) => <RegionSelect value={field.value} onChange={field.onChange} className="Select" />}
            />
          </InputGroup>

          {/* 성별 섹션 */}
          <InputGroup>
            <Label>성별</Label>
            <GenderSelection>
              <GenderButton type="button" $selected={selectedGender === 'M'} onClick={() => handleGenderSelect('M')}>
                남성
              </GenderButton>
              <GenderButton type="button" $selected={selectedGender === 'F'} onClick={() => handleGenderSelect('F')}>
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
                {...methods.register('height')}
                placeholder="예) 175.8"
                step="0.1"
              />
              <UnitText>cm</UnitText>
            </InputWithUnit>
          </InputGroup>

          {/* 목표 섹션 (컴포넌트가 있다고 가정) */}
          <InputGroup>
            <Label>목표</Label>
            <Wrapper>
              <Button type="button">
                <List>
                  {categories.map((cat) => (
                    <Item
                      key={cat}
                      selected={selected === cat}
                      onClick={(e) => {
                        e.preventDefault(); // submit 방지
                        handleGoalSelect(cat);
                      }}
                    >
                      {cat}
                    </Item>
                  ))}
                </List>
              </Button>
            </Wrapper>
          </InputGroup>

          <SubmitButton type="submit" disabled={isLoading}>
            내 정보 변경
          </SubmitButton>
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

  background: ${({ $selected, theme }) => ($selected ? theme.colors.secondary : 'transparent')};
  color: ${({ $selected, theme }) => ($selected ? theme.colors.white : theme.colors.primary)};

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
