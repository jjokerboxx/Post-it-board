import AppRouter from "components/Router";
import React, {useState, useEffect} from "react";
import {authService} from "fbase";
import {onAuthStateChanged} from "firebase/auth";

function App() {
  const [init, setInit] = useState(false);
  const [isLoggedin, setLoggedin] = useState(false);

  useEffect(() => {
    authService.onAuthStateChanged((user) => {
      if (user){
        setLoggedin(true);
      } else{
        setLoggedin(false);
      }
      setInit(true);
    })
  }, []);

  return (
    <div className="App">
      {init ? <AppRouter isLoggedin={isLoggedin}/> : "Initializing..."}
    </div>
  );
}

export default App;
