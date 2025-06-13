import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import TitleBar from '../../components/TitleBar';

// Mock job data (replace with actual API call in a real application)
const ALL_JOB_LISTINGS = [
  {
    id: 1,
    title: 'AD Sales Manager - 광고영업',
    category: 'Business',
    experience: '경력 3년 이상',
    employmentType: '정규직',
  },
  {
    id: 2,
    title: 'Accounting Manager - 재무',
    category: 'Business',
    experience: '경력 5년 이상',
    employmentType: '정규직',
  },
  {
    id: 3,
    title: 'Marketing Designer - 마케팅',
    category: 'Marketing',
    experience: '경력 무관',
    employmentType: '정규직',
  },
  {
    id: 4,
    title: 'Software Frontend - 웹 페이지',
    category: 'Engineer',
    experience: '경력 4년 이상',
    employmentType: '정규직',
  },
  {
    id: 5,
    title: 'Software Backend - 매칭 시스템',
    category: 'Engineer',
    experience: '경력 7년 이상',
    employmentType: '정규직',
  },
  {
    id: 6,
    title: 'Security Manager - 보안',
    category: 'Security',
    experience: '경력 10년 이상',
    employmentType: '정규직',
  },
  {
    id: 7,
    title: 'Product Manager - 서비스 기획',
    category: 'Product',
    experience: '경력 5년 이상',
    employmentType: '정규직',
  },
  {
    id: 8,
    title: 'UI/UX Designer - 프로덕트 디자인',
    category: 'Design',
    experience: '경력 3년 이상',
    employmentType: '정규직',
  },
  { id: 9, title: 'HR Manager - 인사', category: 'HR', experience: '경력 7년 이상', employmentType: '정규직' },
];

const RecruitmentInfoPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedExperience, setSelectedExperience] = useState('');
  const [selectedEmploymentType, setSelectedEmploymentType] = useState('');
  const [filteredJobListings, setFilteredJobListings] = useState(ALL_JOB_LISTINGS);

  useEffect(() => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    const newFilteredList = ALL_JOB_LISTINGS.filter((job) => {
      const matchesSearch =
        job.title.toLowerCase().includes(lowerCaseSearchTerm) ||
        job.category.toLowerCase().includes(lowerCaseSearchTerm);
      const matchesExperience = selectedExperience === '' || job.experience === selectedExperience;
      const matchesEmploymentType = selectedEmploymentType === '' || job.employmentType === selectedEmploymentType;

      return matchesSearch && matchesExperience && matchesEmploymentType;
    });
    setFilteredJobListings(newFilteredList);
  }, [searchTerm, selectedExperience, selectedEmploymentType]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleExperienceChange = (e) => {
    setSelectedExperience(e.target.value);
  };

  const handleEmploymentTypeChange = (e) => {
    setSelectedEmploymentType(e.target.value);
  };

  return (
    <PageContainer>
      <MainContent>
        <TitleBar title={'채용 공고'} />
        <PageHeading>
          저희 FIT:HEALTH와 함께 성장해나갈 <br />
          소중한 인재를 모집합니다!
        </PageHeading>

        <SearchBarContainer>
          <SearchInput type="text" placeholder="직군 검색" value={searchTerm} onChange={handleSearchChange} />
          <SelectDropdown value={selectedExperience} onChange={handleExperienceChange}>
            <option value="">경력사항</option>
            <option value="경력 무관">경력 무관</option>
            <option value="경력 3년 이상">3년 이상</option>
            <option value="경력 4년 이상">4년 이상</option>
            <option value="경력 5년 이상">5년 이상</option>
            <option value="경력 7년 이상">7년 이상</option>
            <option value="경력 10년 이상">10년 이상</option>
          </SelectDropdown>
          <SelectDropdown value={selectedEmploymentType} onChange={handleEmploymentTypeChange}>
            <option value="">고용형태</option>
            <option value="정규직">정규직</option>
            <option value="계약직">계약직</option>
          </SelectDropdown>
        </SearchBarContainer>

        <JobListingGrid>
          {filteredJobListings.length > 0 ? (
            filteredJobListings.map((job) => (
              <JobCard key={job.id}>
                <JobTitle>{job.title}</JobTitle>
                <JobDetails>
                  {job.category} | {job.experience} | {job.employmentType} | FIT:HEALTH
                </JobDetails>
              </JobCard>
            ))
          ) : (
            <NoResultsText>검색 결과가 없습니다.</NoResultsText>
          )}
        </JobListingGrid>

        <MoreInfoText>이 외에 추가 채용은 추후 공지 예정입니다.</MoreInfoText>
      </MainContent>
    </PageContainer>
  );
};

export default RecruitmentInfoPage;

const PageContainer = styled.div`
  font-family: 'Noto Sans KR', sans-serif;
  color: ${({ theme }) => theme.colors.primary}; /* 기본 텍스트 색상 */
  line-height: 1.6;
  text-align: left;
  display: flex;
  flex-direction: column;
  align-items: center; /* 전체 콘텐츠를 중앙에 정렬하기 위함 */
`;

const MainContent = styled.main`
  width: 100%;
  max-width: ${({ theme }) => theme.width.lg}; /* 컨텐츠 최대 너비 */
  padding: ${({ theme }) => theme.spacing['8']} ${({ theme }) => theme.spacing['5']}; /* 상하 32px, 좌우 20px */
  display: flex;
  flex-direction: column;
  align-items: center; /* 내부 요소들을 중앙에 정렬 */
`;

const PageHeading = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes['3xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.primary};
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing['10']}; /* 40px */
  line-height: 1.3;
`;

const SearchBarContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing['2']}; /* 8px */
  margin-bottom: ${({ theme }) => theme.spacing['16']}; /* 64px */
  align-items: center;

  @media (max-width: ${({ theme }) => theme.width.md}) {
    /* md (768px) 기준 */
    flex-direction: column;
    width: 100%;
  }
`;

const SearchInput = styled.input`
  padding: ${({ theme }) => theme.spacing['2']} ${({ theme }) => theme.spacing['3']}; /* 8px 12px */
  border: 1px solid ${({ theme }) => theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.base}; /* 4px */
  font-size: ${({ theme }) => theme.fontSizes.base}; /* 16px */
  color: ${({ theme }) => theme.colors.primary};
  flex-grow: 1; /* 남은 공간을 채우도록 */
  min-width: 180px; /* 최소 너비 설정 */

  &::placeholder {
    color: ${({ theme }) => theme.colors.gray[500]};
  }

  @media (max-width: ${({ theme }) => theme.width.md}) {
    width: 100%;
  }
`;

const SelectDropdown = styled.select`
  padding: ${({ theme }) => theme.spacing['2']} ${({ theme }) => theme.spacing['3']}; /* 8px 12px */
  border: 1px solid ${({ theme }) => theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.base}; /* 4px */
  font-size: ${({ theme }) => theme.fontSizes.base}; /* 16px */
  color: ${({ theme }) => theme.colors.primary};
  background-color: ${({ theme }) => theme.colors.white};
  cursor: pointer;

  @media (max-width: ${({ theme }) => theme.width.md}) {
    width: 100%;
  }
`;

const JobListingGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* 3열 그리드 */
  gap: ${({ theme }) => theme.spacing['5']}; /* 20px */
  width: 100%;
  max-width: ${({ theme }) => theme.width.lg}; /* 전체 페이지 컨테이너 너비와 동일하게 */

  @media (max-width: 1024px) {
    /* 3열 유지하기 위한 특정 브레이크포인트 */
    grid-template-columns: repeat(2, 1fr); /* 2열로 변경 */
  }

  @media (max-width: ${({ theme }) => theme.width.sm}) {
    /* sm (576px) 기준 */
    grid-template-columns: 1fr; /* 1열로 변경 */
  }
`;

const JobCard = styled.div`
  background-color: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  border-radius: ${({ theme }) => theme.borderRadius.base}; /* 4px */
  padding: ${({ theme }) => theme.spacing['5']}; /* 20px */
  box-shadow: ${({ theme }) => theme.shadows.sm};
  display: flex;
  flex-direction: column;
  justify-content: space-between; /* 내용이 상단에 정렬되도록 */
  min-height: 120px; /* 카드 최소 높이 */
  transition:
    transform 0.2s ease-in-out,
    box-shadow 0.2s ease-in-out;

  &:hover {
    transform: translateY(-${({ theme }) => theme.spacing['1']}); /* 4px 위로 */
    box-shadow: ${({ theme }) => theme.shadows.md};
  }
`;

const JobTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.xl}; /* 20px */
  font-weight: ${({ theme }) => theme.fontWeights.semibold}; /* 600 */
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing['2']}; /* 8px */
  text-align: left;
`;

const JobDetails = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.sm}; /* 14px */
  color: ${({ theme }) => theme.colors.gray[600]}; /* 좀 더 연한 회색 */
  margin-top: auto; /* 하단에 붙도록 */
  text-align: left;
`;

const MoreInfoText = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.base}; /* 16px */
  color: ${({ theme }) => theme.colors.gray[600]};
  margin-top: ${({ theme }) => theme.spacing['20']}; /* 80px */
  text-align: center;
`;

const NoResultsText = styled.p`
  grid-column: 1 / -1; /* Span across all columns */
  text-align: center;
  font-size: ${({ theme }) => theme.fontSizes.lg};
  color: ${({ theme }) => theme.colors.gray[500]};
  margin-top: ${({ theme }) => theme.spacing['10']};
`;
