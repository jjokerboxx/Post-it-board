import AppRouter from "components/AppRouter";
import React, { useState, useEffect } from "react";
import { authService } from "fbase";
import { onAuthStateChanged } from "firebase/auth";

function App() {
	const [init, setInit] = useState(false);
	const [isLoggedin, setLoggedin] = useState(true);
	const [userObj, setUserObj] = useState(null);

	useEffect(() => {
		console.log("asdasdasd", isLoggedin, init);
		authService.onAuthStateChanged((user) => {
			if (user) {
				setLoggedin(true);
				setUserObj(user);
			} else {
				setLoggedin(false);
			}
			setInit(true);
		});
	}, []);

	console.log(isLoggedin, init);

	return (
		<div className='App'>
			{init ? (
				<AppRouter isLoggedin={isLoggedin} userObj={userObj} />
			) : (
				"Initializing..."
			)}
		</div>
	);
}

export default App;
