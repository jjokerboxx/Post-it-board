import React, { useState } from "react";
import { authService } from "firebase";
import {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	signInWithPopup,
	GoogleAuthProvider,
} from "firebase/auth";

const Auth = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [newAccount, setNewAccout] = useState(true);
	const [error, setError] = useState("");

	const toggleAccount = () => setNewAccout((prev) => !prev);

	const onSubmit = async (e) => {
		e.preventDefault();
		try {
			let authData;
			if (newAccount) {
				authData = await createUserWithEmailAndPassword(
					authService,
					email,
					password
				);
			} else {
				authData = await signInWithEmailAndPassword(
					authService,
					email,
					password
				);
			}
			console.log(authData);
		} catch (error) {
			console.log(error.message);
			setError(error.message);
		}
	};
	const onGoogleClick = async () => {
		const provider = new GoogleAuthProvider();
		try {
			const result = await signInWithPopup(authService, provider);
			const credential = GoogleAuthProvider.credentialFromResult(result);
			const token = credential.accessToken;
			// The signed-in user info.
			const user = result.user;
		} catch (error) {
			const errorCode = error.code;
			const errorMessage = error.message;
			// The email of the user's account used.
			const email = error.email;
			// The AuthCredential type that was used.
			const credential = GoogleAuthProvider.credentialFromError(error);
		}
	};

	const onChange = (e) => {
		//destructring event
		const {
			target: { name, value },
		} = e;
		if (name === "email") {
			setEmail(value);
		} else if (name === "password") {
			setPassword(value);
		}
	};

	return (
		<div>
			<span>Auth</span>
			<div>
				<form onSubmit={onSubmit}>
					<input
						type='email'
						id='id'
						name='email'
						placeholder='Email'
						required
						value={email}
						onChange={onChange}></input>
					<input
						type='text'
						id='pw'
						name='password'
						placeholder='Password'
						required
						value={password}
						onChange={onChange}></input>
					<input
						type='submit'
						value={newAccount ? "Create Account" : "Login"}></input>
				</form>
				<div>
					<button onClick={onGoogleClick}>Continue with Goolge</button>
					<button>Continue with Github</button>
				</div>
				<div>
					{" "}
					<button onClick={toggleAccount}>
						{" "}
						{newAccount
							? "I already have Account!"
							: "I want to create new Account!"}
					</button>{" "}
				</div>
				{error}
			</div>
		</div>
	);
};
export default Auth;
