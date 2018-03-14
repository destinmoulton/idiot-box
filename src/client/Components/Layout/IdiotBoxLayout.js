import React, { Component } from "react";
import { BrowserRouter, Route } from "react-router-dom";

import { Layout, Menu } from "antd";
const { Header, Content, Footer } = Layout;

import FileManager from "../FileManager";
import IdiotBoxHeader from "./IdiotBoxHeader";
import MoviesList from "../Movies/MoviesList";
import NewEpisodes from "../NewEpisodes";
import Settings from "../Settings/Settings";
import ShowInfo from "../Shows/ShowInfo";
import ShowsList from "../Shows/ShowsList";

class IdiotBoxLayout extends Component {
    render() {
        return (
            <BrowserRouter>
                <Layout className="layout">
                    <IdiotBoxHeader />
                    <Content style={{ padding: "0 50px" }}>
                        <div id="ib-layout-content-box">
                            <Route
                                path="/newepisodes"
                                component={NewEpisodes}
                            />
                            <Route
                                path="/filemanager/:setting_key?/:subpath?"
                                component={FileManager}
                            />
                            <Route path="/movies" component={MoviesList} />
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
    }
}

export default IdiotBoxLayout;
