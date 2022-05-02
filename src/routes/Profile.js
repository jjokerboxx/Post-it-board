import React, { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import styled from "styled-components";
import { firestoreDB } from "firebase";
import PostIt from "components/PostIt";
import { useRecoilState } from "recoil";
import { deleteState } from "atoms";

const PostGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
`;

const Profile = ({ userObj }) => {
  const uId = userObj.uid;
  console.log(uId);

  const [postArry, setPostArry] = useState([]);
  const [isDeleted, setIsDeleted] = useRecoilState(deleteState);

  useEffect(() => {
    const q = query(
      collection(firestoreDB, "Post"),
      where("author", "==", uId),
      orderBy("uploadedAt", "desc")
    );
    const postSnapshot = onSnapshot(q, (snapshot) => {
      const docArry = snapshot.docs.map((elem) => ({
        id: elem.id,
        ...elem.data(),
      }));
      setPostArry(docArry);
    });
  }, [isDeleted]);

  // 내가 쓴 글 모아서 보기
  return (
    <>
      <b style={{ marginLeft: 40, fontSize: "20px" }}>내가 쓴 글 모아보기</b>
      <div className="flexContainer">
        <PostGrid>
          {postArry.length == 0
            ? "아직 쓴 글이 없네요"
            : postArry.map((element) => (
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
export default Profile;
