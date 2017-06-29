import React, { Component } from 'react';

import { Row, Col } from 'antd';

import FilesystemBrowser from './FilesystemBrowser';

class Settings extends Component {
    componentDidMount(){
        
    }
    render() {
        return (
            <div >
                <Row>
                    <Col>
                        <h3>Directories</h3>
                    </Col>
                    <Col>
                        <FilesystemBrowser initialPath={"/home/destin"}/>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default Settings;