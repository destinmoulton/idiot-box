import PropTypes from "prop-types";
import React, { Component } from "react";
import { Link } from "react-router-dom";

import { Button, Icon, Layout, Menu } from "antd";
const { Header } = Layout;

import VideoPlayerRemoteModal from "./VideoPlayerRemoteModal";

class IdiotBoxHeader extends Component {
    constructor(props) {
        super(props);

        this.state = {
            remoteModalIsVisible: false
        };

        this._handleRemoteModalClose = this._handleRemoteModalClose.bind(this);
        this._handleRemoteModalOpen = this._handleRemoteModalOpen.bind(this);
    }

    _handleRemoteModalOpen() {
        this.setState({
            remoteModalIsVisible: true
        });
    }

    _handleRemoteModalClose() {
        this.setState({
            remoteModalIsVisible: false
        });
    }

    render() {
        const { remoteModalIsVisible } = this.state;

        return (
            <Header>
                <Menu
                    theme="dark"
                    mode="horizontal"
                    defaultSelectedKeys={["2"]}
                    style={{ lineHeight: "40px" }}
                >
                    <Menu.Item key="newepisodes">
                        <Link to="/newepisodes">New</Link>
                    </Menu.Item>
                    <Menu.Item key="filemanager">
                        <Link to="/filemanager/Downloads">File Manager</Link>
                    </Menu.Item>
                    <Menu.Item key="shows">
                        <Link to="/shows">Shows</Link>
                    </Menu.Item>
                    <Menu.Item key="movies">
                        <Link to="/movies">Movies</Link>
                    </Menu.Item>
                    <Menu.Item key="settings">
                        <Link to="/settings">
                            <Icon type="setting" />
                        </Link>
                    </Menu.Item>
                    <Menu.Item key="remote">
                        <div onClick={this._handleRemoteModalOpen}>
                            <Icon type="video-camera" />
                        </div>
                        <VideoPlayerRemoteModal
                            callAPI={this.props.callAPI}
                            onCancel={this._handleRemoteModalClose}
                            isVisible={remoteModalIsVisible}
                        />
                    </Menu.Item>
                </Menu>
            </Header>
        );
    }
}

IdiotBoxHeader.propTypes = {
    callAPI: PropTypes.func.isRequired
};

export default IdiotBoxHeader;
