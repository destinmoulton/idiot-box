import React, { Component } from 'react';

import { Button, Row, Col } from 'antd';

import DirectorySelectorModal from './DirectorySelectorModal';

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
                        <Button 
                            onClick={this._openDirectorySelector.bind(this)}
                            data-setting-id="new_setting">New Directory Setting</Button>
                        <DirectorySelectorModal 
                            initialPath="/"
                            
                        />
                    </Col>
                </Row>
            </div>
        );
    }
}

export default Settings;