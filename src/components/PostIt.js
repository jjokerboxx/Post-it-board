import React, { useState, useEffect } from "react";
import { firestoreDB } from "firebase";
import { collection, deleteDoc, doc, updateDoc } from "@firebase/firestore";

const PostIt = ({ postObj, isOwner }) => {
  const deletePost = async () => {
    await deleteDoc(doc(firestoreDB, "Post", postObj.id));
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
      <div
        style={{
          position: "relative",
          wordWrap: "break-word",
          backgroundColor: postObj.color,
          border: "none",
          borderRadius: (20, 20, 10, 10),
          padding: 10,
          margin: 30,
          outlineStyle: "none",
          resize: "none",
          width: 250,
          height: 150,
        }}
      >
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
      </div>
    </>
  );
};

export default PostIt;
