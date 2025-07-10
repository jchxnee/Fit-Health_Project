import api from './axios';

// 파일 업로드용 presigned url 발급
export const getPresignedUploadUrl = async ({ filename, contentType }) => {
  try {
    const formData = new URLSearchParams();
    formData.append('filename', filename);
    formData.append('contentType', contentType);
    const response = await api.post('/api/files/upload-url', formData, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
    if (response.data && response.data.url) {
      return response.data.url;
    } else {
      throw new Error('Presigned URL 발급 실패');
    }
  } catch (error) {
    console.error('Presigned URL 발급 실패:', error);
    throw error;
  }
};

export const getUploadUrl = async (fileName, contentType, path = '') => {
  const response = await api.post('/api/files/upload-url', null, {
    params: {
      file_name: fileName,
      content_type: contentType,
      path,
    },
  });
  console.log('getUploadUrl 응답:', response.data); // 여기를 추가!
  return {
    presignedUrl: response.data.presigned_url,
    changeName: response.data.change_name,
  };
};

export const uploadFileToS3 = async (presignedUrl, file) => {
  await fetch(presignedUrl, {
    method: 'PUT',
    body: file,
    headers: {
      'Content-Type': file.type,
    },
  });
};
