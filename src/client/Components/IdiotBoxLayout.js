import React, { Component } from 'react';

import { Link, Route } from 'react-router-dom';

//import Layout from 'antd/lib/layout';
//import Menu from 'antd/lib/menu';
//import BreadCrumb from 'antd/lib/breadcrumb';
import {Layout, Menu, BreadCrumb} from 'antd';
const { Header, Content, Footer } = Layout;

class IdiotBoxLayout extends Component {
    render() {
        return (
            <Layout className="layout">
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
                    <Menu.Item key="shows">
                        <Link to="/shows">Shows</Link>
                    </Menu.Item>
                    <Menu.Item key="movies">
                        <Link to="/movies">Movies</Link>
                    </Menu.Item>
                </Menu>
                </Header>
                <Content style={{ padding: '0 50px' }}>
                <div style={{ background: '#fff', padding: 24, minHeight: 280 }}>

                </div>
                </Content>
                <Footer style={{ textAlign: 'center' }}>
                Idiot Box created by Destin Moulton
                </Footer>
            </Layout>
        );
    }
}

export default IdiotBoxLayout;