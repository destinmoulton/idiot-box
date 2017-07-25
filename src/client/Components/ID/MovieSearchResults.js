import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Input, Row } from 'antd';

import { emitAPIRequest } from '../../actions/api.actions';

import MediaItemSearchDetails from './MediaItemSearchDetails';

class MovieSearchResults extends Component {

    static propTypes = {
        currentFilename: PropTypes.string.isRequired,
        currentPathInfo: PropTypes.object.isRequired,
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

    _handleSelectMovie(movie, imageURL){
        const { emitAPIRequest, currentFilename, currentPathInfo } = this.props;
        const options = {
            movie_info: movie,
            image_info: {
                url: imageURL
            },
            file_info: {
                setting_id: currentPathInfo.setting_id,
                subpath: currentPathInfo.subpath,
                filename: currentFilename
            }
        };
        
        emitAPIRequest("id.movie.add", options, this._idMovieComplete.bind(this), false);
    }

    _idMovieComplete(recd){
        const { onIDComplete } = this.props;

        console.log(recd);

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
            const movieDetails = <MediaItemSearchDetails 
                                    key={movie.ids.trakt} 
                                    item={movie}
                                    onSelectItem={this._handleSelectMovie.bind(this)}/>

            movieList.push(movieDetails);
        });
        return (
            <div>
                <h4>Movie - Search Results</h4>
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