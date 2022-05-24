import { firestoreDB } from "firebase";
import {
  AnimatePresence,
  motion,
  MotionValue,
  useViewportScroll,
  Variants,
} from "framer-motion";
import { collection, addDoc } from "@firebase/firestore";
import React, { useState, useEffect } from "react";
import ColorPalette from "./ColorPalette";
import styled from "styled-components";
import { writeOpenState } from "atoms";
import { useRecoilState } from "recoil";

const Overlay = styled(motion.div)`
  z-index: 1000;
  position: fixed;
  top: 0;
  height: 100%;
  width: 100%;
  opacity: 0;
  background-color: rgba(0, 0, 0, 0.6);
`;

const Modal = styled(motion.div)`
  z-index: 1001;
  border-radius: 15px !important;
  overflow: auto !important;
  top: ${(props) => props.scrollY.get() + 100}px;
  position: absolute;

  // mobile edia-query 적용하기
  width: 800px;
  height: 60%;
  left: 0;
  right: 0;
  margin: 0 auto;
  background-color: white;
`;
const modalVariants = {
  enter: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
  },
  exit: {
    scale: 0,
    opacity: 0,
    transition: {
      duration: 0.8,
    },
  },
};

function PostItModal({ userObj }) {
  // 0) 상태 모음
  const [post, setPost] = useState("");
  const [postArry, setPostArry] = useState([]);
  const [isSorted, setIsSorted] = useState(false);
  const [isModalOn, setIsModalOn] = useRecoilState(writeOpenState);

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
    setIsModalOn(false);
  };
  const onOverlayClick = () => {
    setIsModalOn((prev) => !prev);
  };
  const { scrollY } = useViewportScroll();
  return (
    <>
      <AnimatePresence>
        <Overlay
          onClick={onOverlayClick}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />
        <Modal
          variants={modalVariants}
          exit="exit"
          scrollY={scrollY}
          layoutId={"PostitModal"}
        >
          <div style={{ flex: 1, marginTop: 70 }}>
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
        </Modal>
      </AnimatePresence>
    </>
  );
}

export default PostItModal;
