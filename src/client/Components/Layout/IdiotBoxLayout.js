
import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

import { Layout, Menu } from 'antd';
const { Header, Content, Footer } = Layout;

import FileManager from '../FileManager';
import IdiotBoxHeader from './IdiotBoxHeader';
import Settings from '../Settings';
import MovieSearchResults from '../MovieSearchResults';
import VideoPlayerRemote from '../VideoPlayerRemote';

class IdiotBoxLayout extends Component {
    
    render() {
        return (
            <BrowserRouter>
                <Layout className="layout">
                    <IdiotBoxHeader />
                    <Content style={{ padding: '0 50px' }}>
                    <div style={{ background: '#fff', padding: 24, minHeight: 280 }}>
                        <Route path='/filemanager' component={FileManager}/>
                        <Route path='/movies/search' component={MovieSearchResults}/>
                        <Route path='/remote' component={VideoPlayerRemote}/>
                        <Route path='/settings' component={Settings}/>
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