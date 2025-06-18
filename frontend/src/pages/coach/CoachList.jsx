import React, { useState } from 'react';
import CategoryMenu from '/src/components/CategoryMenu';
import RegionFilterComponent from '/src/components/filter/RegionFilter';
import RecommendedExerciseSection from '../../components/TitleBar';
import styled from 'styled-components';
import BasicFilter from '../../components/filter/BasicFilter';
import CoachListItem from '../../components/CoachMatching/CoachListItem';
import theme from '../../styles/theme';
import { Link } from 'react-router-dom';

// --- (Styled Components remain unchanged) ---
const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  min-height: 100vh;
  background-color: ${theme.colors.white};
  margin-bottom: 100px;
`;

const ContentContainer = styled.div`
  display: flex;
  width: ${theme.width.lg};
  margin: 0 auto;
  box-sizing: border-box;
  background-color: ${theme.colors.white};
`;

const SidebarWrapper = styled.div`
  flex-shrink: 0;
  width: 200px;
  padding-right: ${theme.spacing[8]};
  background-color: ${theme.colors.white};
  margin-top: ${theme.spacing[8]};
`;

const MainContentWrapper = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const FilterAndSearchContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  width: 100%;
  margin-bottom: ${theme.spacing[2]};
  margin-top: ${theme.spacing[5]};
`;

const CoachListContainer = styled.div`
  width: 100%;
  background-color: ${theme.colors.white};
  border: 1px solid ${theme.colors.gray[200]};
  border-radius: ${theme.borderRadius.md};
  overflow: hidden;

  display: flex;
  flex-direction: column;

  & > a {
    text-decoration: none;
    color: inherit;
    display: block;

    &:not(:last-of-type) {
      border-bottom: 1px solid ${theme.colors.gray[200]};
    }
  }
`;
// --- (End of Styled Components) ---

const CoachList = () => {
  // Category filter state
  const [selectedCategory, setSelectedCategory] = useState('전체');

  // Region filter state
  const [selectedRegion, setSelectedRegion] = useState('전체');

  // BasicFilter states (search and status)
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('전체'); // Corresponds to the '상태' filter

  // `BasicFilter`에 전달할 필터 옵션 정의
  // '상태' 필터는 여기서 그대로 사용하고, '지역'은 별도의 RegionFilterComponent에서 관리합니다.
  const basicFilterOptions = [
    {
      label: '상태',
      key: 'status', // 이 key를 사용하여 onFilterChange에서 상태를 업데이트합니다.
      options: [
        { label: '전체', value: '전체' },
        { label: '활동중', value: 'active' },
        { label: '휴면', value: 'inactive' },
      ],
    },
  ];

  // `BasicFilter`의 `onFilterChange` 핸들러
  const handleBasicFilterChange = (filterKey, value) => {
    if (filterKey === 'search') {
      setSearchQuery(value);
    } else if (filterKey === 'status') {
      setSelectedStatus(value);
    }
    // console.log(`BasicFilter 변경: ${filterKey} = ${value}`); // 디버깅용
  };

  const coaches = [
    {
      id: 1,
      name: '김성은',
      specialization: '헬스 전문',
      location: '서울특별시 강남구',
      status: '활동중',
      rating: 3.8,
      reviews: 1795,
      imageUrl: 'https://via.placeholder.com/64x64?text=Coach1',
    },
    {
      id: 2,
      name: '김성은',
      specialization: '헬스 전문',
      location: '인천시 연수구',
      status: '활동중',
      rating: 3.8,
      reviews: 1795,
      imageUrl: 'https://via.placeholder.com/64x64?text=Coach2',
    },
    {
      id: 3,
      name: '김민주',
      specialization: '요가 전문',
      location: '강원도 강릉시',
      status: '휴면',
      rating: 3.8,
      reviews: 1795,
      imageUrl: '/public/img/minju.png',
    },
    {
      id: 4,
      name: '진유나',
      specialization: '요가 전문',
      location: '충북 청주시',
      status: '활동중',
      rating: 3.8,
      reviews: 1795,
      imageUrl: 'https://via.placeholder.com/64x64?text=Coach4',
    },
    {
      id: 5,
      name: '원하늘',
      specialization: '도수 전문',
      location: '경기도 화성시',
      status: '활동중',
      rating: 3.8,
      reviews: 1795,
      imageUrl: '/public/img/hanuel.png',
    },
    {
      id: 6,
      name: '최예찬',
      specialization: '재활 전문',
      location: '경북 경주시',
      status: '휴면',
      rating: 3.9,
      reviews: 1786,
      imageUrl: 'https://via.placeholder.com/64x64?text=Coach6',
    },
    {
      id: 7,
      name: '이재명',
      specialization: '도수 전문',
      location: '전남 여수시',
      status: '활동중',
      rating: 3.6,
      reviews: 1786,
      imageUrl: 'https://via.placeholder.com/64x64?text=Coach7',
    },
  ];

  // 모든 필터를 적용하는 로직
  const filteredCoaches = coaches.filter((coach) => {
    // 1. Category Filter
    const matchesCategory = selectedCategory === '전체' || coach.specialization.startsWith(selectedCategory);

    // 2. Region Filter
    const matchesRegion = selectedRegion === '전체' || coach.location.startsWith(selectedRegion);

    // 3. Search Filter (by name)
    const matchesSearch = searchQuery === '' || coach.name.toLowerCase().includes(searchQuery.toLowerCase());

    // 4. Status Filter
    const matchesStatus =
      selectedStatus === '전체' || coach.status === (selectedStatus === 'active' ? '활동중' : '휴면');

    return matchesCategory && matchesRegion && matchesSearch && matchesStatus;
  });

  return (
    <>
      <PageWrapper>
        <RecommendedExerciseSection title={'핏코치 매칭'} />
        <ContentContainer>
          <SidebarWrapper>
            <CategoryMenu selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} />
          </SidebarWrapper>

          <MainContentWrapper>
            <RegionFilterComponent selectedRegion={selectedRegion} onSelectRegion={setSelectedRegion} />

            <FilterAndSearchContainer>
              <BasicFilter
                filterOptions={basicFilterOptions} // '상태' 필터만 전달
                onFilterChange={handleBasicFilterChange}
                currentSearch={searchQuery} // 현재 검색어 값을 BasicFilter에 전달하여 Input에 반영
                currentStatus={selectedStatus} // 현재 상태 값을 BasicFilter에 전달하여 Dropdown에 반영
              />
            </FilterAndSearchContainer>
            <CoachListContainer>
              {filteredCoaches.map((coach) => (
                <Link key={coach.id} to={`/coach/${coach.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <CoachListItem coach={coach} />
                </Link>
              ))}
            </CoachListContainer>
          </MainContentWrapper>
        </ContentContainer>
      </PageWrapper>
    </>
  );
};

export default CoachList;
