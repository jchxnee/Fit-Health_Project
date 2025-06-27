import React, { useEffect, useState } from 'react';

import AdBanner from '../components/MainPage/AdBanner.jsx';
import SelectExercise from '../components/MainPage/SelectExercise.jsx';
import PopularTrainer from '../components/MainPage/PopularTrainer.jsx';
import PopularPosts from '../components/MainPage/PopularPosts.jsx';
import SelectGoal from '../components/MainPage/SelectGoal.jsx';
import ReviewList from '../components/MainPage/ReviewList.jsx';
import MainTitle from '../components/MainPage/MainTitle.jsx';
import api from '../api/axios.js';

function MainPage() {
  const [popularTrainerList, setPopularTrainerList] = useState([]);
  const [popularBoardList, setPopularBoardList] = useState([]);
  const [recentReviewList, setRecentReviewList] = useState([]);
  useEffect(() => {
    api.get('/api/trainer/top3').then((res) => setPopularTrainerList(res.data));
    api.get('/api/board/top5').then((res) => setPopularBoardList(res.data));
    api.get('/api/review/top6').then((res) => setRecentReviewList(res.data));
  }, []);

  return (
    <>
      <MainTitle />
      <SelectExercise />
      <AdBanner />
      <PopularTrainer trainers={popularTrainerList} />
      <PopularPosts boards={popularBoardList} />
      <SelectGoal />
      <ReviewList reviews={recentReviewList} />
    </>
  );
}

export default MainPage;
