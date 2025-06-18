import React, { useState } from 'react'; // useEffect는 이제 필요 없습니다.
import CategoryMenu from '/src/components/CategoryMenu';
import RegionFilterComponent from '/src/components/filter/RegionFilter'; // RegionFilterComponent 경로 확인
import RecommendedExerciseSection from '../../components/TitleBar';
import styled from 'styled-components';
import BasicFilter from '../../components/filter/BasicFilter';
import CoachListItem from '../../components/CoachMatching/CoachListItem';
import theme from '../../styles/theme';
import { Link } from 'react-router-dom';
import Pagination from '../../components/Pagination';

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
  // availableRegions 상태는 RegionFilterComponent에서 직접 관리하므로 여기서는 필요 없습니다.

  // BasicFilter states (search and status)
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('전체');

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 7;

  // **수정된 하드코딩된 트레이너 데이터**
  // RegionFilterComponent의 regions 배열에 있는 지역명과 일치시키거나,
  // 해당 지역명을 포함하도록 location 값을 변경합니다.
  const coaches = [
    {
      id: 1,
      name: '김성은',
      specialization: '헬스 전문',
      location: '서울 강남구', // '서울'로 필터링 가능
      status: '활동중',
      rating: 4.5,
      reviews: 1795,
      imageUrl: 'https://via.placeholder.com/64x64?text=Coach1',
    },
    {
      id: 2,
      name: '이수진',
      specialization: '헬스 전문',
      location: '인천 연수구', // '인천'으로 필터링 가능
      status: '활동중',
      rating: 4.2,
      reviews: 1200,
      imageUrl: 'https://via.placeholder.com/64x64?text=Coach2',
    },
    {
      id: 3,
      name: '박민준',
      specialization: '요가 전문',
      location: '강원도 강릉시', // '강원도'로 필터링 가능
      status: '휴면',
      rating: 0.0,
      reviews: 0,
      imageUrl: '/public/img/minju.png',
    },
    {
      id: 4,
      name: '최유리',
      specialization: '요가 전문',
      location: '충북 청주시', // '충북'으로 필터링 가능
      status: '활동중',
      rating: 4.8,
      reviews: 2500,
      imageUrl: 'https://via.placeholder.com/64x64?text=Coach4',
    },
    {
      id: 5,
      name: '정하늘',
      specialization: '도수 전문',
      location: '경기도 화성시', // '경기도'로 필터링 가능
      status: '활동중',
      rating: 4.1,
      reviews: 900,
      imageUrl: '/public/img/hanuel.png',
    },
    {
      id: 6,
      name: '김예찬',
      specialization: '재활 전문',
      location: '경남 김해시', // '경남'으로 필터링 가능
      status: '휴면',
      rating: 2.5,
      reviews: 10,
      imageUrl: 'https://via.placeholder.com/64x64?text=Coach6',
    },
    {
      id: 7,
      name: '이지은',
      specialization: '도수 전문',
      location: '경북 경주시', // '경북'으로 필터링 가능
      status: '활동중',
      rating: 3.5,
      reviews: 300,
      imageUrl: 'https://via.placeholder.com/64x64?text=Coach7',
    },
    {
      id: 8,
      name: '박선영',
      specialization: '필라테스',
      location: '서울 마포구',
      status: '활동중',
      rating: 4.7,
      reviews: 800,
      imageUrl: 'https://via.placeholder.com/64x64?text=Coach8',
    },
    {
      id: 9,
      name: '강동원',
      specialization: '헬스 전문',
      location: '경기도 수원시',
      status: '활동중',
      rating: 4.0,
      reviews: 1100,
      imageUrl: 'https://via.placeholder.com/64x64?text=Coach9',
    },
    {
      id: 10,
      name: '송지효',
      specialization: '요가 전문',
      location: '경남 부산 해운대구',
      status: '활동중',
      rating: 4.9,
      reviews: 3000,
      imageUrl: 'https://via.placeholder.com/64x64?text=Coach10',
    },
    {
      id: 11,
      name: '유재석',
      specialization: '재활 전문',
      location: '경북 대구 수성구',
      status: '휴면',
      rating: 3.2,
      reviews: 50,
      imageUrl: 'https://via.placeholder.com/64x64?text=Coach11',
    },
    {
      id: 12,
      name: '김종국',
      specialization: '도수 전문',
      location: '광주 서구',
      status: '활동중',
      rating: 4.3,
      reviews: 600,
      imageUrl: 'https://via.placeholder.com/64x64?text=Coach12',
    },
    {
      id: 13,
      name: '전지현',
      specialization: '헬스 전문',
      location: '대전 유성구',
      status: '활동중',
      rating: 4.6,
      reviews: 1500,
      imageUrl: 'https://via.placeholder.com/64x64?text=Coach13',
    },
    {
      id: 14,
      name: '하정우',
      specialization: '필라테스',
      location: '울산 남구',
      status: '활동중',
      rating: 4.4,
      reviews: 750,
      imageUrl: 'https://via.placeholder.com/64x64?text=Coach14',
    },
    {
      id: 15,
      name: '공유',
      specialization: '요가 전문',
      location: '세종시', // RegionFilterComponent에 '세종'이 있다면 이렇게 변경
      status: '활동중',
      rating: 4.2,
      reviews: 900,
      imageUrl: 'https://via.placeholder.com/64x64?text=Coach15',
    },
    {
      id: 16,
      name: '김우빈',
      specialization: '재활 전문',
      location: '제주도 제주시', // RegionFilterComponent에 '제주'가 있다면 이렇게 변경
      status: '휴면',
      rating: 3.7,
      reviews: 120,
      imageUrl: 'https://via.placeholder.com/64x64?text=Coach16',
    },
    {
      id: 17,
      name: '이민호',
      specialization: '헬스 전문',
      location: '충남 천안시',
      status: '활동중',
      rating: 4.0,
      reviews: 200,
      imageUrl: 'https://via.placeholder.com/64x64?text=Coach17',
    },
    {
      id: 18,
      name: '수지',
      specialization: '필라테스',
      location: '전북 전주시',
      status: '활동중',
      rating: 4.3,
      reviews: 180,
      imageUrl: 'https://via.placeholder.com/64x64?text=Coach18',
    },
    {
      id: 19,
      name: '아이유',
      specialization: '요가 전문',
      location: '전남 목포시',
      status: '활동중',
      rating: 4.6,
      reviews: 250,
      imageUrl: 'https://via.placeholder.com/64x64?text=Coach19',
    },
  ];

  const basicFilterOptions = [
    {
      label: '상태',
      key: 'status',
      options: [
        { label: '전체', value: '전체' },
        { label: '활동중', value: 'active' },
        { label: '휴면', value: 'inactive' },
      ],
    },
  ];

  const handleBasicFilterChange = (filterKey, value) => {
    if (filterKey === 'search') {
      setSearchQuery(value);
    } else if (filterKey === 'status') {
      setSelectedStatus(value);
    }
    setCurrentPage(1);
  };

  // **수정된 필터링 로직: coach.location이 selectedRegion을 포함하는지 확인**
  const filteredCoaches = coaches.filter((coach) => {
    const matchesCategory = selectedCategory === '전체' || coach.specialization.startsWith(selectedCategory);

    // selectedRegion이 '전체'이거나, coach.location 문자열이 selectedRegion을 포함하는지 확인합니다.
    // 예를 들어, selectedRegion이 '경기'일 때 '경기도 화성시'를 포함하도록 합니다.
    const matchesRegion = selectedRegion === '전체' || coach.location.includes(selectedRegion);

    const matchesSearch = searchQuery === '' || coach.name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      selectedStatus === '전체' || coach.status === (selectedStatus === 'active' ? '활동중' : '휴면');

    return matchesCategory && matchesRegion && matchesSearch && matchesStatus;
  });

  const indexOfLastCoach = currentPage * postsPerPage;
  const indexOfFirstCoach = indexOfLastCoach - postsPerPage;
  const currentCoaches = filteredCoaches.slice(indexOfFirstCoach, indexOfLastCoach);

  const calculatedTotalPages = Math.ceil(filteredCoaches.length / postsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo(0, 0);
  };

  return (
    <>
      <PageWrapper>
        <RecommendedExerciseSection title={'핏코치 매칭'} />
        <ContentContainer>
          <SidebarWrapper>
            <CategoryMenu
              selectedCategory={selectedCategory}
              onSelectCategory={(category) => {
                setSelectedCategory(category);
                setCurrentPage(1);
              }}
            />
          </SidebarWrapper>

          <MainContentWrapper>
            {/* RegionFilterComponent는 변경할 필요 없음. regions prop 제거. */}
            <RegionFilterComponent
              selectedRegion={selectedRegion}
              onSelectRegion={(region) => {
                setSelectedRegion(region);
                setCurrentPage(1);
              }}
              // regions prop은 RegionFilterComponent에서 직접 관리하므로 여기서는 전달하지 않습니다.
            />

            <FilterAndSearchContainer>
              <BasicFilter
                filterOptions={basicFilterOptions}
                onFilterChange={handleBasicFilterChange}
                currentSearch={searchQuery}
                currentStatus={selectedStatus}
              />
            </FilterAndSearchContainer>

            <CoachListContainer>
              {currentCoaches.map((coach) => (
                <Link key={coach.id} to={`/coach/${coach.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <CoachListItem coach={coach} />
                </Link>
              ))}
            </CoachListContainer>

            <Pagination currentPage={currentPage} totalPages={calculatedTotalPages} onPageChange={handlePageChange} />
          </MainContentWrapper>
        </ContentContainer>
      </PageWrapper>
    </>
  );
};

export default CoachList;
