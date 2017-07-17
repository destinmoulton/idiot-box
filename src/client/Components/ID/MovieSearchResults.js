import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Input, Row } from 'antd';

import { emitAPIRequest } from '../../actions/api.actions';

import MovieSearchDetails from './MovieSearchDetails';

class MovieSearchResults extends Component {

    static propTypes = {
        currentFilename: PropTypes.string.isRequired,
        initialSearchString: PropTypes.string.isRequired,
        onIDComplete: PropTypes.func.isRequired
    };

    constructor(props){
        super(props);

        this.state = {
            currentSearchString: props.initialSearchString,
            movies: []
        };
    }

    componentWillMount(){
        this._getSearchResultsFromServer();
    }

    _handleSelectMovie(movie){
        const { onIDComplete } = this.props;
        console.log("Selected movie", movie);
        onIDComplete();
    }

    _handleSearchPress(){
        this._getSearchResultsFromServer();
    }

    _handleChangeSearchInput(evt){
        this.setState({
            currentSearchString: evt.currentTarget.value
        });
    }

    _getSearchResultsFromServer(){
        const { currentSearchString } = this.state;
        const { emitAPIRequest } = this.props;

        const options = {
            search_string:currentSearchString
        };
        
        emitAPIRequest("mediascraper.movies.search", options, this._searchResultsReceived.bind(this), false);
    }

    _searchResultsReceived(results){
        this.setState({
            movies: results
        });
    }

    render() {
        const { currentFilename } = this.props;
        const { currentSearchString, movies } = this.state;

        let movieList = [];
        movies.forEach((movie)=>{
            const movieDetails = <MovieSearchDetails 
                                    key={movie.ids.trakt} 
                                    movie={movie}
                                    onSelectMovie={this._handleSelectMovie.bind(this)}/>

            movieList.push(movieDetails);
        });
        return (
            <div>
                <h4>Movie - Search Results</h4>
                <h5>{currentFilename}</h5>
                <Input.Search
                    value={currentSearchString}
                    onChange={this._handleChangeSearchInput.bind(this)}
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