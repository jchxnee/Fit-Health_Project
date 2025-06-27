import React, { useState, useEffect } from 'react';
import CategoryMenu from '/src/components/CategoryMenu';
import RegionFilterComponent from '/src/components/filter/RegionFilter';
import RecommendedExerciseSection from '../../components/TitleBar';
import styled from 'styled-components';
import BasicFilter from '../../components/filter/BasicFilter';
import CoachListItem from '../../components/CoachMatching/CoachListItem';
import theme from '../../styles/theme';
import { Link, useLocation } from 'react-router-dom';
import Pagination from '../../components/Pagination';
import api from '../../api/axios';
import { API_ENDPOINTS } from '../../api/config';

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

const CoachList = () => {
  const location = useLocation();
  const initialCategory = location.state?.category || '전체';

  const [coaches, setCoaches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);

  const [selectedRegion, setSelectedRegion] = useState('전체');

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('전체');

  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 7;

  useEffect(() => {
    const fetchTrainers = async () => {
      try {
        setLoading(true);
        const response = await api.get(API_ENDPOINTS.COACH.LIST);
        setCoaches(response.data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch trainers:', err);
        setError('트레이너 정보를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchTrainers();
  }, []);

  const basicFilterOptions = [
    {
      label: '상태',
      key: 'status',
      options: [
        { label: '전체', value: '전체' },
        { label: '활동중', value: 'Y' },
        { label: '휴면', value: 'N' },
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

  const filteredCoaches = coaches.filter((trainerDto) => {
    const matchesCategory =
      selectedCategory === '전체' || (trainerDto.majorName && trainerDto.majorName.startsWith(selectedCategory));

    const trimmedSelectedRegion = selectedRegion.trim();
    const trimmedWishArea = trainerDto.wishArea ? trainerDto.wishArea.trim() : '';

    let regionMatch = false;
    if (trimmedSelectedRegion === '전체') {
      regionMatch = true;
    } else {
      let fullRegionName = trimmedSelectedRegion;
      switch (trimmedSelectedRegion) {
        case '전남':
          fullRegionName = '전라남도';
          break;
        case '전북':
          fullRegionName = '전라북도';
          break;
        case '경남':
          fullRegionName = '경상남도';
          break;
        case '경북':
          fullRegionName = '경상북도';
          break;
        case '충남':
          fullRegionName = '충청남도';
          break;
        case '충북':
          fullRegionName = '충청북도';
          break;
        case '강원':
          fullRegionName = '강원특별자치도';
          break;
        case '제주':
          fullRegionName = '제주특별자치도';
          break;
      }
      regionMatch = trimmedWishArea.startsWith(fullRegionName);
    }
    const matchesRegion = regionMatch;

    const matchesSearch =
      searchQuery === '' ||
      (trainerDto.trainerName && trainerDto.trainerName.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = selectedStatus === '전체' || (trainerDto.status && trainerDto.status === selectedStatus);

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

  if (loading) {
    return (
      <PageWrapper>
        <div>트레이너 목록을 불러오는 중...</div>
      </PageWrapper>
    );
  }

  if (error) {
    return (
      <PageWrapper>
        <div>오류: {error}</div>
      </PageWrapper>
    );
  }

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
            <RegionFilterComponent
              selectedRegion={selectedRegion}
              onSelectRegion={(region) => {
                setSelectedRegion(region);
                setCurrentPage(1);
              }}
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
              {currentCoaches.length > 0 ? (
                currentCoaches.map((trainerDto) => (
                  <Link
                    key={trainerDto.trainerNo}
                    to={`/coach/${trainerDto.trainerNo}`}
                    style={{ textDecoration: 'none', color: 'inherit' }}
                  >
                    <CoachListItem
                      coach={{
                        id: trainerDto.trainerNo,
                        name: trainerDto.trainerName,
                        specialization: trainerDto.majorName,
                        location: trainerDto.wishArea,
                        rating: trainerDto.rating,
                        reviews: trainerDto.reviews,
                        imageUrl: trainerDto.profileImg,
                      }}
                    />
                  </Link>
                ))
              ) : (
                <div>조건에 맞는 트레이너를 찾을 수 없습니다.</div>
              )}
            </CoachListContainer>

            <Pagination currentPage={currentPage} totalPages={calculatedTotalPages} onPageChange={handlePageChange} />
          </MainContentWrapper>
        </ContentContainer>
      </PageWrapper>
    </>
  );
};

export default CoachList;
