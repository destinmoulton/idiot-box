import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';

import { 
    Button,
    Checkbox,
    Col,
    Input,
    Modal,
    Row
} from 'antd';

import MovieCheckForm from './MovieCheckForm';

class IDFileModal extends Component {
    static propTypes = {
        currentFilename: PropTypes.string.isRequired,
        isVisible: PropTypes.bool.isRequired,
        onCancel: PropTypes.func.isRequired,
        onOk: PropTypes.func.isRequired
    };

    constructor(props){
        super(props);

        this.state = {
            isIDing: false
        };
    }

    _handlePressOk(){

    }

    render() {
        const { currentFilename, isVisible, onCancel } = this.props;
        const { isIDing } = this.state;

        return (
            <div>
                <Modal
                    title="ID File"
                    visible={isVisible}
                    onCancel={onCancel}
                    onOk={this._handlePressOk.bind(this)}
                    footer={[
                        <Button key="cancel" size="large" onClick={onCancel}>Cancel</Button>,
                        <Button key="submit" type="primary" size="large" loading={isIDing} onClick={this._handlePressOk.bind(this)}>
                        Confirm ID
                        </Button>,
                    ]}
                >
                    <Row>
                        <Col span={8}>
                            <MovieCheckForm currentFilename={currentFilename}/>
                        </Col>
                    </Row>
                </Modal>
            </div>
        );
    }
}

export default IDFileModal;