import PropTypes from 'prop-types';
import React, { Component } from 'react';

import { Modal } from 'antd';

import FilesystemBrowser from './FilesystemBrowser';

class DirectorySelectorModal extends Component {
    static propTypes = {
        handleOK: PropTypes.func.isRequired,
        initialPath: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        visible: PropTypes.bool.isRequired,
        onChangeDirectory: PropTypes.optionalFunc
    };

    static defaultProps = {
        title: "File System Browser",
        visible: false,
        onChangeDirectory: ()=>{}
    }

    render() {
        const { handleOK, initialPath, onChangeDirectory, title, visible } = this.props;
        return (
            <div>
                <Modal
                    title={title}
                    visible={visible}
                    onOk={handleOK}
                >
                    <FilesystemBrowser 
                        initialPath={initialPath} 
                        onChangeDirectory={onChangeDirectory}
                    />
                </Modal>
            </div>
        );
    }
}

export default DirectorySelectorModal;