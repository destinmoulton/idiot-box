import PropTypes from 'prop-types';
import React, { Component } from 'react';

import { connect } from 'react-redux';

import IdiotBoxLayout from './Layout/IdiotBoxLayout';
import IdiotBoxLoading from './Layout/IdiotBoxLoading';

import { srvConnect, srvGetServerInfo } from '../actions/server.actions';

class IdiotBox extends Component {
    static propTypes = {
        isServerConnected: PropTypes.bool.isRequired,
        hasServerInfo: PropTypes.bool.isRequired,
        serverInfo: PropTypes.object.isRequired
    };

    componentWillMount(){
        this.props.srvConnect();
    }
    
    render() {
        const { isServerConnected, hasServerInfo } = this.props;

        const displayComponent = (isServerConnected && hasServerInfo) ? <IdiotBoxLayout /> : <IdiotBoxLoading />;
        
        return (
            <div>
                {displayComponent}
            </div>
        );
    }
}

const mapStateToProps = (state)=>{
    const { server } = state;
    const { isServerConnected, hasServerInfo, serverInfo } = server;
    return {
        isServerConnected,
        hasServerInfo,
        serverInfo
    }
}

const mapDispatchToProps = (dispatch)=>{
    return {
        srvConnect: ()=>dispatch(srvConnect()),
        srvGetServerInfo: ()=>dispatch(srvGetServerInfo())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(IdiotBox);