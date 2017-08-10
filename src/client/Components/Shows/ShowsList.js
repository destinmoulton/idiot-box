import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Col, Icon, Input, Row, Spin } from 'antd';

import { emitAPIRequest } from '../../actions/api.actions';

class ShowsList extends Component {

    constructor(props){
        super(props);

        this.state = {
            currentSearchString: "",
            isLoadingShows: false,
            shows: []
        };
    }

    componentWillMount(){
        this._getShows();
    }

    _getShows(){
        const { emitAPIRequest } = this.props;

        this.setState({
            isLoadingShows: true
        });

        emitAPIRequest("shows.shows.get_all_with_locked_info", {}, this._showsReceived.bind(this), false);
    }

    _showsReceived(shows){
        let newShows = [];
        shows.forEach((show)=>{
            show['is_visible'] = true;
            show['searchable_text'] = this._prepStringForFilter(show.title);
            newShows.push(show);
        });

        this.setState({
            isLoadingShows: false,
            shows: newShows
        });
    }

    _prepStringForFilter(title){
        const lowerTitle = title.toLowerCase();
        return lowerTitle.replace(/[^a-z0-9]/g, "");
    }

    _buildShowList(){
        const { shows } = this.state;

        let showList = [];
        shows.forEach((show)=>{
            if(show.is_visible){
                const details = <Col 
                                    key={show.id}
                                    className="ib-shows-thumbnail-box"
                                    span={4}>
                                    <div >
                                        <Link to={"/show/" + show.slug}>
                                            <img
                                                className="ib-shows-thumbnail" 
                                                src={"/images/shows/" + show.image_filename}/>
                                            {show.title.substring(0, 21)}
                                            <br/>[ {show.num_seasons_locked} <Icon type="lock" /> ][ {show.num_seasons_unlocked} <Icon type="unlock" /> ]
                                        </Link>
                                    </div>
                                </Col>;
                showList.push(details);
            }
        });

        return showList;
    }

    _handleChangeFilter(evt){
        const { shows } = this.state;

        const currentSearchString = evt.currentTarget.value;
        const filterText = this._prepStringForFilter(currentSearchString);
        let filteredShows = [];

        shows.forEach((show)=>{
            if(filterText === ""){
                show.is_visible = true;
            } else {
                show.is_visible = true;
                if(show.searchable_text.search(filterText) === -1){
                    show.is_visible = false;
                }
            }
            filteredShows.push(show);
        });

        this.setState({
            currentSearchString,
            shows: filteredShows
        });
    }

    render() {
        const { 
            currentSearchString,
            isLoadingShows
        } = this.state;

        let content = "";
        if(isLoadingShows){
            content = <Spin />;
        } else {
            content = this._buildShowList();
        }

        return (
            <div>
                <Row>
                    <h2>Shows</h2>
                    <Input.Search
                        autoFocus
                        value={currentSearchString}
                        onChange={this._handleChangeFilter.bind(this)}
                        style={{ width: 400 }}
                        onSearch={this._handleChangeFilter.bind(this)}
                    />
                </Row>
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