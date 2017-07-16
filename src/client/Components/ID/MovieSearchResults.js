import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Input, Row } from 'antd';

import { emitAPIRequest } from '../actions/api.actions';

import MovieSearchDetails from './MovieSearchDetails';

class MovieSearchResults extends Component {

    constructor(props){
        super(props);

        this.state = {
            movies: []
        };
    }

    _handleSearchPress(searchString){
        this._getSearchResultsFromServer(searchString);
    }

    _getSearchResultsFromServer(searchString){
        const { emitAPIRequest } = this.props;

        const options = {
            search_string:searchString
        };
        
        emitAPIRequest("mediascraper.movies.search", options, this._searchResultsReceived.bind(this), false);
    }

    _searchResultsReceived(results){
        this.setState({
            movies: results
        });
    }

    render() {
        const { movies } = this.state;

        let movieList = [];
        movies.forEach((movie)=>{
            movieList.push(<MovieSearchDetails key={movie.ids.trakt} movie={movie}/>);
        });
        return (
            <div>
                <h3>Movies</h3>
                <Input.Search
                    placeholder="Search movies..."
                    style={{ width: 400 }}
                    onSearch={this._handleSearchPress.bind(this)}
                />
                <Row>
                    {movieList}
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

export default connect(mapStateToProps, mapDispatchToProps)(MovieSearchResults);