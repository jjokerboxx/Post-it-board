import React, { useEffect, useState } from "react";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import styled from "styled-components";
import { firestoreDB } from "firebase";
import PostIt from "components/PostIt";
import { useRecoilState, useRecoilValue } from "recoil";
import { deleteState, userState } from "atoms";

const PostGrid = styled.div`
  display: grid;
  position: relative;
  min-height: 200px;
  grid-template-columns: repeat(4, 1fr);
`;

const WarningSign = styled.div`
  font-size: 24px;
  position: absolute;
  display: flex;
  left: -300px;
  justify-content: center;
  align-items: center;
  height: 200px;
  width: 300px;
`;

const Profile = ({ userObj }) => {
  const uId = userObj.uid;

  const [postArry, setPostArry] = useState([]);
  const [likedPostArry, setLikedPostArry] = useState([]);
  const [isDeleted, setIsDeleted] = useRecoilState(deleteState);
  const [likedPostId, setLikedPostId] = useState([]);
  const userNickname = useRecoilValue(userState);

  // 내가 쓴 글 불러오기
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
  }, []);

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
      setLikedPostId(likePost);
    });
  }, []);

  // 내가 좋아요 누른 글 불러오기
  useEffect(() => {
    const q = query(
      collection(firestoreDB, "UserInfo"),
      where("id", "==", uId)
    );
    const userSnapshot = onSnapshot(q, (snapshot) => {
      const userInfoArry = snapshot.docs.map((elem) => ({
        ...elem.data(),
      }));
      const { likePost } = userInfoArry[0];
      // Promise.all()로 리펙토링 하기!!
      // Promise.all(
      //   likePost.map(async (e) => {
      //     let likedpost = await getDoc(doc(firestoreDB, "Post", e));
      //     setLikedPostArry((prev) => [...prev, likedpost.data()]);
      //   })
      // );
      const result = Promise.allSettled(
        likePost.map(async (e) => {
          try {
            let likedpost = await getDoc(doc(firestoreDB, "Post", e));
            return likedpost.data();
          } catch (error) {
            console.log(error);
          }
        })
      );
      // setLikedPostArry(result);
      result.then((r) => {
        setLikedPostArry(r);
      });
    });
  }, []);

  return (
    <>
      <b style={{ marginLeft: 40, fontSize: "20px" }}>
        {userNickname.nickname}님이 쓴 글 모아보기
      </b>
      <div className="flexContainer">
        <PostGrid>
          {postArry.length == 0 ? (
            <WarningSign>아직 쓴 글이 없어요</WarningSign>
          ) : (
            postArry.map((element) => (
              <PostIt
                key={element.id}
                postObj={element}
                isOwner={userObj.uid === element.author}
                isLikedbyCurrentUser={likedPostId.includes(element.id)}
              />
            ))
          )}
        </PostGrid>
      </div>
      <b style={{ marginLeft: 40, fontSize: "20px" }}>
        {userNickname.nickname}님이 좋아요 누른 글 모아보기
      </b>
      <div className="flexContainer">
        <PostGrid>
          {likedPostArry.length === 0 ? (
            <WarningSign>아직 좋아하는 글이 없어요</WarningSign>
          ) : (
            likedPostArry.map((element) => {
              if (element.value !== undefined) {
                return (
                  <PostIt
                    key={element.value.id}
                    postObj={element.value}
                    isOwner={userObj.uid === element.value.author}
                    // isOwner={false}
                    isLikedbyCurrentUser={true}
                  />
                );
              }
            })
          )}
        </PostGrid>
      </div>
    </>
  );
};
export default Profile;
