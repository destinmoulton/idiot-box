import PropTypes from "prop-types";
import React, { Component } from "react";
import { Link } from "react-router-dom";
import {
    AppBar,
    Button,
    Container,
    Hidden,
    IconButton,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    SwipeableDrawer,
    Toolbar,
    Typography,
} from "@material-ui/core";

import ListIcon from "@material-ui/icons/List";
import MenuIcon from "@material-ui/icons/Menu";
import MovieIcon from "@material-ui/icons/Movie";
import NewReleasesIcon from "@material-ui/icons/NewReleases";
import SettingsIcon from "@material-ui/icons/Settings";
import TvIcon from "@material-ui/icons/Tv";

const navbarItems = [
    { path: "/newepisodes", title: "New Episodes", icon: <NewReleasesIcon /> },
    {
        path: "/filemanager/Downloads",
        title: "File Manager",
        icon: <ListIcon />,
    },
    { path: "/shows", title: "Shows", icon: <TvIcon /> },
    { path: "/movies", title: "Movies", icon: <MovieIcon /> },
];
class IdiotBoxHeader extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isDrawerOpen: false,
        };

        this._handleClickHamburger = this._handleClickHamburger.bind(this);
    }

    _handleClickHamburger() {
        this.setState({ isDrawerOpen: true });
    }

    _handleToggleDrawer(state) {
        this.setState({ isDrawerOpen: state });
    }

    render() {
        const { isDrawerOpen } = this.state;
        return (
            <AppBar position="static" className="ib-header">
                <Container>
                    <Toolbar
                        theme="dark"
                        mode="horizontal"
                        className="ib-header-toolbar"
                    >
                        <Hidden mdUp>
                            <IconButton
                                edge="start"
                                className="hamburger-button"
                                onClick={this._handleClickHamburger}
                            >
                                <MenuIcon />
                            </IconButton>
                            <Typography variant="h6">Idiot Box</Typography>
                            <SwipeableDrawer
                                open={isDrawerOpen}
                                onClose={() => this._handleToggleDrawer(false)}
                                onOpen={() => this._handleToggleDrawer(true)}
                                className="ib-hamburger-drawer"
                            >
                                <List
                                    component="nav"
                                    aria-labelledby="main navigation"
                                    className="drawer-linklist"
                                    onClick={() =>
                                        this._handleToggleDrawer(false)
                                    }
                                >
                                    {navbarItems.map(
                                        ({ title, path, icon }) => (
                                            <Link key={path} to={path}>
                                                <ListItem>
                                                    <ListItemIcon>
                                                        {icon}
                                                    </ListItemIcon>
                                                    <ListItemText
                                                        primary={title}
                                                    />
                                                </ListItem>
                                            </Link>
                                        )
                                    )}
                                    <Link key={"/settings"} to="/settings">
                                        <ListItem>
                                            <ListItemIcon>
                                                <SettingsIcon />
                                            </ListItemIcon>
                                            <ListItemText>
                                                Settings
                                            </ListItemText>
                                        </ListItem>
                                    </Link>
                                </List>
                            </SwipeableDrawer>
                        </Hidden>
                        <Hidden smDown>
                            <List
                                component="nav"
                                aria-labelledby="main navigation"
                                className="horizontal-linklist"
                            >
                                {navbarItems.map(({ title, path }) => (
                                    <Link
                                        key={path}
                                        to={path}
                                        className="linklist-linktext"
                                    >
                                        <ListItem button>
                                            <ListItemText primary={title} />
                                        </ListItem>
                                    </Link>
                                ))}
                                <Link
                                    key={"/settings"}
                                    to="/settings"
                                    className="it-header-linktext"
                                >
                                    <ListItem button>
                                        <ListItemIcon>
                                            <SettingsIcon />
                                        </ListItemIcon>
                                    </ListItem>
                                </Link>
                            </List>
                        </Hidden>
                    </Toolbar>
                </Container>
            </AppBar>
        );
    }
}

IdiotBoxHeader.propTypes = {
    callAPI: PropTypes.func.isRequired,
};

export default IdiotBoxHeader;
