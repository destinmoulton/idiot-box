import React, {Component} from "react";
import {connect} from "react-redux";
import {Route, Routes, useNavigate} from "react-router-dom";
import {Container, Grid} from "@mui/material";
import {callAPI} from "../../actions/api.actions";

import FileManager from "../FileManager";
import IdiotBoxHeader from "./IdiotBoxHeader";
import MoviesList from "../Movies/MoviesList";
import NewEpisodes from "../NewEpisodes";
import Settings from "../Settings/Settings";
import ShowInfo from "../Shows/ShowInfo/ShowInfo";
import ShowsList from "../Shows/ShowsList";

const IdiotBoxLayout = (props) => {
    return (
        <div>
            <IdiotBoxHeader callAPI={props.callAPI}/>
            <Container className="layout">
                <Routes>
                    <Route
                        path="/"
                        exact
                        element={
                            <NewEpisodes
                                callAPI={props.callAPI}
                                settings={props.settings}
                                history={useNavigate()}
                            />
                        }
                    />
                    <Route
                        path="/newepisodes"
                        element={
                            <NewEpisodes
                                callAPI={props.callAPI}
                                settings={props.settings}
                                history={useNavigate()}
                            />
                        }
                    />
                    <Route
                        path="/filemanager/:setting_key?/:subpath?"
                        element={
                            <FileManager
                                callAPI={props.callAPI}
                                settings={props.settings}
                                serverInfo={props.server}
                                history={useNavigate()}
                            />
                        }
                    />
                    <Route
                        path="/movies"
                        element={
                            <MoviesList
                                settings={props.settings}
                                callAPI={props.callAPI}
                                history={useNavigate()}
                            />
                        }
                    />
                    <Route path="/settings" component={Settings}/>
                    <Route
                        path="/shows"
                        element={
                            <ShowsList callAPI={props.callAPI}
                                       history={useNavigate()}/>
                        }
                    />
                    <Route
                        path="/show/:slug"
                    >
                        <Route path=":season_number"
                               element={
                                   <ShowInfo
                                       settings={props.settings}
                                       callAPI={props.callAPI}
                                       history={useNavigate()}
                                   />
                               }/>
                        <Route path=""
                               element={
                                   <ShowInfo
                                       settings={props.settings}
                                       callAPI={props.callAPI}
                                       history={useNavigate()}
                                   />
                               }/>
                    </Route>
                </Routes>
            </Container>
            <Grid container className="ib-footer">
                <Grid item xs={12}>
                    Idiot Box created by Destin Moulton
                </Grid>
            </Grid>
        </div>
    );
};

const mapStateToProps = (state) => {
    const {server, settings} = state;
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
