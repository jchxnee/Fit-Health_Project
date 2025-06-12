import React from 'react';
import styled from 'styled-components';
import theme from '../../styles/theme';

const CoursePriceContainer = styled.div`
  width: ${theme.width.lg};
  max-width: 100%;
  margin: ${theme.spacing[10]} auto;
  padding: ${theme.spacing[6]};
  background-color: ${theme.colors.white};
  border-radius: ${theme.borderRadius.lg};
  box-shadow: ${theme.shadows.base};
`;

const CourseHeader = styled.div`
  text-align: center;
  margin-bottom: ${theme.spacing[6]};
`;

const CourseTitle = styled.h3`
  font-size: ${theme.fontSizes['2xl']};
  font-weight: ${theme.fontWeights.bold};
  color: ${theme.colors.gray[900]};
  margin-bottom: ${theme.spacing[2]};
`;

const Disclaimer = styled.div`
  background-color: ${theme.colors.gray[100]};
  padding: ${theme.spacing[4]};
  border-radius: ${theme.borderRadius.md};
  font-size: ${theme.fontSizes.base};
  color: ${theme.colors.gray[700]};
  text-align: center;
  margin-bottom: ${theme.spacing[6]};
`;

const CourseItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${theme.spacing[4]} ${theme.spacing[6]};
  border-bottom: 1px solid ${theme.colors.gray[200]};
  margin-bottom: 20px;
  &:last-child {
    border-bottom: none;
  }
`;

const CourseLeft = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const CourseCount = styled.span`
  font-size: ${theme.fontSizes.xl};
  font-weight: ${theme.fontWeights.bold};
  color: ${theme.colors.gray[900]};
`;

const CourseDescription = styled.span`
  font-size: ${theme.fontSizes.base};
  color: ${theme.colors.gray[700]};
`;

const CourseRight = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

const CoursePriceText = styled.span`
  font-size: ${theme.fontSizes.xl};
  font-weight: ${theme.fontWeights.bold};
  color: ${theme.colors.primary};
`;

const DiscountText = styled.span`
  font-size: ${theme.fontSizes.sm};
  font-weight: ${theme.fontWeights.semibold};
  color: ${theme.colors.danger};
`;

const BottomInfo = styled.p`
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.gray[500]};
  text-align: center;
  margin-top: ${theme.spacing[6]};
`;

const TrainerCourse = ({ courses }) => {
  return (
    <CoursePriceContainer>
      <CourseHeader>
        <CourseTitle>P.T 코스표 (모든 코스는 30분 기준)</CourseTitle>
      </CourseHeader>
      <Disclaimer>
        고객님들의 여러 요청사항을 적극 수용하며 건강상태를 고려한 최적의 운동스케줄을 제공하겠습니다.
      </Disclaimer>

      {courses.map((course, index) => (
        <CourseItem key={index}>
          <CourseLeft>
            <CourseCount>{course.count}</CourseCount>
            <CourseDescription>{course.description}</CourseDescription>
          </CourseLeft>
          <CourseRight>
            {course.price && <CoursePriceText>{course.price}</CoursePriceText>}
            {course.discount && <DiscountText>할인율 : {course.discount}</DiscountText>}
          </CourseRight>
        </CourseItem>
      ))}

      <BottomInfo>
        상위 표는 해당 핏코치가 설정한 할인율입니다. 고객님이 선택해주신 횟수에 할인율이 적용됩니다.
      </BottomInfo>
    </CoursePriceContainer>
  );
};

export default TrainerCourse;
