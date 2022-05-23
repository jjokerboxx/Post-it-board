import AppRouter from "AppRouter";
import React, { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";

function App() {
  const [init, setInit] = useState(false);
  const [isLoggedin, setLoggedin] = useState(true);
  const [userObj, setUserObj] = useState(null);
  // const [userId, setUserId] = useRecoilState(userIdState);

  useEffect(() => {
    let auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("settimeout login", user);
        setLoggedin(true);
        setUserObj(user);
        console.log(init, user);
        setInit(true);
      } else {
        setLoggedin(false);
        setInit(true);
      }
    });
  }, []);

  return (
    <div className="App">
      {init ? (
        <AppRouter isLoggedin={isLoggedin} userObj={userObj} />
      ) : (
        "로그인 정보 불러오는 중..."
      )}
    </div>
  );
}

export default App;
