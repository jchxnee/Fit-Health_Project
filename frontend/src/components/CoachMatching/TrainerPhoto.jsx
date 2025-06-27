import React from 'react';
import styled from 'styled-components';
import theme from '../../styles/theme';
import { API_BASE_URL } from '../../api/config';

const PhotoContainer = styled.div`
    width: ${theme.width.lg};
    margin-top: ${theme.spacing[5]};
    border-top: 1px solid ${theme.colors.gray[200]};
`;

const PhotoGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: ${theme.spacing[4]};
    padding: ${theme.spacing[5]} 0;
`;

const PhotoItem = styled.div`
    width: 100%;
    padding-top: 100%; /* 1:1 Aspect Ratio */
    position: relative;
    border-radius: ${theme.borderRadius.md};
    overflow: hidden;
`;

const Image = styled.img`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover; /* 이미지가 컨테이너를 꽉 채우도록 */
`;

const Title = styled.h2`
    font-size: ${theme.fontSizes['2xl']};
    font-weight: bold;
    color: ${theme.colors.text};
    text-align: left;
    margin-bottom: ${theme.spacing[4]};
    margin-top: ${theme.spacing[5]};
`;

const TrainerPhoto = ({ photos }) => {
  if (!photos || photos.length === 0) {
    return (
      <PhotoContainer>
        <Title>트레이너 사진</Title>
        <p>등록된 사진이 없습니다.</p>
      </PhotoContainer>
    );
  }

  return (
    <PhotoContainer>
      <Title>트레이너 사진</Title>
      <PhotoGrid>
        {photos.map((photo, index) => (
          <PhotoItem key={index}>
            <Image
              src={`${API_BASE_URL}/api/images/${photo.changeName}`}
              alt={photo.originName}
            />
          </PhotoItem>
        ))}
      </PhotoGrid>
    </PhotoContainer>
  );
};

export default TrainerPhoto;
