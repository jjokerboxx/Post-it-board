import React, { useState, useEffect } from "react";
import { firestoreDB } from "firebase";
import {
  collection,
  deleteDoc,
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "@firebase/firestore";
import styled from "styled-components";
import { useRecoilState } from "recoil";
import { deleteState } from "atoms";

const PostItBox = styled.div`
  position: relative;
  word-wrap: "break-word";
  background-color: ${(props) => props.postObj.color};
  box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
  /* border: "none"; */
  border-radius: 10px;
  padding: 10px;
  margin: 30px;
  outline-style: none;
  resize: none;
  width: 250px;
  height: 150px;
`;

// TODO: layoutId 입력하기
const PostIt = ({ postObj, isOwner, uid, isLikedbyCurrentUser }) => {
  const [isDeleted, setIsDeleted] = useRecoilState(deleteState);

  const [isLiked, setIsLiked] = useState(isLikedbyCurrentUser);

  const deletePost = async () => {
    await deleteDoc(doc(firestoreDB, "Post", postObj.id));
    setIsDeleted((prev) => !prev);
  };

  // 도대체 왜 매 포스트잇마다 현재 유저를 불러와야함? ===> 코드 수정하기

  const likePost = async () => {
    const userInfo = await doc(firestoreDB, "UserInfo", uid);
    const postDoc = await doc(firestoreDB, "Post", postObj.id);

    await updateDoc(postDoc, {
      like: isLiked ? postObj.like - 1 : postObj.like + 1,
    });
    await updateDoc(userInfo, {
      likePost: isLiked ? arrayRemove(postObj.id) : arrayUnion(postObj.id),
    });

    setIsLiked((prev) => !prev);
  };

  const date = new Date(postObj.uploadedAt);
  const dataString = `${
    date.getMonth() + 1
  }, ${date.getDate()}, ${date.getFullYear()}`;
  return (
    <>
      <PostItBox postObj={postObj}>
        {isOwner && (
          <>
            <div>
              <button
                style={{
                  position: "absolute",
                  marginBottom: 5,
                  // float: "right",
                  right: "10px",

                  border: "none",
                  backgroundColor: postObj.color,
                  color: "white",
                }}
                onClick={deletePost}
              >
                ✖
              </button>
            </div>
          </>
        )}
        <div style={{ width: 220 }} id={postObj.id}>
          <span>{postObj.contents}</span>
        </div>
        <>
          <div>
            <button
              style={{
                position: "absolute",
                marginBottom: 5,
                right: "10px",
                top: "40px",
                border: "none",
                backgroundColor: postObj.color,
                color: "white",
              }}
              onClick={likePost}
            >
              <b>👍🏻 {postObj.like != 0 && postObj.like}</b>
            </button>
          </div>
        </>
      </PostItBox>
    </>
  );
};

export default PostIt;
