import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Layout, Menu } from 'antd';
const { Header } = Layout;

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
                    <Menu.Item key="browse">
                        <Link to="/browse">New Episodes</Link>
                    </Menu.Item>
                    <Menu.Item key="filemanager">
                        <Link to="/filemanager">File Manager</Link>
                    </Menu.Item>
                    <Menu.Item key="shows">
                        <Link to="/shows">Shows</Link>
                    </Menu.Item>
                    <Menu.Item key="movies_search">
                        <Link to="/movies/search">Search Movies</Link>
                    </Menu.Item>
                    <Menu.Item key="settings">
                        <Link to="/settings">Settings</Link>
                    </Menu.Item>
                </Menu>
            </Header>
        );
    }
}

export default IdiotBoxHeader;