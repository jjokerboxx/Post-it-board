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

const Home = ({ userObj }) => {
	// 0) 상태 모음집
	const [post, setPost] = useState("");
	const [postArry, setPostArry] = useState([]);
	const [isSorted, setIsSorted] = useState(false);

	// 2) 트윗 업로드 버튼 함수
	const onSubmit = async (e) => {
		setIsSorted((prev) => prev);
		e.preventDefault();
		const $post = document.querySelector(".post-it");
		const postObj = {
			// 3) 상태를 객체로 받아와서 파이어스토어에 올리기
			contents: post,
			uploadedAt: Date.now(),
			author: userObj.uid,
			color: $post.style.backgroundColor,
			like: 0,
		};
		const docRef = await addDoc(collection(dbService, "Post"), postObj);
		console.log("Document written with ID: ", docRef.id);
		// 4) 입력칸 비우기
		document.querySelector("#post").value = "";
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
		// 실시간 트윗 렌더링
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
			<button onClick={onSortClick}>Sort</button>
			<div
				className='flex-container'
				style={{ display: "flex", flex: 1, flexDirection: "row" }}>
				<div style={{ flex: 1, margin: 30 }}>
					<form
						style={{
							display: "flex",
							flexDirection: "column",
							justifyContent: "center",
							alignItems: "center",
						}}>
						<div
							className='post-it'
							style={{
								display: "flex",
								flexDirection: "column",
								backgroundColor: "#ffd359",
								borderRadius: (20, 20, 10, 10),
								width: 270,
								height: 170,
							}}>
							<textarea
								style={{
									backgroundColor: "#ffd359",
									border: "none",
									borderRadius: (20, 20, 10, 10),
									padding: 10,
									outlineStyle: "none",
									resize: "none",
								}}
								cols={30}
								rows={7}
								id='post'
								value={post}
								onChange={onChange}
								placeholder="What's on your mind?"
								maxLength={100}></textarea>
							<div
								className='color-palette'
								style={{
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									backgroundColor: "#fffafa",
									overflow: "visible",
									borderRadius: 20,
									marginLeft: 20,
									marginRight: 20,
									boxShadow: "1px 3px 1px #f0f0f0",
								}}>
								<ColorButton color='#ffd359' />
								<ColorButton color='#e2ff3d' />
								<ColorButton color='#ff8547' />
								<ColorButton color='#44ccff' />
								<ColorButton color='#ff8adc' />
							</div>
						</div>
						<button
							style={{
								width: 100,
								border: "none",
								color: "white",
								backgroundColor: "#3f7bf2",
								padding: 5,
								borderRadius: 10,
								margin: 10,
							}}
							onClick={onSubmit}>
							Post!
						</button>
					</form>
				</div>
				<div className='post-div' style={{ flex: 3 }}>
					{/* 상태를 JSX 반복문으로 렌더 */}
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
		const $clickedPost = document.querySelector("#post");
		const $clickedPostIt = document.querySelector(".post-it");

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
			style={{
				display: "block",
				backgroundColor: color,
				borderRadius: 50,
				margin: 5,
				height: 15,
				width: 15,
				boxShadow: "1px 3px 1px #f0f0f0",
			}}
			onClick={onColorClick}></div>
	);
};

export default Home;
