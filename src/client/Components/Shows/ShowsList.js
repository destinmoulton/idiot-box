import { truncate } from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { Button, Col, Icon, Input, Row, Spin } from 'antd';

import { emitAPIRequest } from '../../actions/api.actions';

import AddShowModal from './AddShowModal';

class ShowsList extends Component {

    constructor(props){
        super(props);

        this.state = {
            currentSearchString: "",
            isLoadingShows: false,
            isAddShowModalVisible: false,
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

        this._filterVisibleShows(this.state.currentSearchString);
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
                const showTitle = {__html: truncate(show.title, {length: 18})};
                const details = <Col 
                                    key={show.id}
                                    className="ib-shows-thumbnail-box"
                                    span={4}>
                                    <div >
                                        <Link to={"/show/" + show.slug}>
                                            <img
                                                className="ib-shows-thumbnail" 
                                                src={"/images/shows/" + show.image_filename}/>
                                            <span dangerouslySetInnerHTML={showTitle} />
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
        const currentSearchString = evt.currentTarget.value;

        this.setState({
            currentSearchString,
        });

        this._filterVisibleShows(currentSearchString);
    }

    _filterVisibleShows(searchString){
        const { shows } = this.state;
        const filterText = this._prepStringForFilter(searchString);
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
            shows: filteredShows
        });
    }

    _handleClickAddShow(){
        this.setState({
            isAddShowModalVisible: true
        });
    }

    _handleClickClearFilter(){
        this.setState({
            currentSearchString: ""
        });
        this._filterVisibleShows("");
    }

    _cancelAddShowModal(){
        this.setState({
            isAddShowModalVisible: false
        });
    }

    _addShowComplete(){
        this.setState({
            isAddShowModalVisible: false
        });

        this._getShows();
    }

    render() {
        const { 
            currentSearchString,
            isAddShowModalVisible,
            isLoadingShows
        } = this.state;

        let content = "";
        if(isLoadingShows){
            content = <div class="ib-spinner-container"><Spin /></div>;
        } else {
            content = this._buildShowList();
        }

        return (
            <div>
                <Row>
                    <h2>Shows</h2>
                    <Input
                        autoFocus
                        value={currentSearchString}
                        onChange={this._handleChangeFilter.bind(this)}
                        style={{ width: 400 }}
                        suffix={<Icon type="close-square" onClick={this._handleClickClearFilter.bind(this)}/>}                        
                    />
                    <Button 
                        className="ib-button-green"
                        onClick={this._handleClickAddShow.bind(this)}>Add New Show</Button>
                </Row>
                <Row>
                    {content}
                </Row>
                <AddShowModal
                    isVisible={isAddShowModalVisible}
                    onCancel={this._cancelAddShowModal.bind(this)}
                    onAddShowComplete={this._addShowComplete.bind(this)}
                    currentSearchString={currentSearchString}
                />
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