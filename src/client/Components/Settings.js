import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Row, Col } from 'antd';

import DirectoriesEditor from './Settings/DirectoriesEditor';

class Settings extends Component {
    constructor(props){
        super(props);

    }

    componentOnMount(){
        this.props.getSettingsForCategory('directories');
    }

    render() {
        const { settings } = this.props;
        return (
            <div >
                <Row>
                    <Col>
                        <h3>Directories</h3>
                    </Col>
                    <Col>
                        <DirectoriesEditor settings={settings.directories}/>
                    </Col>
                </Row>
            </div>
        );
    }
}

const mapStateToProps = (state)=>{
    const { settings } = state;
    return {
        settings:settings.settings
    }
}

const mapDispatchToProps = (dispatch)=>{
    return {
        getSettingsForCategory: (category)=>dispatch(getSettingsForCategory(category))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Settings);