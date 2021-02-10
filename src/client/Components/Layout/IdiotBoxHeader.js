import PropTypes from "prop-types";
import React, { Component } from "react";
import { Link } from "react-router-dom";

import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import SettingsIcon from "@material-ui/icons/Settings";
const navbarItems = [
    { path: "/newepisodes", title: "New Episodes" },
    { path: "/filemanager/Downloads", title: "File Manager" },
    { path: "/shows", title: "Shows" },
    { path: "/movies", title: "Movies" },
];
class IdiotBoxHeader extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <AppBar>
                <Toolbar
                    theme="dark"
                    mode="horizontal"
                    defaultSelectedKeys={["2"]}
                    style={{ lineHeight: "40px" }}
                >
                    <List component="nav" aria-labelledby="main navigation">
                        {navbarItems.map(({ title, path }) => (
                            <Link to={path}>
                                <ListItem button>
                                    <ListItemText primary={title} />
                                </ListItem>
                            </Link>
                        ))}
                        <Link to="/settings">
                            <ListItem button>
                                <ListItemIcon>
                                    <SettingsIcon />
                                </ListItemIcon>
                            </ListItem>
                        </Link>
                    </List>
                </Toolbar>
            </AppBar>
        );
    }
}

IdiotBoxHeader.propTypes = {
    callAPI: PropTypes.func.isRequired,
};

export default IdiotBoxHeader;
