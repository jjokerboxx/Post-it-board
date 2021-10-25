import { dbService } from "fbase";
import {
	collection,
	addDoc,
	getDocs,
	onSnapshot,
	query,
	orderBy,
} from "@firebase/firestore";
import React, { useState, useEffect } from "react";
import Tweet from "./Tweet";

const Home = ({ userObj }) => {
	// 0) 상태 모음집
	const [tweet, setTweet] = useState("");
	const [twtArry, setTwtArry] = useState([]);

	// 2) 트윗 업로드 버튼 함수
	const onSubmit = async () => {
		e.preventDefault();
		const nweet = {
			// 3) 상태를 객체로 받아와서 파이어스토어에 올리기
			tweet: tweet,
			uploadedAt: Date.now(),
			author: userObj.uid,
		};
		const docRef = await addDoc(collection(dbService, "Tweet"), nweet);
		console.log("Document written with ID: ", docRef.id);
		// 4) 입력칸 비우기
		document.querySelector("#tweet").value = "";
	};

	// 1) 텍스트입력 감지 후 입력값을 상태로 올리기
	const onChange = (e) => {
		const {
			target: { value },
		} = e;
		setTweet(value);
	};

	useEffect(() => {
		// 실시간 트윗 렌더링
		const q = query(
			collection(dbService, "Tweet"),
			orderBy("uploadedAt", "desc")
		);
		// const twt = onSnapshot(q, (doc) => {
		//   doc.forEach((elem) => {
		//     const date = new Date(elem.data().uploadedAt);
		//     const dateString = `${date.getMonth() + 1}. ${date.getDate()}. ${date.getFullYear()} : ${date.getHours()}`
		//     // 파이어스토어에서 받아온 데이터를 객체로
		//     const twtObj = {
		//       tweet: elem.data().tweet,
		//       uploadedAt: dateString,
		//       author: elem.data().author,
		//       id: elem.id
		//     }
		//     console.log(elem.id);
		//     // 객체를 상태로
		//     setTwtArry((prev) => [twtObj, ...prev]);
		//   })
		// })
		const twt = onSnapshot(q, (doc) => {
			const docArry = doc.docs.map((elem) => ({ id: elem.id, ...elem.data() }));
			setTwtArry(docArry);
			console.log(twtArry);
		});
	}, []);

	return (
		<>
			<div>
				<form>
					<input
						type='text'
						id='tweet'
						value={tweet}
						onChange={onChange}
						placeholder="What's on your mind?"
						maxLength={120}></input>
					<button onClick={onSubmit}>Nweet!</button>
				</form>
			</div>
			<div className='tweet'>
				{/* forEach가 아니라 map!! */}
				{/* 상태를 JSX 반복문으로 렌더 */}
				{twtArry.map(
					(element) => (
						<Tweet
							key={element.id}
							tweetObj={element}
							isOwner={userObj.uid === element.author}
						/>
					)
					// <div>
					//   <p>
					//     {element.tweet}
					//   </p>
					//   <p>
					//     {element.uploadedAt}
					//   </p>
					// </div>
				)}
			</div>
		</>
	);
};

export default Home;
