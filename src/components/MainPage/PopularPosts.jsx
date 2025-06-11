import React from 'react';
import styled from 'styled-components';
import {FiMessageCircle} from "react-icons/fi";
import {FaRegEye} from "react-icons/fa";

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
    font-family: 'SUITE', sans-serif;
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
    gap: 0;
`;
const PostBox = styled.div`
    background: #fff;
    border-bottom: 1px solid #E0E0E0;
    padding: 18px 0 8px 0;
`;
const PostTitle = styled.div`
    font-family: 'SUITE', sans-serif;
    font-weight: 700;
    font-size: 17px;
    color: #222;
    margin-bottom: 6px;
    text-align: left;
`;
const PostContent = styled.div`
    font-family: 'SUITE', sans-serif;
    font-size: 13px;
    color: #666;
    margin-bottom: 10px;
    white-space: pre-line;
    text-align: left;
`;
const StatsRow = styled.div`
    display: flex;
    gap: 5px;
    align-items: center;
    justify-content: flex-end;
    color: #bbb;
    font-size: 13px;
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

const posts = [
    { title: '제목입니다', content: '안녕하세요. 저는 서울사는 김현아라고 하고 저는 진격거를 좋아합니다.\n특히, 한지를 제일 좋아합니다. 트레이너분이 진격거를 좋아하면 좋겠습니다.', views: 3700, comments: 10 },
    { title: '제목입니다', content: '안녕하세요. 저는 서울사는 김현아라고 하고 저는 진격거를 좋아합니다.\n특히, 한지를 제일 좋아합니다. 트레이너분이 진격거를 좋아하면 좋겠습니다.', views: 3700, comments: 10 },
    { title: '제목입니다', content: '안녕하세요. 저는 서울사는 김현아라고 하고 저는 진격거를 좋아합니다.\n특히, 한지를 제일 좋아합니다. 트레이너분이 진격거를 좋아하면 좋겠습니다.', views: 3700, comments: 10 },
    { title: '제목입니다', content: '안녕하세요. 저는 서울사는 김현아라고 하고 저는 진격거를 좋아합니다.\n특히, 한지를 제일 좋아합니다. 트레이너분이 진격거를 좋아하면 좋겠습니다.', views: 3700, comments: 10 },
];

const PopularPosts = () => (
    <Wrapper>
        <Container>
            <Title>커뮤니티 인기 글</Title>
            <ListRow>
                <PostCol>
                    {posts.slice(0,3).map((p, i) => (
                        <PostBox key={i}>
                            <PostTitle>{p.title}</PostTitle>
                            <PostContent>{p.content}</PostContent>
                            <StatsRow>
                                <FaRegEye></FaRegEye>{p.views}
                                <FiMessageCircle ></FiMessageCircle >{p.comments}
                            </StatsRow>
                        </PostBox>
                    ))}
                </PostCol>
                <PostCol>
                    {posts.slice(2,5).map((p, i) => (
                        <PostBox key={i}>
                            <PostTitle>{p.title}</PostTitle>
                            <PostContent>{p.content}</PostContent>
                            <StatsRow>
                                <FaRegEye></FaRegEye>{p.views}
                                <FiMessageCircle ></FiMessageCircle>{p.comments}
                            </StatsRow>
                        </PostBox>
                    ))}
                    <MoreInfoBox>
                        <MoreText>더 많은 정보를 얻고싶으면?</MoreText>
                        <ViewAllBtn>전체보기 &gt;</ViewAllBtn>
                    </MoreInfoBox>
                </PostCol>
            </ListRow>
        </Container>
    </Wrapper>
);

export default PopularPosts;