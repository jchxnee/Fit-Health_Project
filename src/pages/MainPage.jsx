import React, { useState } from 'react';

import AdBanner from '../components/MainPage/AdBanner.jsx';
import SelectExercise from '../components/MainPage/SelectExercise.jsx';
import PopularTrainer from '../components/MainPage/PopularTrainer.jsx';
import PopularPosts from '../components/MainPage/PopularPosts.jsx';
import SelectGoal from '../components/MainPage/SelectGoal.jsx';
import GoalVideo from '../components/MainPage/GoalVideo.jsx';
import ReviewList from '../components/MainPage/ReviewList.jsx';
import Footer from '../components/Footer.jsx';
import MainTitle from '../components/MainPage/MainTitle.jsx';
import Header from '../components/Header.jsx';
import betaImg from '../assets/beta_user_img.png'; // 사용자 이미지 (Header에서 사용)

function MainPage() {
  const [user] = useState({ name: '김현아', img: betaImg });

  return (
    <>
      <Header user={user} />
      <MainTitle />
      <SelectExercise />
      <AdBanner />
      <PopularTrainer />
      <PopularPosts />
      <SelectGoal />
      <GoalVideo />
      <ReviewList />
      <Footer />
    </>
  );
}

export default MainPage;
