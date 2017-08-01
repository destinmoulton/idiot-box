import PropTypes from 'prop-types';
import React, { Component } from 'react';

import { connect } from 'react-redux';

import IdiotBoxLayout from './Layout/IdiotBoxLayout';
import IdiotBoxLoading from './Layout/IdiotBoxLoading';

import { setupAPI } from '../actions/api.actions';
import { srvConnect, srvGetServerInfo } from '../actions/server.actions';
import { getAllSettings } from '../actions/settings.actions';

class IdiotBox extends Component {
    static propTypes = {
        isServerConnected: PropTypes.bool.isRequired,
        hasServerInfo: PropTypes.bool.isRequired,
        serverInfo: PropTypes.object.isRequired
    };

    constructor(props){
        super(props);
        this._serverIsConnected = false;
        this._hasSettings = false;
    }

    componentWillMount(){
        this.props.srvConnect();
    }

    componentWillReceiveProps(nextProps){
        const { getAllSettings, setupAPI } = this.props;

        if(nextProps.isServerConnected && !this._serverIsConnected){
            // The server just connected
            this._serverIsConnected = true;

            // Setup the API listeners
            setupAPI();

            // Get all of the settings
            getAllSettings();
        }
    }
    
    render() {
        const {
            isServerConnected,
            hasAllSettings,
            hasServerInfo
        } = this.props;

        const displayComponent = (isServerConnected && hasAllSettings && hasServerInfo) ? <IdiotBoxLayout /> : <IdiotBoxLoading />;
        
        return (
            <div>
                {displayComponent}
            </div>
        );
    }
}

const mapStateToProps = (state)=>{
    const { server, settings } = state;
    const { isServerConnected, hasServerInfo, serverInfo } = server;
    const { hasAllSettings } = settings;
    return {
        isServerConnected,
        hasAllSettings,
        hasServerInfo,
        serverInfo
    }
}

const mapDispatchToProps = (dispatch)=>{
    return {
        getAllSettings: ()=>dispatch(getAllSettings()),
        setupAPI: ()=>dispatch(setupAPI()),
        srvConnect: ()=>dispatch(srvConnect()),
        srvGetServerInfo: ()=>dispatch(srvGetServerInfo())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(IdiotBox);