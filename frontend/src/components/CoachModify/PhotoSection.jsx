import React from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { toast } from 'react-toastify';
import api from '../../api/axios';
import { getUploadUrl, uploadFileToS3 } from '../../api/file';

const Section = styled.section`
  width: 100%;
  padding: 0 12px;
`;
const TopRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
`;
const Label = styled.div`
  font-weight: 600;
  font-size: 18px;
  color: #222;
`;
const PhotoRow = styled.div`
  display: flex;
  gap: 30px;
  flex-wrap: wrap;
`;
const PhotoBox = styled.div`
  width: 200px;
  height: 200px;
  border: 1.5px solid #d1d5db;
  border-radius: 8px;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
`;
const PreviewImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;
const RemoveButton = styled.button`
  position: absolute;
  top: 5px;
  right: 5px;
  background: #ff4d4f;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 2px 6px;
  cursor: pointer;
  font-size: 12px;
`;
const UploadInput = styled.input`
  display: none;
`;
const UploadLabel = styled.label`
  width: 200px;
  height: 200px;
  border: 1.5px dashed #d1d5db;
  border-radius: 8px;
  background: #fafafa;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
  color: #bbb;
  cursor: pointer;
`;

const CLOUDFRONT_URL = 'https://ddmqhun0kguvt.cloudfront.net/';

function PhotoSection({ photos, setPhotos }) {
  const handleAddPhoto = async (e) => {
    const files = Array.from(e.target.files);
    for (let file of files) {
      try {
        // 1. presigned URL 요청
        const { presignedUrl, changeName } = await getUploadUrl(file.name, file.type, 'trainer/');
        if (!presignedUrl || !changeName) {
          toast.error('S3 업로드 URL 요청 실패');
          continue;
        }

        // 2. S3 직접 업로드
        await uploadFileToS3(presignedUrl, file);
        console.log(`[PhotoSection] S3 업로드 성공: ${file.name}`);

        // 3. CloudFront 기반 preview 설정
        const newPhoto = {
          file,
          preview: changeName, // changeName만 저장하고 렌더링에서 CloudFront 붙임
          uploadedFileName: changeName,
          originName: file.name,
          changeName: changeName,
        };

        setPhotos((prev) => [...prev, newPhoto]);
      } catch (err) {
        console.error('사진 업로드 실패:', err);
        toast.error(`사진 업로드 실패`);
      }
    }
  };

  const handleRemovePhoto = (index) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <Section>
      <TopRow>
        <Label>사진 등록(자격증 및 프로필)</Label>
      </TopRow>
      <PhotoRow>
        {photos.map((photo, index) => (
          <PhotoBox key={index}>
            <PreviewImage src={`${CLOUDFRONT_URL}${photo.preview}?v=${Date.now()}`} alt="preview" />
            <RemoveButton onClick={() => handleRemovePhoto(index)}>X</RemoveButton>
          </PhotoBox>
        ))}
        <UploadLabel htmlFor="photo-upload">+</UploadLabel>
        <UploadInput id="photo-upload" type="file" multiple accept="image/*" onChange={handleAddPhoto} />
      </PhotoRow>
    </Section>
  );
}

export default PhotoSection;
