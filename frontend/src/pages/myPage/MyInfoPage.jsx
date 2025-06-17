import React, { useState } from 'react';
import styled from 'styled-components';
import ButtonStyle from '../../styles/common/Button';
import { Button, Item, List, Wrapper } from '../../styles/common/SelectGoal';
import * as S from '../../styles/common/SelectGoal';

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

const regions = {
  서울특별시: [
    '강남구',
    '강동구',
    '강북구',
    '강서구',
    '관악구',
    '광진구',
    '구로구',
    '금천구',
    '노원구',
    '도봉구',
    '동대문구',
    '동작구',
    '마포구',
    '서대문구',
    '서초구',
    '성동구',
    '성북구',
    '송파구',
    '양천구',
    '영등포구',
    '용산구',
    '은평구',
    '종로구',
    '중구',
    '중랑구',
  ],
  경기도: [
    '수원시',
    '성남시',
    '용인시',
    '고양시',
    '화성시',
    '안산시',
    '남양주시',
    '안양시',
    '평택시',
    '의정부시',
    '파주시',
    '시흥시',
    '광명시',
    '군포시',
    '하남시',
    '오산시',
    '이천시',
    '안성시',
    '김포시',
    '광주시',
    '양주시',
    '포천시',
    '여주시',
    '동두천시',
    '과천시',
    '가평군',
    '양평군',
    '연천군',
  ],
  부산광역시: [
    '강서구',
    '금정구',
    '남구',
    '동구',
    '동래구',
    '진구',
    '북구',
    '사상구',
    '사하구',
    '서구',
    '수영구',
    '연제구',
    '영도구',
    '중구',
    '해운대구',
    '기장군',
  ],
  대구광역시: ['남구', '달서구', '동구', '북구', '서구', '수성구', '중구', '달성군'],
  인천광역시: ['계양구', '남동구', '동구', '미추홀구', '부평구', '서구', '연수구', '중구', '강화군', '옹진군'],
  광주광역시: ['광산구', '남구', '동구', '북구', '서구'],
  대전광역시: ['대덕구', '동구', '서구', '유성구', '중구'],
  울산광역시: ['남구', '동구', '북구', '중구', '울주군'],
  세종특별자치시: ['세종시'],
  강원특별자치도: [
    '춘천시',
    '원주시',
    '강릉시',
    '동해시',
    '태백시',
    '속초시',
    '삼척시',
    '홍천군',
    '횡성군',
    '영월군',
    '평창군',
    '정선군',
    '철원군',
    '화천군',
    '양구군',
    '인제군',
    '고성군',
    '양양군',
  ],
  충청북도: [
    '청주시',
    '충주시',
    '제천시',
    '보은군',
    '옥천군',
    '영동군',
    '증평군',
    '진천군',
    '괴산군',
    '음성군',
    '단양군',
  ],
  충청남도: [
    '천안시',
    '공주시',
    '보령시',
    '아산시',
    '서산시',
    '논산시',
    '계룡시',
    '당진시',
    '금산군',
    '부여군',
    '서천군',
    '청양군',
    '홍성군',
    '예산군',
    '태안군',
  ],
  전라북도: [
    '전주시',
    '군산시',
    '익산시',
    '정읍시',
    '남원시',
    '김제시',
    '완주군',
    '진안군',
    '무주군',
    '장수군',
    '임실군',
    '순창군',
    '고창군',
    '부안군',
  ],
  전라남도: [
    '목포시',
    '여수시',
    '순천시',
    '나주시',
    '광양시',
    '담양군',
    '곡성군',
    '구례군',
    '고흥군',
    '보성군',
    '화순군',
    '장흥군',
    '강진군',
    '해남군',
    '영암군',
    '무안군',
    '함평군',
    '영광군',
    '장성군',
    '완도군',
    '진도군',
    '신안군',
  ],
  경상북도: [
    '포항시',
    '경주시',
    '김천시',
    '안동시',
    '구미시',
    '영주시',
    '영천시',
    '상주시',
    '문경시',
    '경산시',
    '군위군',
    '의성군',
    '청송군',
    '영양군',
    '영덕군',
    '청도군',
    '고령군',
    '성주군',
    '칠곡군',
    '예천군',
    '봉화군',
    '울진군',
    '울릉군',
  ],
  경상남도: [
    '창원시',
    '진주시',
    '통영시',
    '사천시',
    '김해시',
    '밀양시',
    '거제시',
    '양산시',
    '의령군',
    '함안군',
    '창녕군',
    '고성군',
    '남해군',
    '하동군',
    '산청군',
    '함양군',
    '거창군',
    '합천군',
  ],
  제주특별자치도: ['제주시', '서귀포시'],
};

const MyInfoPage = () => {
  const [selectedGender, setSelectedGender] = useState('');
  const [height, setHeight] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [isRegionModalOpen, setIsRegionModalOpen] = useState(false); // 지역 모달 상태
  const [selected, setSelected] = useState('근력향상');

  const handleProvinceSelect = (province) => {
    setSelectedProvince(province);
    setSelectedCity(''); // 도가 바뀌면 시/군/구 초기화
  };

  const handleCitySelect = (city) => {
    setSelectedCity(city);
    setIsRegionModalOpen(false); // 시/군/구 선택하면 모달 닫기
  };

  const handleRegionReset = () => {
    setSelectedProvince('');
    setSelectedCity('');
    setIsRegionModalOpen(false); // 모달 닫기
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('맞춤 정보 변경 처리');
    console.log({
      selectedGender,
      height,
      phone,
      selectedProvince,
      selectedCity,
    });
    // 여기에 맞춤 정보 변경 로직 (API 호출 등) 추가
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
            <RegionSelectionBox onClick={() => setIsRegionModalOpen(true)}>
              <SelectedRegionText $hasSelected={selectedProvince || selectedCity}>
                {selectedProvince && selectedCity
                  ? `${selectedProvince} ${selectedCity}`
                  : selectedProvince
                    ? selectedProvince
                    : '지역을 선택하세요'}
              </SelectedRegionText>
              {/* 드롭다운 아이콘 */}
              <span>▼</span>
            </RegionSelectionBox>
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

        {/* 지역 선택 모달 */}
        {isRegionModalOpen && (
          <ModalOverlay onClick={() => setIsRegionModalOpen(false)}>
            <RegionModalContent onClick={(e) => e.stopPropagation()}>
              {' '}
              {/* 모달 클릭 시 닫히지 않도록 이벤트 전파 중단 */}
              <ModalHeader>
                지역 선택
                <ResetButton onClick={handleRegionReset}>초기화</ResetButton>
              </ModalHeader>
              <ModalBody>
                <ProvinceList>
                  {Object.keys(regions).map((province) => (
                    <ListItem
                      key={province}
                      $isSelected={selectedProvince === province}
                      onClick={() => handleProvinceSelect(province)}
                    >
                      {province.replace(/특별자치시|광역시|특별자치도|도/, '')} {/* 짧은 이름 표시 */}
                    </ListItem>
                  ))}
                </ProvinceList>
                <CityList>
                  {selectedProvince &&
                    regions[selectedProvince].map((city) => (
                      <ListItem key={city} $isSelected={selectedCity === city} onClick={() => handleCitySelect(city)}>
                        {city}
                      </ListItem>
                    ))}
                </CityList>
              </ModalBody>
            </RegionModalContent>
          </ModalOverlay>
        )}
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
    background: ${({ selected, theme }) => (selected ? theme.colors.secondary : 'transparent')};
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
    background: ${({ theme }) => theme.colors.secondary}; /* Consistent hover effect */
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
