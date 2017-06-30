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
        onOK: PropTypes.func.isRequired,
        onCancel: PropTypes.func.isRequired,
    };

    static defaultProps = {
        title: "File System Browser",
        visible: false,
        onChangeDirectory: ()=>{}
    }

    render() {

        const { initialPath, onChangeDirectory, onOK, onCancel, title, visible } = this.props;

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
                    onOk={onOK}
                    onCancel={onCancel}
                    okText="Choose This Directory"
                    cancelText="Cancel"
                    style={{top: posDim.modalTop, height:posDim.modalHeight}}
                >
                    <div className="ib-settings-dirsel-fs-cont" 
                         style={{height:posDim.fileBrowserHeight}}>
                    <FilesystemBrowser 
                        initialPath={initialPath} 
                        onChangeDirectory={onChangeDirectory}
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