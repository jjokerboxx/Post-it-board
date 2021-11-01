import { dbService } from "firebase";
import {
	collection,
	addDoc,
	getDocs,
	onSnapshot,
	query,
	orderBy,
} from "@firebase/firestore";
import React, { useState, useEffect, useRef } from "react";
import PostIt from "./PostIt";
import "../styles/App.css";

const Home = ({ userObj }) => {
	// 0) 상태 모음집
	const [post, setPost] = useState("");
	const [postArry, setPostArry] = useState([]);
	const [isSorted, setIsSorted] = useState(false);

	// 2)  업로드 버튼 함수
	const onSubmit = async (e) => {
		setIsSorted((prev) => prev);
		e.preventDefault();
		const $post = document.querySelector(".postIt");
		const {
			style: { backgroundColor },
		} = $post;
		const postObj = {
			// 3) 상태를 객체로 받아와서 firestore에 올리기
			contents: post,
			uploadedAt: Date.now(),
			author: userObj.uid,
			color: backgroundColor,
			like: 0,
		};
		const docRef = await addDoc(collection(dbService, "Post"), postObj);
		console.log("Document written with ID: ", docRef.id);
		// 4) 입력칸 비우기
		document.querySelector(".post").value = "";
		setPost("");
	};

	// 1) 텍스트입력 감지 후 입력값을 상태로 올리기
	const onChange = (e) => {
		const {
			target: { value },
		} = e;
		setPost(value);
	};

	const onSortClick = () => {
		setIsSorted((prev) => !prev);
	};

	useEffect(() => {
		// 실시간 snapshot 렌더링
		const sortOrder = isSorted ? "like" : "uploadedAt";
		console.log(sortOrder);
		const q = query(collection(dbService, "Post"), orderBy(sortOrder, "desc"));
		// onSnapshot 때 자동으로 정렬되는 문제 해결...
		const postSnapshot = onSnapshot(q, (snapshot) => {
			const docArry = snapshot.docs.map((elem) => ({
				id: elem.id,
				...elem.data(),
			}));
			setPostArry(docArry);
		});
		console.log("isSorted", isSorted);
	}, [isSorted]);
	return (
		<>
			<button className='defaultButton' onClick={onSortClick}>
				Sort
			</button>
			<div className='flexContainer'>
				<div style={{ flex: 1, margin: 30 }}>
					<form className='postForm'>
						<div className='postIt' style={{ backgroundColor: "#ffd359" }}>
							<textarea
								className='post'
								cols={30}
								rows={7}
								value={post}
								onChange={onChange}
								placeholder="What's on your mind?"
								maxLength={100}></textarea>
							<div className='colorPalette'>
								<ColorButton color='#ffd359' />
								<ColorButton color='#e2ff3d' />
								<ColorButton color='#ff8547' />
								<ColorButton color='#44ccff' />
								<ColorButton color='#ff8adc' />
							</div>
						</div>
						<button className='defaultButton' onClick={onSubmit}>
							Post!
						</button>
					</form>
				</div>
				<div className='postDiv' style={{ flex: 3 }}>
					{postArry.map((element) => (
						<PostIt
							key={element.id}
							postObj={element}
							isOwner={userObj.uid === element.author}
						/>
					))}
				</div>
			</div>
		</>
	);
};

const ColorButton = ({ color }) => {
	// 포스트잇 색상 변경
	const onColorClick = (e) => {
		const {
			target: { id },
		} = e;
		const $clickedPost = document.querySelector(".post");
		const $clickedPostIt = document.querySelector(".postIt");

		$clickedPost.animate(
			{ backgroundColor: id },
			{ duration: 400, fill: "forwards" }
		);
		$clickedPostIt.animate(
			{ backgroundColor: id },
			{ duration: 400, fill: "forwards" }
		);
		setTimeout(() => {
			$clickedPost.style.backgroundColor = id;
			$clickedPostIt.style.backgroundColor = id;
		}, 100);
	};
	return (
		<div
			id={color}
			className='colorButton'
			style={{ backgroundColor: color }}
			onClick={onColorClick}></div>
	);
};

export default Home;
