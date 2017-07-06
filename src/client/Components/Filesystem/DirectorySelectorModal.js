import PropTypes from 'prop-types';
import React, { Component } from 'react';

import { Modal } from 'antd';

import FilesystemBrowser from './FilesystemBrowser';

class DirectorySelectorModal extends Component {
    static propTypes = {
        initialPath: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        visible: PropTypes.bool,
        onCancel: PropTypes.func,
        onChangeDirectory: PropTypes.func.isRequired,
        onOk: PropTypes.func.isRequired,
    };

    static defaultProps = {
        title: "Select Directory",
        visible: false,
        onChangeDirectory: ()=>{},
        onCancel: ()=>{}
    }

    constructor(props){
        super(props);
    }

    render() {
        const { initialPath,
                onCancel,
                onChangeDirectory,
                onOk,
                title,
                visible } = this.props;

        const posDim = {
            modalTop: 30,
            modalHeight: window.innerHeight - 180,
            fileBrowserHeight: window.innerHeight - 200
        }
        
        return (
            <div>
                <Modal
                    title={title}
                    visible={visible}
                    onCancel={onCancel}
                    onOk={onOk}
                    okText="Choose This Directory"
                    cancelText="Cancel"
                    style={{top: posDim.modalTop, height:posDim.modalHeight}} >
                    <div className="ib-settings-dirsel-fs-cont" 
                         style={{height:posDim.fileBrowserHeight}}>
                        <FilesystemBrowser 
                            initialPath={initialPath} 
                            onChangeDirectory={onChangeDirectory}
                            showDirectories={true}
                            showFiles={false} />
                    </div>
                </Modal>
            </div>
        );
    }
}

export default DirectorySelectorModal;