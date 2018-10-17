import React from "react";
import {Route, Switch} from "react-router-dom";

import Login from "./Components/Login";
import ChatFeed from "./Components/ChatFeed";
import ChatRoom from "./Components/ChatRoom";

import {authUser} from "./actions/userAction";

import Auth from './hoc/auth'



const Routes = () => {


    return (
        <Switch>
            <Route path="/dashboard" exact component={Auth(ChatFeed, true)}/>
            <Route path="/chatRoom/:id" exact component={Auth(ChatRoom, true)}/>
            <Route path="/" exact component={Auth(Login, false)}/>
        </Switch>
    );
};

export default Routes;
