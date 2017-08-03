import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { Icon, Layout, Menu } from 'antd';
const { Header } = Layout;

import VideoPlayerRemote from '../VideoPlayerRemote';

class IdiotBoxHeader extends Component {
    render() {
        return (
            <Header>
                <div className="logo" />
                <Menu
                    theme="dark"
                    mode="horizontal"
                    defaultSelectedKeys={['2']}
                    style={{ lineHeight: '64px' }}
                >
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
                            <Icon type="setting"/>
                        </Link>
                    </Menu.Item>
                    <Menu.Item key="remote">
                        <VideoPlayerRemote />
                    </Menu.Item>
                </Menu>
            </Header>
        );
    }
}

export default IdiotBoxHeader;