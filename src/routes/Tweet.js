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
	
	return (
		<>
			<div id={tweetObj.id}>
				<span>{tweetObj.tweet}</span>
			</div>
			<div>
				<span>{tweetObj.uploadedAt}</span>
			</div>

			{isOwner && (
				<>
					<button onClick={deleteTweet}>Delete</button>
					<button onClick={updateTweet}>Edit</button>
				</>
			)}
		</>
	);
};

export default Tweet;
