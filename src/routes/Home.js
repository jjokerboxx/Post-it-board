import { firestoreDB } from "firebase";
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

	// 3) isSorted를 true || false로 교체
	const onSortClick = () => {
		setIsSorted((prev) => !prev);
		console.log(isSorted);
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
			<button className='defaultButton' onClick={onSortClick}>
				Sort by {isSorted ? "Time" : "Like"}
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
				{/* JSX [postArry] 렌더링 */}
				<div className='postDiv' style={{ flex: 3 }}>
					{isSorted
						? postArry
								.sort((a, b) => b.like - a.like)
								.map((element) => (
									<PostIt
										key={element.id}
										postObj={element}
										isOwner={userObj.uid === element.author}
									/>
								))
						: postArry
								.sort((a, b) => b.uploadedAt - a.uploadedAt)
								.map((element) => (
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
