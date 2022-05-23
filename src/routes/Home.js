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
  grid-template-columns: repeat(${(props) => props.widthoffset}, 1fr);
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
  let [offset, setOffset] = useState(4);
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

  useEffect(() => {
    try {
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
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    const setResponsiveOffset = () => {
      if (window.innerWidth < 600) {
        setOffset(1);
      } else if (window.innerWidth <= 800) {
        setOffset(2);
      } else if (window.innerWidth < 1000) {
        setOffset(3);
      } else if (window.innerWidth > 1200) {
        setOffset(4);
      }
    };
    // resize 이벤트 리스너 추가해서 실시간으로 반응형 웹 만들기
    window.addEventListener("resize", setResponsiveOffset);

    // 항상 이벤트 리스너를 리턴해서 메모리 누수를 막아야한다.
    return () => window.removeEventListener("resize", setResponsiveOffset);
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
        <PostGrid widthoffset={offset}>
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
