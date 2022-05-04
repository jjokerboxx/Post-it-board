import { firestoreDB } from "firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  where,
} from "@firebase/firestore";
import React, { useState, useEffect } from "react";
import PostIt from "../components/PostIt";
import "../styles/App.css";
import styled from "styled-components";
import PostItModal from "components/PostItModal";
import { useRecoilState } from "recoil";
import { likedPostIdArr, userState, writeOpenState } from "atoms";

const PostGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
`;

const WriteButton = styled.button`
  cursor: pointer;
  width: 100px;
  border: none;
  color: white;
  background-color: orange;
  padding: 5px;
  font-size: 15px;
  border-radius: 10px;
  margin: 10px;
  font-family: "SpoqaHanSansNeo";
`;

const ButtonMenu = styled.div`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  width: 300px;
`;

const Home = ({ userObj }) => {
  const [postArry, setPostArry] = useState([]);
  // const [likedPostId, setLikedPostId] = useRecoilState(likedPostIdArr);
  const [likedPostId, setLikedPostId] = useState([]);
  const [isSorted, setIsSorted] = useState(false);
  const [isModalOn, setIsModalOn] = useRecoilState(writeOpenState);
  const [userInfoState, setUserInfoState] = useRecoilState(userState);

  const onSortClick = () => {
    setIsSorted((prev) => !prev);
    console.log(isSorted);
  };
  const onWriteClick = () => {
    setIsModalOn((prev) => !prev);
  };

  // 현재 사용자의 좋아요 목록 api 콜
  useEffect(() => {
    const qu = query(
      collection(firestoreDB, "UserInfo"),
      where("id", "==", userObj.uid)
    );
    const userSnapshot = onSnapshot(qu, (snapshot) => {
      const userInfoArry = snapshot.docs.map((elem) => ({
        ...elem.data(),
      }));
      const { likePost } = userInfoArry[0];
      const { nickname } = userInfoArry[0];
      setLikedPostId(likePost);
      setUserInfoState({ id: userObj.uid, nickname: nickname });
    });
  }, []);

  // 4) 실시간 snapshot 렌더링
  useEffect(() => {
    // 정렬 기준
    const sortOrder = "uploadedAt";
    // 쿼리문 생성
    const q = query(
      collection(firestoreDB, "Post"),
      orderBy(sortOrder, "desc")
    );
    const postSnapshot = onSnapshot(q, (snapshot) => {
      const docArry = snapshot.docs.map((elem) => ({
        id: elem.id,
        ...elem.data(),
      }));
      setPostArry(docArry);
    });
  }, [isSorted]);

  return (
    <>
      <ButtonMenu>
        <button className="defaultButton" onClick={onSortClick}>
          Sort by {isSorted ? "Time" : "Like"}
        </button>
        <WriteButton onClick={onWriteClick}>새 글 작성하기</WriteButton>
      </ButtonMenu>

      <div className="flexContainer">
        {isModalOn && <PostItModal userObj={userObj} />}
        <PostGrid>
          {postArry
            .sort((a, b) => {
              if (isSorted) {
                return b.like - a.like;
              } else {
                return b.uploadedAt - a.uploadedAt;
              }
            })
            .map((element) => (
              <PostIt
                key={element.id}
                postObj={element}
                isOwner={userObj.uid === element.author}
                uid={userObj.uid}
                isLikedbyCurrentUser={likedPostId.includes(element.id)}
              />
            ))}
        </PostGrid>
      </div>
    </>
  );
};

export default Home;
