import React, { Component } from 'react';

import { Row, Col } from 'antd';

import DirectorySelectorModal from './DirectorySelectorModal';

class Settings extends Component {
    constructor(props){
        super(props);

        this.state = {
            currentlySelectedDirectory: ""
        };
    }

    componentDidMount(){
        
    }

    handleChangeDirectory(newDir){
        this.setState({
            currentlySelectedDirectory: newDir
        });
    }

    render() {
        return (
            <div >
                <Row>
                    <Col>
                        <h3>Directories</h3>
                    </Col>
                    <Col>
                        <DirectorySelectorModal 
                            initialPath="/"
                            showFiles={false}
                            visible={false}
                            onChangeDirectory={this.handleChangeDirectory.bind(this)}
                        />
                    </Col>
                </Row>
            </div>
        );
    }
}

export default Settings;