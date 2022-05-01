import { firestoreDB } from "firebase";
import { collection, addDoc } from "@firebase/firestore";
import React, { useState, useEffect } from "react";
import ColorPalette from "./ColorPalette";
function PostItModal({ userObj }) {
  // 0) 상태 모음
  const [post, setPost] = useState("");
  const [postArry, setPostArry] = useState([]);
  const [isSorted, setIsSorted] = useState(false);

  // 1) 텍스트입력 감지 후 입력값(value)을 [post]로 올리기
  const onChange = (e) => {
    const {
      target: { value },
    } = e;
    setPost(value);
  };

  // 2) 업로드
  const onSubmit = async (e) => {
    e.preventDefault();
    const $postIt = document.querySelector(".postIt");
    const postObj = {
      // 상태를 객체로 받아와서 firestore에 올리기
      contents: post,
      uploadedAt: Date.now(),
      author: userObj.uid,
      color: $postIt.style.backgroundColor,
      like: 0,
    };
    const docRef = await addDoc(collection(firestoreDB, "Post"), postObj);
    console.log("Document written with ID: ", docRef.id);
    // 입력칸 비우기
    document.querySelector(".post").value = "";
    setPost("");
  };
  return (
    <div style={{ flex: 1, margin: 30 }}>
      <form className="postForm">
        <div className="postIt" style={{ backgroundColor: "#ffd359" }}>
          <textarea
            style={{ marginTop: "10px" }}
            className="post"
            cols={30}
            rows={7}
            value={post}
            onChange={onChange}
            placeholder="What's on your mind?"
            maxLength={140}
          ></textarea>
          <div className="colorPalette">
            {["#ffd359", "#e2ff3d", "#ff8547", "#44ccff", "#ff8adc"].map(
              (e) => (
                <ColorPalette color={e} />
              )
            )}
          </div>
        </div>
        <button className="defaultButton" onClick={onSubmit}>
          Post!
        </button>
      </form>
    </div>
  );
}

export default PostItModal;
