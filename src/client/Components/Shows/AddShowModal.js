import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Button, Col, Input, Modal, Select } from 'antd';

import ShowResults from './ShowResults';

class AddShowModal extends Component {
    static propTypes = {
        currentSearchString: PropTypes.string.isRequired,
        isVisible: PropTypes.bool.isRequired,
        onAddShowComplete: PropTypes.func.isRequired,
        onCancel: PropTypes.func.isRequired
    }

    constructor(props){
        super(props);


    }

    render(){
        const {
            currentSearchString,
            isVisible,
            onAddShowComplete,
            onCancel,
        } = this.props;

        return (
            <Modal
                    title="Add New Show"
                    visible={isVisible}
                    onCancel={onCancel}
                    footer={[
                        <Button key="cancel" size="large" onClick={onCancel}>Cancel</Button>
                    ]}
                    width={700}
                >
                <ShowResults
                    currentSearchString={currentSearchString}
                    onAddShowComplete={onAddShowComplete}/>
            </Modal>
        );
    }
}

export default AddShowModal;