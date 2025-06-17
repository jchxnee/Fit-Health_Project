import React, { useState } from 'react';

import AdBanner from '../components/MainPage/AdBanner.jsx';
import SelectExercise from '../components/MainPage/SelectExercise.jsx';
import PopularTrainer from '../components/MainPage/PopularTrainer.jsx';
import PopularPosts from '../components/MainPage/PopularPosts.jsx';
import SelectGoal from '../components/MainPage/SelectGoal.jsx';
import ReviewList from '../components/MainPage/ReviewList.jsx';
import Footer from '../components/Footer.jsx';
import MainTitle from '../components/MainPage/MainTitle.jsx';
import Header from '../components/Header.jsx';

function MainPage() {
  return (
    <>
      <Header user={null} />
      <MainTitle />
      <SelectExercise />
      <AdBanner />
      <PopularTrainer />
      <PopularPosts />
      <SelectGoal />
      <ReviewList />
      <Footer />
    </>
  );
}

export default MainPage;
