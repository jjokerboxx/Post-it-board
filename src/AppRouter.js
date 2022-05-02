import React from "react";
import { HashRouter as Router, Route, Switch } from "react-router-dom";
import Home from "routes/Home";
import Profile from "routes/Profile";
import Auth from "./routes/Auth";
import Navigation from "./components/Navigation";

const AppRouter = ({ isLoggedin, userObj }) => {
  console.log(isLoggedin ? "Logged in" : "Not logged in");
  return (
    <Router>
      {isLoggedin && <Navigation />}
      <Switch>
        {/* 로그인 정보를 받아서 null이 아니면 Auth 화면으로 처리해줌 */}
        {isLoggedin ? (
          <>
            <Route exact path="/">
              <Home userObj={userObj} />
            </Route>
            <Route path={["/profile"]}>
              <Profile userObj={userObj} />
            </Route>
          </>
        ) : (
          <>
            <Route exact path="/">
              <Auth />
            </Route>
          </>
        )}
      </Switch>
    </Router>
  );
};

export default AppRouter;
