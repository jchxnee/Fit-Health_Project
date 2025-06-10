import MainTitle from "./MainPage/MainTitle.jsx";
import React from 'react';
import SelectExercise from "./MainPage/SelectExercise.jsx";
import theme from "../styles/theme.js";
import {ThemeProvider} from "styled-components";
import AdBanner from "./MainPage/AdBanner.jsx";
import PopularTrainer from "./MainPage/PopularTrainer.jsx";

function MainPage() {
    return(
        <ThemeProvider theme={theme}>
            <MainTitle/>
            <SelectExercise/>
            <AdBanner/>
            <PopularTrainer/>
        </ThemeProvider>
    )
}

export default MainPage