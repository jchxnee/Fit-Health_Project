import React from "react";
import Routine from "../components/RecommendExercise/Routine.jsx";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import TitleBar from "../components/TitleBar.jsx";

function RecommendExercise() {
    return(
        <>
            <Header/>
            <TitleBar/>
            <Routine/>
            <Footer/>
        </>
    )
}

export default RecommendExercise