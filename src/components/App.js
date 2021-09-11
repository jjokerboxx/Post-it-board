import AppRouter from "components/Router";
import { useState } from "react";
import {authService} from "fbase";

function App() {
  const [isLoggedin, setLoggedin] = useState(authService.currentUser);
  return (
    <div className="App">
      <AppRouter isLoggedin={isLoggedin}/>
    </div>
  );
}

export default App;
