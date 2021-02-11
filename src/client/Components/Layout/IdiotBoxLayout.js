import React, { Component } from "react";
import { connect } from "react-redux";
import { BrowserRouter, Redirect, Route } from "react-router-dom";

import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import { callAPI } from "../../actions/api.actions";

import FileManager from "../FileManager";
import IdiotBoxHeader from "./IdiotBoxHeader";
import MoviesList from "../Movies/MoviesList";
import NewEpisodes from "../NewEpisodes";
import Settings from "../Settings/Settings";
import ShowInfo from "../Shows/ShowInfo/ShowInfo";
import ShowsList from "../Shows/ShowsList";

const IdiotBoxLayout = (props) => {
    return (
        <BrowserRouter>
            <IdiotBoxHeader callAPI={props.callAPI} />
            <Container className="layout">
                <Grid container>
                    <Grid item container xs={12} id="ib-layout-content-box">
                        <Route
                            path="/"
                            exact
                            render={(routeParams) => (
                                <NewEpisodes
                                    {...routeParams}
                                    callAPI={props.callAPI}
                                    settings={props.settings}
                                />
                            )}
                        />
                        <Route
                            path="/newepisodes"
                            render={(routeParams) => (
                                <NewEpisodes
                                    {...routeParams}
                                    callAPI={props.callAPI}
                                    settings={props.settings}
                                />
                            )}
                        />
                        <Route
                            path="/filemanager/:setting_key?/:subpath?"
                            render={(routeParams) => (
                                <FileManager
                                    {...routeParams}
                                    callAPI={props.callAPI}
                                    settings={props.settings}
                                    serverInfo={props.server}
                                />
                            )}
                        />
                        <Route
                            path="/movies"
                            render={(routeParams) => (
                                <MoviesList
                                    {...routeParams}
                                    settings={props.settings}
                                    callAPI={props.callAPI}
                                />
                            )}
                        />
                        <Route path="/settings" component={Settings} />
                        <Route
                            path="/shows"
                            render={(routeParams) => (
                                <ShowsList
                                    {...routeParams}
                                    callAPI={props.callAPI}
                                />
                            )}
                        />
                        <Route
                            path={`/show/:slug/:season_number?`}
                            render={(routeParams) => (
                                <ShowInfo
                                    {...routeParams}
                                    settings={props.settings}
                                    callAPI={props.callAPI}
                                />
                            )}
                        />
                    </Grid>
                    <Grid item xs={12} className="ib-footer">
                        Idiot Box created by Destin Moulton
                    </Grid>
                </Grid>
            </Container>
        </BrowserRouter>
    );
};

const mapStateToProps = (state) => {
    const { server, settings } = state;
    return {
        settings: settings.settings,
        server: server.serverInfo,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        callAPI: (endpoint, params, callback, shouldDispatch) =>
            dispatch(callAPI(endpoint, params, callback, shouldDispatch)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(IdiotBoxLayout);
