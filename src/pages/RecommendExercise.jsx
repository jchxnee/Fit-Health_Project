import React from "react";
import Routine from "../components/RecommendExercise/Routine.jsx";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import TitleBar from "../components/TitleBar.jsx";
import CategoryMenu from "../components/CategoryMenu.jsx";
import ExerciseTitleBar from "../components/RecommendExercise/ExerciseTitleBar.jsx";
import BMICalculator from "../components/RecommendExercise/BMICalculator.jsx";

function RecommendExercise() {
    return(
        <>
            <Header/>
            <ExerciseTitleBar/>
            <BMICalculator/>
            <CategoryMenu/>
            <Routine/>
            <Footer/>
        </>
    )
}

export default RecommendExercise