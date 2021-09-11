import React from "react";
import { HashRouter as Router, Route, Switch} from "react-router-dom";
import Auth from "../routes/Auth";

 const AppRouter = ({ isLoggedin }) => {
    return(
        <Router>
            <Switch>
                {isLoggedin ? (
                    <>
                    <Route exact path="/"></Route>
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