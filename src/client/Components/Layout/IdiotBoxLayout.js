
import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

import { Layout, Menu } from 'antd';
const { Header, Content, Footer } = Layout;

import FileManager from '../FileManager';
import IdiotBoxHeader from './IdiotBoxHeader';
import Settings from '../Settings/Settings';
import ShowsList from '../Shows/ShowsList';


class IdiotBoxLayout extends Component {
    
    render() {
        return (
            <BrowserRouter>
                <Layout className="layout">
                    <IdiotBoxHeader />
                    <Content style={{ padding: '0 50px' }}>
                    <div style={{ background: '#fff', padding: 24, minHeight: 280 }}>
                        <Route path='/filemanager' component={FileManager}/>
                        <Route path='/settings' component={Settings}/>
                        <Route path='/shows' component={ShowsList}/>
                    </div>
                    </Content>
                    <Footer style={{ textAlign: 'center' }}>
                    Idiot Box created by Destin Moulton
                    </Footer>
                </Layout>
            </BrowserRouter>
        );
    }
}

export default IdiotBoxLayout;