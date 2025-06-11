import MainTitle from './MainPage/MainTitle.jsx';
import React from 'react';
import SelectExercise from './MainPage/SelectExercise.jsx';
import theme from '../styles/theme.js';
import { ThemeProvider } from 'styled-components';
import AdBanner from './MainPage/AdBanner.jsx';
import PopularTrainer from './MainPage/PopularTrainer.jsx';
import PopularPosts from './MainPage/PopularPosts.jsx';
import SelectGoal from './MainPage/SelectGoal.jsx';
import Footer from './Footer.jsx';
import GoalVideo from './MainPage/GoalVideo.jsx';
import ReviewList from './MainPage/ReviewList.jsx';
import Header from './Header.jsx';

function MainPage() {
  return (
    <ThemeProvider theme={theme}>
      <Header />
      <MainTitle />
      <SelectExercise />
      <AdBanner />
      <PopularTrainer />
      <PopularPosts />
      <SelectGoal />
      <GoalVideo />
      <ReviewList />
      <Footer />
    </ThemeProvider>
  );
}

export default MainPage;
