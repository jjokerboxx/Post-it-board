import React, { useState, useEffect } from "react";
import { dbService } from "firebase";
import { collection, deleteDoc, doc, updateDoc } from "@firebase/firestore";

const PostIt = ({ postObj, isOwner }) => {
	const deletePost = async () => {
		await deleteDoc(doc(dbService, "Post", postObj.id));
		console.log("delete doc", postObj.id);
	};

	const updatePost = async () => {
		await updateDoc(doc(dbService, "Post", postObj.id));
		console.log("update doc", postObj.id);
	};

	const date = new Date(postObj.uploadedAt);
	const dataString = `${
		date.getMonth() + 1
	}, ${date.getDate()}, ${date.getFullYear()}`;
	return (
		<>
			<div
				style={{
					wordWrap: "break-word",
					backgroundColor: postObj.color,
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
									backgroundColor: postObj.color,
									color: "white",
								}}
								onClick={deletePost}>
								✖
							</button>
						</div>
					</>
				)}
				<div id={postObj.id}>
					<span>{postObj.contents}</span>
				</div>
			</div>
		</>
	);
};

export default PostIt;
