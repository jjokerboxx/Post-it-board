import React from "react";
import { HashRouter as Router, Route, Switch} from "react-router-dom";
import Home from "routes/Home";
import Auth from "../routes/Auth";

 const AppRouter = ({ isLoggedin }) => {
    return(
        <Router>
            <Switch>
                {/* 로그인 정보를 받아서 null이 아니면 Auth 화면으로 처리해줌 */}
                {isLoggedin ? (
                    <>
                    <Route exact path="/">
                        <Home/>
                    </Route>
                    </>
                ) : (
                    <Route exact path="/">
                        <Auth/>
                    </Route>
                )}
            </Switch>
        </Router>
    );
};

export default AppRouter;