import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import AdminNavbar from "../components/Navbars/AdminNavbar.js";
import routes from "../routes.js";

class VideoLayout extends React.Component {
    componentDidUpdate(e) {
        document.documentElement.scrollTop = 0;
        document.scrollingElement.scrollTop = 0;
    }
    getRoutes = (routes) => {
        return routes.map((prop, key) => {
            if (prop.layout === "/video") {
                return (
                    <Route
                        path={prop.layout + prop.path}
                        component={prop.component}
                        key={key}
                    />
                );
            } else {
                return null;
            }
        });
    };
    render() {
        return (
            <div className="background-image full-height">
                <AdminNavbar />
                <div className="mainContent">
                    <Switch>
                        {this.getRoutes(routes)}
                        <Redirect from="/video" to="/video/videochat" />
                    </Switch>
                </div>
            </div>
        );
    }
}

export default VideoLayout;
