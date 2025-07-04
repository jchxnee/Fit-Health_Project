import api from './axios';
 
export const getRecommendExercise = async (bmi) => {
  const res = await api.post('/api/recommend/exercise', { bmi });
  return res.data;
}; 