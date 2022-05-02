import { firestoreDB } from "firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
} from "@firebase/firestore";
import React, { useState, useEffect } from "react";
import PostIt from "../components/PostIt";
import "../styles/App.css";
import styled from "styled-components";
import PostItModal from "components/PostItModal";
import { useRecoilState } from "recoil";
import { writeOpenState } from "atoms";

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
  const [post, setPost] = useState("");
  const [postArry, setPostArry] = useState([]);
  const [isSorted, setIsSorted] = useState(false);
  const [isModalOn, setIsModalOn] = useRecoilState(writeOpenState);

  const onSortClick = () => {
    setIsSorted((prev) => !prev);
    console.log(isSorted);
  };
  const onWriteClick = () => {
    setIsModalOn((prev) => !prev);
  };

  // 4) 실시간 snapshot 렌더링
  useEffect(() => {
    // 정렬 기준
    const sortOrder = "uploadedAt";
    console.log(sortOrder);
    // 쿼리문 생성
    const q = query(
      collection(firestoreDB, "Post"),
      // ++만약 좋아요가 같으면 uploadedAt 순으로 정렬 기능 추가
      orderBy(sortOrder, "desc")
    );
    // onSnapshot으로 [postArry] 설정
    const postSnapshot = onSnapshot(q, (snapshot) => {
      const docArry = snapshot.docs.map((elem) => ({
        id: elem.id,
        ...elem.data(),
      }));
      setPostArry(docArry);
    });
    console.log("isSorted", isSorted);
    // deps로 isSorted 받기
  }, [isSorted]);

  useEffect(() => {
    // 차트 인 애니메이션
  }, []);
  // const postGetter = async () => {
  // 	// 정렬 기준
  // 	const sortOrder = isSorted ? "like" : "uploadedAt";
  // 	console.log(sortOrder);
  // 	// 쿼리문 생성
  // 	const q = query(
  // 		collection(firestoreDB, "Post"),
  // 		// ++만약 좋아요가 같으면 uploadedAt 순으로 정렬 기능 추가
  // 		orderBy(sortOrder, "desc")
  // 	);
  // 	// onSnapshot으로 [postArry] 설정
  // 	const postDocs = await getDocs(q);
  // 	postDocs.forEach((post) => {
  // 		setPostArry((prev) => [post.data(), ...prev]);
  // 	});
  // };
  // useEffect(() => {
  // 	// deps로 isSorted 받기
  // 	postGetter();
  // }, [isSorted]);

  // 렌더링
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
              />
            ))}
        </PostGrid>
      </div>
    </>
  );
};

export default Home;
