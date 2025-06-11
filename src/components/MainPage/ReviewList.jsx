import React from 'react';
import styled from 'styled-components';
import { FiMessageCircle } from "react-icons/fi";
import {FaRegEye, FaStar, FaRegStar, FaStarHalfAlt} from "react-icons/fa";

const Wrapper = styled.section`
    width: 100%;
    display: flex;
    justify-content: center;
    background: #fff;
    margin: 60px 0 150px 0;
`;

const Container = styled.div`
    width: 1008px;
    display: flex;
    flex-direction: column;
    gap: 36px;
`;

const Title = styled.h2`
    text-align: left;
    font-weight: 700;
    font-size: 28px;
    color: #222;
    margin-bottom: 8px;
`;

const ListRow = styled.div`
    display: flex;
    gap: 60px;
`;

const PostCol = styled.div`
    width: 480px;
    display: flex;
    flex-direction: column;
`;

const PostBox = styled.div`
    background: #fff;
    border-bottom: 1px solid #E0E0E0;
    padding: 18px 0 3px 0;
`;

const PostWriter = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;

    font-weight: 700;
    font-size: 17px;
    margin-bottom: 6px;
    text-align: left;
`;

const ProfileImg = styled.img`
    width: 24px;
    height: 24px;
    border-radius: 50%;
    object-fit: cover;
`;


const PostRate = styled.div``;

const StarWrapper = styled.div`
    display: flex;
    gap: 4px;
    margin-bottom: 6px;
`;

const PostContent = styled.div`
    font-family: 'SUITE', sans-serif;
    font-size: 13px;
    color: #666;
    margin-bottom: 10px;
    white-space: pre-line;
    text-align: left;
`;

const StatsTime = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-end;
    color: #bbb;
    font-size: 10px;
`;

const MoreInfoBox = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: flex-end;
    height: 100%;
    gap: 10px;
`;

const MoreText = styled.div`
    font-family: 'SUITE', sans-serif;
    font-weight: 700;
    font-size: 18px;
    color: #222;
`;

const ViewAllBtn = styled.button`
    background: none;
    border: none;
    font-family: 'SUITE', sans-serif;
    font-size: 15px;
    color: #222;
    cursor: pointer;
    padding: 0;
    margin: 0;
`;

const StarRating = ({ rating = 0 }) => {
    const stars = [];

    for (let i = 1; i <= 5; i++) {
        if (rating >= i) {
            stars.push(<FaStar key={i} color="#FFD700" />);
        } else if (rating >= i - 0.5) {
            stars.push(<FaStarHalfAlt key={i} color="#FFD700" />);
        } else {
            stars.push(<FaRegStar key={i} color="#FFD700" />);
        }
    }

    return <StarWrapper>{stars}</StarWrapper>;
};


// 예시 포스트 데이터
const posts = [
    { writer: '김현아', profileUrl: 'https://i.namu.wiki/i/Iha7pt4ahAfLRN22YiVjcl24Xeigb3nNv84nfKZ8r-Y2LhWQBy6gAz0zatiWz8_iFhq-ZP5V-JXrXMAiZwIWzw.webp', content: '안녕하세요. 저는 서울사는 김현아라고 하고 저는 진격거를 좋아합니다.\n특히, 한지를 제일 좋아합니다. 트레이너분이 진격거를 좋아하면 좋겠습니다.', time : '방금 전', rate: 4.5 },
    { writer: '이주찬', content: '안녕하세요. 저는 서울사는 김현아라고 하고 저는 진격거를 좋아합니다.\n특히, 한지를 제일 좋아합니다. 트레이너분이 진격거를 좋아하면 좋겠습니다.', time : '방금 전', rate: 5 },
    { writer: '황인태', content: '안녕하세요. 저는 서울사는 김현아라고 하고 저는 진격거를 좋아합니다.\n특히, 한지를 제일 좋아합니다. 트레이너분이 진격거를 좋아하면 좋겠습니다.', time : '방금 전', rate: 3 },
    { writer: 'ㅇㅈㅇ', content: '안녕하세요. 저는 서울사는 김현아라고 하고 저는 진격거를 좋아합니다.\n특히, 한지를 제일 좋아합니다. 트레이너분이 진격거를 좋아하면 좋겠습니다.', time : '방금 전', rate: 3 },
    { writer: '전진영', content: '안녕하세요. 저는 서울사는 김현아라고 하고 저는 진격거를 좋아합니다.\n특히, 한지를 제일 좋아합니다. 트레이너분이 진격거를 좋아하면 좋겠습니다.', time : '방금 전', rate: 0.5 },
];

const ReviewList = () => (
    <Wrapper>
        <Container>
            <Title>리뷰</Title>
            <ListRow>
                <PostCol>
                    {posts.slice(0, 3).map((p, i) => (
                        <PostBox key={i}>
                            <PostWriter>
                                <ProfileImg src={p.profileUrl} alt={`${p.writer}의 프로필`} />
                                {p.writer}
                            </PostWriter>
                            <PostRate><StarRating rating={p.rate} /></PostRate>
                            <PostContent>{p.content}</PostContent>
                            <StatsTime>{p.time}</StatsTime>
                        </PostBox>
                    ))}
                </PostCol>
                <PostCol>
                    {posts.slice(3, 6).map((p, i) => (
                        <PostBox key={i}>
                            <PostWriter>
                                <ProfileImg src={p.profileUrl} alt={`${p.writer}의 프로필`} />
                                {p.writer}
                            </PostWriter>
                            <PostRate>
                                <StarRating rating={p.rate} />
                            </PostRate>
                            <PostContent>{p.content}</PostContent>
                            <StatsTime>{p.time}</StatsTime>
                        </PostBox>
                    ))}
                    <MoreInfoBox>
                        <MoreText>더 많은 팁을 얻고싶으면?</MoreText>
                        <ViewAllBtn>전체보기 &gt;</ViewAllBtn>
                    </MoreInfoBox>
                </PostCol>
            </ListRow>
        </Container>
    </Wrapper>
);

export default ReviewList;
