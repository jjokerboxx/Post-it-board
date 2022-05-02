import React, { useState, useEffect } from "react";
import { firestoreDB } from "firebase";
import { collection, deleteDoc, doc, updateDoc } from "@firebase/firestore";
import styled from "styled-components";
import { useRecoilState } from "recoil";
import { deleteState } from "atoms";
import { useHistory } from "react-router-dom";

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

const PostIt = ({ postObj, isOwner }) => {
  const history = useHistory();
  const [isDeleted, setIsDeleted] = useRecoilState(deleteState);

  const deletePost = async () => {
    await deleteDoc(doc(firestoreDB, "Post", postObj.id));
    setIsDeleted((prev) => !prev);
    // history.go(0);
    console.log("delete doc", postObj.id);
  };

  const likePost = async () => {
    const postDoc = doc(firestoreDB, "Post", postObj.id);
    await updateDoc(postDoc, {
      like: postObj.like + 1,
    });
    console.log("like doc", postObj.id);
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
