import { truncate } from 'lodash';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Col, Input, Row, Spin } from 'antd';
import MovieInfoModal from './MovieInfoModal';
import PlayButton from '../PlayButton';

import { emitAPIRequest } from '../../actions/api.actions';

class MoviesList extends Component {

    constructor(props){
        super(props);

        this.state = {
            currentSearchString: "",
            infomodalIsVisible: false,
            infomodalMovie: {},
            isLoadingMovies: false,
            movies: []
        };
    }

    componentWillMount(){
        this._getMovies();
    }

    _getMovies(){
        const { emitAPIRequest } = this.props;

        this.setState({
            isLoadingMovies: true
        });

        emitAPIRequest("movies.movies.get_all_with_file_info", {}, this._moviesReceived.bind(this), false);
    }

    _moviesReceived(movies){
        let processedMovies = [];
        movies.forEach((movie)=>{
            movie['is_visible'] = true;
            movie['searchable_text'] = this._prepStringForFilter(movie.title);
            processedMovies.push(movie);
        });
        this.setState({
            isLoadingMovies: false,
            movies: processedMovies
        });
    }

    _handleClickMovie(movie){
        this.setState({
            infomodalIsVisible: true,
            infomodalMovie: movie,
        });
    }

    _handleCloseModal(shouldReload = false){

        this.setState({
            infomodalIsVisible: false,
            infomodalMovie: {}
        });

        if(shouldReload){
            this._getMovies();
        }
    }

    _handleChangeFilter(evt){
        const { movies } = this.state;

        const currentSearchString = evt.currentTarget.value;
        const filterText = this._prepStringForFilter(currentSearchString);

        let filteredMovies = [];
        movies.forEach((movie)=>{
            if(filterText === ""){
                movie.is_visible = true;
            } else {
                movie.is_visible = true;
                if(movie.searchable_text.search(filterText) === -1){
                    movie.is_visible = false;
                }
            }
            filteredMovies.push(movie);
        });

        this.setState({
            currentSearchString,
            movies: filteredMovies
        });
    }

    _prepStringForFilter(title){
        const lowerTitle = title.toLowerCase();
        return lowerTitle.replace(/[^a-z0-9]/g, "");
    }

    _buildMovieList(){
        const { movies } = this.state;

        let movieList = [];
        movies.forEach((movie)=>{
            if(movie.is_visible){
                const playButton = this._buildPlayButton(movie);
                const movieTitle = {__html: truncate(movie.title, {length: 15})};
                const details = <Col 
                                    key={movie.id}
                                    className="ib-movies-thumbnail-box"
                                    span={4}>
                                    <div >
                                        <a  href="javascript:void(0)"
                                            onClick={this._handleClickMovie.bind(this, movie)}>
                                            <img
                                                className="ib-movies-thumbnail" 
                                                src={"/images/movies/" + movie.image_filename}/>
                                        </a>
                                        {playButton}
                                        <a  href="javascript:void(0)"
                                            onClick={this._handleClickMovie.bind(this, movie)}>
                                            <span dangerouslySetInnerHTML={movieTitle}></span>
                                        </a>
                                    </div>
                                </Col>;
                movieList.push(details);
            }
        });

        return movieList;
    }

    _buildPlayButton(movie){
        const { directories } = this.props;
        if(movie.file_info.hasOwnProperty('id')){
            const fullPath = directories.Movies + "/" + movie.file_info.subpath;
            return <PlayButton filename={movie.file_info.filename} fullPath={fullPath} />;
        }
        return "";
    }

    render() {
        const {
            currentSearchString,
            infomodalIsVisible,
            infomodalMovie,
            isLoadingMovies
        } = this.state;

        let content = "";
        if(isLoadingMovies){
            content = <Spin />;
        } else {
            content = this._buildMovieList();
        }

        return (
            <div>
                <Row>
                    <h2>Movies</h2>
                </Row>
                <Row className="ib-movies-searchbar">
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
                <MovieInfoModal
                    onClose={this._handleCloseModal.bind(this)}
                    movie={infomodalMovie}
                    isVisible={infomodalIsVisible}
                />
            </div>
        );
    }
}

const mapStateToProps = (state)=>{
    const { settings } = state;
    return {
        directories: settings.settings.directories
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        emitAPIRequest: (endpoint, params, callback, shouldDispatch)=>dispatch(emitAPIRequest(endpoint, params, callback, shouldDispatch))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MoviesList);