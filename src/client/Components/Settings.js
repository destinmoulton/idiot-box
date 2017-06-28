
import React, { Component } from 'react';

import io from 'socket.io-client';

import { Row, Col } from 'antd';


class Settings extends Component {
    componentDidMount(){
        const socket = io();
        socket.emit('settings.test', "TEST DATA");

    }
    render() {
        return (
            <div >
                <Row>
                    <Col>
                        <h3>Directories</h3>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default Settings;