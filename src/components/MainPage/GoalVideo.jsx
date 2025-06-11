import React from 'react';
import styled from 'styled-components';

const VideoWrapper = styled.section`
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 0 0 48px 0;
`;
const VideoContainer = styled.div`
  width: 1008px;
  overflow: hidden;
  box-shadow: 0 4px 24px rgba(0,0,0,0.12);
  display: flex;
  justify-content: center;
`;

const ExerciseVideo = () => (
    <VideoWrapper>
        <VideoContainer>
            <iframe width="560" height="568" src="https://www.youtube.com/embed/6J9ixwhDYSM?si=H1qP2WeeLKKuMGgC"
                    title="YouTube video player"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                    style={{border: 'none', width: '100%', minHeight: '360px', background: '#000'}}
            />


        </VideoContainer>
    </VideoWrapper>
);

export default ExerciseVideo;
