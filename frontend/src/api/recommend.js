import api from './axios';

export const getRecommendExercise = async (bmi, category) => {
  const res = await api.post('/api/recommend/exercise', { bmi, category, });
  return res.data;
};