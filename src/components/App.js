import AppRouter from "components/AppRouter";
import React, {useState, useEffect} from "react";
import {authService} from "fbase";
import {onAuthStateChanged} from "firebase/auth";

function App() {
  const [init, setInit] = useState(false);
  const [isLoggedin, setLoggedin] = useState(true);

  useEffect(() => {
    console.log("asdasdasd", isLoggedin, init);
    authService.onAuthStateChanged((user) => {
      if (user){
        setLoggedin(true);
      } else{
        setLoggedin(false);
      }
      setInit(true);
    })
  }, []);

  console.log(isLoggedin, init);

  return (
    <div className="App">
      {init ? <AppRouter isLoggedin={isLoggedin}/> : "Initializing..."}
    </div>
  );
}

export default App;
