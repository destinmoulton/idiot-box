import React, { Component } from 'react';

import { Row, Col } from 'antd';

import DirectoriesEditor from './Settings/DirectoriesEditor';

class Settings extends Component {
    constructor(props){
        super(props);

    }

    render() {
        return (
            <div >
                <Row>
                    <Col>
                        <h3>Directories</h3>
                    </Col>
                    <Col>
                        <DirectoriesEditor />
                    </Col>
                </Row>
            </div>
        );
    }
}

export default Settings;