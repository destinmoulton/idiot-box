import React, { Component } from "react";
import { connect } from "react-redux";
import { BrowserRouter, Redirect, Route } from "react-router-dom";

import { Layout, Menu } from "antd";
const { Header, Content, Footer } = Layout;

import { callAPI } from "../../actions/api.actions";

import FileManager from "../FileManager";
import IdiotBoxHeader from "./IdiotBoxHeader";
import MoviesList from "../Movies/MoviesList";
import NewEpisodes from "../NewEpisodes";
import Settings from "../Settings/Settings";
import ShowInfo from "../Shows/ShowInfo";
import ShowsList from "../Shows/ShowsList";

const IdiotBoxLayout = props => {
    return (
        <BrowserRouter>
            <Layout className="layout">
                <IdiotBoxHeader />
                <Content style={{ padding: "0 50px" }}>
                    <div id="ib-layout-content-box">
                        <Route path="/" exact component={NewEpisodes} />
                        <Route path="/newepisodes" component={NewEpisodes} />
                        <Route
                            path="/filemanager/:setting_key?/:subpath?"
                            render={routeParams => (
                                <FileManager
                                    {...routeParams}
                                    settings={props.settings}
                                />
                            )}
                        />
                        <Route
                            path="/movies"
                            render={() => (
                                <MoviesList
                                    settings={props.settings}
                                    callAPI={props.callAPI}
                                />
                            )}
                        />
                        <Route path="/settings" component={Settings} />
                        <Route path="/shows" component={ShowsList} />
                        <Route
                            path={`/show/:slug/:season_number?`}
                            component={ShowInfo}
                        />
                    </div>
                </Content>
                <Footer style={{ textAlign: "center" }}>
                    Idiot Box created by Destin Moulton
                </Footer>
            </Layout>
        </BrowserRouter>
    );
};

const mapStateToProps = state => {
    const { settings } = state;
    return {
        settings: settings.settings
    };
};

const mapDispatchToProps = dispatch => {
    return {
        callAPI: (endpoint, params, callback, shouldDispatch) =>
            dispatch(callAPI(endpoint, params, callback, shouldDispatch))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(IdiotBoxLayout);
