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

  // 로딩 상태 관리 (각 API 별로 따로 관리할 수도 있지만, 일단 통합)
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);

    Promise.all([api.get('/api/trainer/top3'), api.get('/api/board/top5'), api.get('/api/review/top6')])
      .then(([trainerRes, boardRes, reviewRes]) => {
        const trainers = Array.isArray(trainerRes.data)
          ? trainerRes.data
          : trainerRes.data.result || trainerRes.data.trainers || [];
        const boards = Array.isArray(boardRes.data)
          ? boardRes.data
          : boardRes.data.result || boardRes.data.boards || [];
        const reviews = Array.isArray(reviewRes.data)
          ? reviewRes.data
          : reviewRes.data.result || reviewRes.data.reviews || [];

        setPopularTrainerList(trainers);
        setPopularBoardList(boards);
        setRecentReviewList(reviews);
      })
      .catch((error) => {
        console.error('데이터 로드 중 에러:', error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <>
      <MainTitle />
      <SelectExercise />
      <AdBanner />
      <PopularTrainer trainers={popularTrainerList} isLoading={isLoading} />
      <PopularPosts boards={popularBoardList} isLoading={isLoading} />
      <SelectGoal />
      <ReviewList reviews={recentReviewList} isLoading={isLoading} />
    </>
  );
}

export default MainPage;
