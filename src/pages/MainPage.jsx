import React from 'react';

import theme from "../styles/theme.js";
import {ThemeProvider} from "styled-components";
import AdBanner from "../components/MainPage/AdBanner.jsx";
import SelectExercise from "../components/MainPage/SelectExercise.jsx";
import PopularTrainer from "../components/MainPage/PopularTrainer.jsx";
import PopularPosts from "../components/MainPage/PopularPosts.jsx";
import SelectGoal from "../components/MainPage/SelectGoal.jsx";
import GoalVideo from "../components/MainPage/GoalVideo.jsx";
import ReviewList from "../components/MainPage/ReviewList.jsx";
import Footer from "../components/Footer.jsx";
import MainTitle from "../components/MainPage/MainTitle.jsx";
import Header from "../components/Header.jsx";

function MainPage() {
    return(
        <ThemeProvider theme={theme}>
            <Header/>
            <MainTitle/>
            <SelectExercise/>
            <AdBanner/>
            <PopularTrainer/>
            <PopularPosts/>
            <SelectGoal/>
            <GoalVideo/>
            <ReviewList/>
            <Footer/>
        </ThemeProvider>
    )
}

export default MainPage