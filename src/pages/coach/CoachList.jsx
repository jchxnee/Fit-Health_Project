import React, { useState } from 'react';
import CategoryMenu from '/src/components/CategoryMenu';
import RegionFilter from '/src/components/filter/RegionFilter';
import RecommendedExerciseSection from '../../components/TitleBar';
import styled from 'styled-components';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import BasicFilter from '../../components/filter/BasicFilter';
import CoachListItem from '../../components/CoachMatching/CoachListItem';
import theme from '../../styles/theme';
import betaImg from '../../assets/beta_user_img.png'; // 이미지 경로에 맞게 수정
import { Link } from 'react-router-dom';

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  min-height: 100vh;
  background-color: ${theme.colors.white};
<<<<<<<< HEAD:src/pages/CoachMatching/CoachList.jsx
  margin-top: ${theme.spacing[5]};
========
>>>>>>>> 6f68e5b22b58a0819ed05e3f7274946804b4d07d:src/pages/coach/CoachList.jsx
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
`;

const CoachList = () => {
  const [user] = useState({ name: '김현아', img: betaImg });
  const [filters, setFilters] = useState({
    search: '',
    status: '전체',
    region: '전체',
  });

  const filterOptions = [
    {
      label: '상태',
      key: 'status',
      options: [
        { label: '전체', value: '전체' },
        { label: '활동중', value: 'active' },
        { label: '휴면', value: 'inactive' },
      ],
    },
    {
      label: '지역',
      key: 'region',
      options: [
        { label: '전체', value: '전체' },
        { label: '서울', value: '서울' },
        { label: '경기도', value: '경기도' },
        { label: '인천', value: '인천' },
        { label: '강원도', value: '강원도' },
        { label: '충북', value: '충북' },
        { label: '충남', value: '충남' },
        { label: '전북', value: '전북' },
        { label: '전남', value: '전남' },
        { label: '경북', value: '경북' },
        { label: '경남', value: '경남' },
        { label: '제주', value: '제주' },
      ],
    },
  ];

  const handleFilterChange = (filterKey, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filterKey]: value,
    }));
    console.log(`필터 변경: ${filterKey} = ${value}, 현재 필터 상태:`, { ...filters, [filterKey]: value });
  };

  const coaches = [
    {
      id: 1,
      name: '김성은',
      specialization: '헬스 전문',
      location: '서울특별시 강남구',
      rating: 3.8,
      reviews: 1795,
      imageUrl: 'https://via.placeholder.com/64x64?text=Coach1',
    },
    {
      id: 2,
      name: '김성은',
      specialization: '폭식 전문',
      location: '인천시 연수구',
      rating: 3.8,
      reviews: 1795,
      imageUrl: 'https://via.placeholder.com/64x64?text=Coach2',
    },
    {
      id: 3,
      name: '김민주',
      specialization: '요가 전문',
      location: '강원도 강릉시',
      rating: 3.8,
      reviews: 1795,
      imageUrl: '/public/img/minju.png',
    },
    {
      id: 4,
      name: '진유나',
      specialization: '요가/헬스 전문',
      location: '충북 청주시',
      rating: 3.8,
      reviews: 1795,
      imageUrl: 'https://via.placeholder.com/64x64?text=Coach4',
    },
    {
      id: 5,
      name: '원하늘',
      specialization: '도수 전문',
      location: '경기도 화성시',
      rating: 3.8,
      reviews: 1795,
      imageUrl: '/public/img/hanuel.png',
    },
    {
      id: 6,
      name: '최예찬',
      specialization: '도수/재활 전문',
      location: '경북 경주시',
      rating: 3.9,
      reviews: 1786,
      imageUrl: 'https://via.placeholder.com/64x64?text=Coach6',
    },
    {
      id: 7,
      name: '이재명',
      specialization: '김장 전문',
      location: '전남 여수시',
      rating: 3.6,
      reviews: 1786,
      imageUrl: 'https://via.placeholder.com/64x64?text=Coach7',
    },
  ];

  return (
    <>
      <Header user={user} />

      <PageWrapper>
        <RecommendedExerciseSection title={'핏코치 매칭'} />
        <ContentContainer>
          <SidebarWrapper>
            <CategoryMenu />
          </SidebarWrapper>

          <MainContentWrapper>
            <RegionFilter />

            <FilterAndSearchContainer>
              <BasicFilter filterOptions={filterOptions} onFilterChange={handleFilterChange} />
            </FilterAndSearchContainer>
            <CoachListContainer>
              {coaches.map((coach) => (
                <Link key={coach.id} to={`/coach/${coach.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <CoachListItem coach={coach} />
                </Link>
              ))}
            </CoachListContainer>
          </MainContentWrapper>
        </ContentContainer>
      </PageWrapper>
      <Footer />
    </>
  );
};

export default CoachList;
