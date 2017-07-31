import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Col, Row, Spin } from 'antd';

import { emitAPIRequest } from '../../actions/api.actions';

class ShowsList extends Component {

    constructor(props){
        super(props);

        this.state = {
            isLoadingShows: false,
            shows: []
        };
    }
    componentWillMount(){
        this._getShows();
    }

    _getShows(){
        const { emitAPIRequest, getSettingsForCategory } = this.props;

        this.setState({
            isLoadingShows: true
        });

        emitAPIRequest("shows.shows.get", {}, this._showsReceived.bind(this), false);
    }

    _showsReceived(shows){
        this.setState({
            isLoadingShows: false,
            shows
        });
    }

    _buildShowList(){
        const { shows } = this.state;

        let showList = [];
        shows.forEach((show)=>{
            const details = <Col 
                                key={show.id}
                                span={4}>
                                <div className="ib-shows-thumbnail-box">
                                    <img
                                        className="ib-shows-thumbnail" 
                                        src={"/images/shows/" + show.image_filename}/>
                                    {show.title}
                                </div>
                            </Col>;
            showList.push(details);
        });

        return showList;
    }

    render() {
        const { isLoadingShows } = this.state;

        let content = "";
        if(isLoadingShows){
            content = <Spin />;
        } else {
            content = this._buildShowList();
        }

        return (
            <div>
                <Row>
                {content}
                </Row>
            </div>
        );
    }
}

const mapStateToProps = (state)=>{
    return {};
}

const mapDispatchToProps = (dispatch) => {
    return {
        emitAPIRequest: (endpoint, params, callback, shouldDispatch)=>dispatch(emitAPIRequest(endpoint, params, callback, shouldDispatch))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ShowsList);