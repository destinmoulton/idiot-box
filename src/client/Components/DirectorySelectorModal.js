import PropTypes from 'prop-types';
import React, { Component } from 'react';

import { Modal } from 'antd';

import FilesystemBrowser from './FilesystemBrowser';

class DirectorySelectorModal extends Component {
    static propTypes = {
        initialPath: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        visible: PropTypes.bool.isRequired,
        onChangeDirectory: PropTypes.func,
    };

    static defaultProps = {
        title: "File System Browser",
        visible: false,
        onChangeDirectory: ()=>{}
    }

    constructor(props){
        super(props);

        this.state = {
            currentlySelectedDirectory: "",
            currentlySelectingFor: "",
            isVisible: false
        };
    }

    _handleChangeDirectory(newDir){
        this.setState({
            ...this.state,
            currentlySelectedDirectory: newDir
        });
    }

    _openDirectorySelector(evt){
        const settingID = evt.currentTarget.getAttribute('data-setting-id');
        this.setState({
            ...this.state,
            currentlySelectingFor: settingID,
            isVisible: true
        });
        
    }

    _okDirectorySelector(){
        this.setState({
            ...this.state,
            isVisible: false
        });
    }

    _cancelDirectorySelector(){
        this.setState({
            ...this.state,
            currentlySelectingFor: "",
            currentlySelectedDirectory: "",
            isVisible: false
        });
    }

    render() {
        const { initialPath, title } = this.props;
        const { isVisible } = this.state;

        const posDim = {
            modalTop: 30,
            modalHeight: window.innerHeight - 180,
            fileBrowserHeight: window.innerHeight - 200
        }
        
        return (
            <div>
                <Modal
                    title={title}
                    visible={isVisible}
                    onOk={this._okDirectorySelector.bind(this)}
                    onCancel={this._cancelDirectorySelector.bind(this)}
                    okText="Choose This Directory"
                    cancelText="Cancel"
                    style={{top: posDim.modalTop, height:posDim.modalHeight}}
                >
                    <div className="ib-settings-dirsel-fs-cont" 
                         style={{height:posDim.fileBrowserHeight}}>
                    <FilesystemBrowser 
                        initialPath={initialPath} 
                        onChangeDirectory={this.handleChangeDirectory.bind(this)}
                        showDirectories={true}
                        showFiles={false}
                    />
                    </div>
                </Modal>
            </div>
        );
    }
}

export default DirectorySelectorModal;