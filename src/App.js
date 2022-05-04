import AppRouter from "AppRouter";
import React, { useState, useEffect } from "react";
import { authService } from "firebase";
import { useRecoilState } from "recoil";
import { userIdState } from "atoms";

function App() {
  const [init, setInit] = useState(false);
  const [isLoggedin, setLoggedin] = useState(true);
  const [userObj, setUserObj] = useState(null);
  // const [userId, setUserId] = useRecoilState(userIdState);

  useEffect(() => {
    authService.onAuthStateChanged((user) => {
      if (user) {
        setLoggedin(true);
        setUserObj(user);
        // setUserId(user.uid);
      } else {
        setLoggedin(false);
      }
      setInit(true);
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
