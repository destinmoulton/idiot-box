import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

import { Layout, Menu } from 'antd';
const { Header, Content, Footer } = Layout;

import FileManager from '../FileManager';
import IdiotBoxHeader from './IdiotBoxHeader';
import MoviesList from '../Movies/MoviesList';
import Settings from '../Settings/Settings';
import ShowInfo from '../Shows/ShowInfo';
import ShowsList from '../Shows/ShowsList';

class IdiotBoxLayout extends Component {
    
    render() {
        return (
            <BrowserRouter>
                <Layout className="layout">
                    <IdiotBoxHeader />
                    <Content style={{ padding: '0 50px' }}>
                    <div style={{ background: '#fff', padding: 24, minHeight: 280 }}>
                        <Route path='/filemanager/:setting_key?/:subpath?' component={FileManager}/>
                        <Route path='/movies' component={MoviesList}/>
                        <Route path='/settings' component={Settings}/>
                        <Route path='/shows' component={ShowsList}/>
                        <Route path={`/show/:slug`} component={ShowInfo}/>
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