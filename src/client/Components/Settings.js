import React, { Component } from 'react';

import { Button, Row, Col } from 'antd';

import DirectorySelectorModal from './DirectorySelectorModal';

class Settings extends Component {
    constructor(props){
        super(props);

        this.state = {
            directorySelector:{
                currentlySelectedDirectory: "",
                currentlySelectingFor: "",
                isVisible: false
            }
        };
    }

    componentDidMount(){
        
    }

    handleChangeDirectory(newDir){
        this.setState({
            directorySelector:{
                ...this.state.directorySelector,
                currentlySelectedDirectory: newDir
            }
        });
    }

    _openDirectorySelector(evt){
        const settingID = evt.currentTarget.getAttribute('data-setting-id');
        this.setState({
            directorySelector:{
                ...this.state.directorySelector,
                currentlySelectingFor: settingID,
                isVisible: true
            }
        });
        
    }

    _okDirectorySelector(){
        this.setState({
            directorySelector:{
                ...this.state.directorySelector,
                isVisible: false
            }
        });
    }

    _cancelDirectorySelector(){
        this.setState({
            directorySelector:{
                ...this.state.directorySelector,
                currentlySelectingFor: "",
                currentlySelectedDirectory: "",
                isVisible: false
            }
        });
    }

    render() {
        const { directorySelector } = this.state;
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
                            visible={directorySelector.isVisible}
                            onChangeDirectory={this.handleChangeDirectory.bind(this)}
                            onOK={this._okDirectorySelector.bind(this)}
                            onCancel={this._cancelDirectorySelector.bind(this)}
                        />
                    </Col>
                </Row>
            </div>
        );
    }
}

export default Settings;