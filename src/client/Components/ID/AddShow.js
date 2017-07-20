import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Input, Row } from 'antd';

import { emitAPIRequest } from '../../actions/api.actions';

import MediaItemSearchDetails from './MediaItemSearchDetails';

class AddShow extends Component {
    static propTypes = {
        currentFilename: PropTypes.string.isRequired,
        onIDComplete: PropTypes.func.isRequired
    };

    constructor(props){
        super(props);

        this.state = {
            currentSearchString: "",
            shows: []
        };
    }

    _handleSelectMovie(show, imageURL){
        const { emitAPIRequest, currentFilename } = this.props;
        const options = {
            show_info: show,
            image_info: {
                url: imageURL
            }
        };
        
        emitAPIRequest("id.show.add", options, this._idShowComplete.bind(this), false);
    }

    _idShowComplete(recd){
        const { onIDComplete } = this.props;

        console.log(recd);

        onIDComplete();
    }

    _handleChangeSearchInput(evt){
        this.setState({
            currentSearchString: evt.currentTarget.value
        });
    }

    _handleSearchPress(){
        this._getSearchResultsFromServer();
    }

    _getSearchResultsFromServer(){
        const { currentSearchString } = this.state;
        const { emitAPIRequest } = this.props;

        const options = {
            search_string:currentSearchString
        };
        
        emitAPIRequest("mediascraper.shows.search", options, this._searchResultsReceived.bind(this), false);
    }

    _searchResultsReceived(results){
        this.setState({
            shows: results
        });
    }

    render() {
        const { currentFilename } = this.props;
        const { currentSearchString, shows } = this.state;

        let showList = [];
        shows.forEach((show)=>{
            const showDetails = <MediaItemSearchDetails 
                                    key={show.ids.trakt} 
                                    item={show}
                                    onSelectItem={this._handleSelectMovie.bind(this)}/>

            showList.push(showDetails);
        });
        return (
            <div>
                <h4>Add a Show</h4>
                <h5>{currentFilename}</h5>
                <Input.Search
                    value={currentSearchString}
                    onChange={this._handleChangeSearchInput.bind(this)}
                    style={{ width: 400 }}
                    onSearch={this._handleSearchPress.bind(this)}
                />
                <Row>
                    {showList}
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

export default connect(mapStateToProps, mapDispatchToProps)(AddShow);