
import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

import { Layout, Menu } from 'antd';
const { Header, Content, Footer } = Layout;

import IdiotBoxHeader from './IdiotBoxHeader';
import Settings from '../Settings';
import MovieSearchResults from '../MovieSearchResults';

class IdiotBoxLayout extends Component {
    
    render() {
        return (
            <BrowserRouter>
                <Layout className="layout">
                    <IdiotBoxHeader />
                    <Content style={{ padding: '0 50px' }}>
                    <div style={{ background: '#fff', padding: 24, minHeight: 280 }}>
                        <Route path='/settings' component={Settings}/>
                        <Route path='/movies/search' component={MovieSearchResults}/>
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