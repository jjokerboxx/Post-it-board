import React, { useState, useEffect } from "react";
import { dbService } from "fbase";
import { collection, deleteDoc, doc, updateDoc } from "@firebase/firestore";

const Tweet = ({ tweetObj, isOwner }) => {
	const deleteTweet = async () => {
		await deleteDoc(doc(dbService, "Tweet", tweetObj.id));
		console.log("delete doc", tweetObj.id);
	};

	const updateTweet = async () => {
		await updateDoc(doc(dbService, "Tweet", tweetObj.id));
		console.log("update doc", tweetObj.id);
	};

	const date = new Date(tweetObj.uploadedAt);
	const dataString = `${
		date.getMonth() + 1
	}, ${date.getDate()}, ${date.getFullYear()}`;
	return (
		<>
			<div
				style={{
					wordWrap: "break-word",
					backgroundColor: tweetObj.color,
					border: "none",
					borderRadius: (20, 20, 10, 10),
					padding: 10,
					margin: 20,
					outlineStyle: "none",
					resize: "none",
					width: 250,
					height: 150,
				}}>
				{isOwner && (
					<>
						<div>
							<button
								style={{
									marginBottom: 5,
									float: "right",
									border: "none",
									backgroundColor: tweetObj.color,
									color: "white",
								}}
								onClick={deleteTweet}>
								✖
							</button>
						</div>

						{/* <button onClick={updateTweet}>Edit</button> */}
					</>
				)}
				<div id={tweetObj.id}>
					<span>{tweetObj.tweet}</span>
				</div>
			</div>
		</>
	);
};

export default Tweet;
