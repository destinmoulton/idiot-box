import PropTypes from 'prop-types';
import React, { Component } from 'react';

import { Modal } from 'antd';

class TrashModal extends Component {
    static propTypes = {
        currentPath: PropTypes.string.isRequired,
        isVisible: PropTypes.bool.isRequired,
        itemsToTrash: PropTypes.array.isRequired,
        onTrashComplete: PropTypes.func.isRequired,
        onCancel: PropTypes.func.isRequired,
    };

    static defaultProps = {
        
    };

    _handlePressOk(){
        const { onTrashComplete } = this.props;

        onTrashComplete();
    }

    render() {
        const { currentPath, isVisible, itemsToTrash, onCancel } = this.props;

        let list = [];
        itemsToTrash.forEach((item)=>{
            list.push(<li key={item}>{item}</li>);
        });

        return (
            <div>
                <Modal
                    title="Trash Confirmation"
                    visible={isVisible}
                    onCancel={onCancel}
                    onOk={this._handlePressOk.bind(this)}
                    okText="Confirm Delete"
                    cancelText="Cancel"
                >
                    <div className="ib-trashmodal-list-box" >
                        <h4>{currentPath}</h4>
                        <ul>{list}</ul>
                    </div>
                </Modal>
            </div>
        );
    }
}

export default TrashModal;