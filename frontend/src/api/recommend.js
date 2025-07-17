import api from './axios';

export const getRecommendExercise = async (bmi, category) => {
  const res = await api.post('/api/recommend/exercise', { bmi, category });
  return res.data;
};

export const getRecommendDiet = async (userData, goalcategory) => {
  const res = await api.post('/api/recommend/diet', { ...userData, goalcategory: goalcategory });
  return res.data;
};
