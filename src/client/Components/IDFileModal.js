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
            checkedMovieNames: [],
            isIDing: false
        };
    }

    _handlePressOk(){

    }

    _handleClickMovieCheck(name){
        const { checkedMovieNames } = this.state;

        const possibleNameIndex = checkedMovieNames.indexOf(name);
        if(possibleNameIndex > -1){
            checkedMovieNames.splice(possibleNameIndex, 1);
        } else {
            checkedMovieNames.push(name);
        }

        this.setState({
            checkedMovieNames
        });
    }

    _buildMovieIDForm(){
        const { currentFilename } = this.props;
        const { checkedMovieNames } = this.state;

        const possibleNames = currentFilename.split(".");

        let possibleChecks = [];
        possibleNames.forEach((name)=>{
            const checkBox = <div><Checkbox key={name} onChange={this._handleClickMovieCheck.bind(this,name)}>{name}</Checkbox></div>
            possibleChecks.push(checkBox);
        });

        return (
            <div>
                <Input placeholder="Movie search..." value={checkedMovieNames.join(" ")} />
                <div>
                    {possibleChecks}
                </div>
            </div>
        );
    }

    render() {
        const { isVisible, onCancel } = this.props;
        const { isIDing } = this.state;

        const movieIDForm = this._buildMovieIDForm();
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
                            {movieIDForm}
                        </Col>
                    </Row>
                </Modal>
            </div>
        );
    }
}

export default IDFileModal;