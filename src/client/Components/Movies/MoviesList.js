import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Col, Row, Spin } from 'antd';
import MovieInfoModal from './MovieInfoModal';

import { emitAPIRequest } from '../../actions/api.actions';

class MoviesList extends Component {

    constructor(props){
        super(props);

        this.state = {
            infomodalIsVisible: false,
            infomodalMovie: {},
            isLoadingMovies: false,
            movies: []
        };
    }

    componentWillMount(){
        this._getShows();
    }

    _getShows(){
        const { emitAPIRequest } = this.props;

        this.setState({
            isLoadingMovies: true
        });

        emitAPIRequest("movies.movies.get_all", {}, this._moviesReceived.bind(this), false);
    }

    _moviesReceived(movies){
        this.setState({
            isLoadingMovies: false,
            movies
        });
    }

    _handleClickMovie(movie){
        this.setState({
            infomodalIsVisible: true,
            infomodalMovie: movie,
        });
    }

    _handleCloseModal(){
        this.setState({
            infomodalIsVisible: false,
            infomodalMovie: {}
        });
    }

    _buildMovieList(){
        
        const { movies } = this.state;

        let movieList = [];
        movies.forEach((movie)=>{
            const details = <Col 
                                key={movie.id}
                                span={4}>
                                <div className="ib-movies-thumbnail-box">
                                    <a  href="javascript:void(0)"
                                        onClick={this._handleClickMovie.bind(this, movie)}>
                                        <img
                                            className="ib-movies-thumbnail" 
                                            src={"/images/movies/" + movie.image_filename}/>
                                        <span dangerouslySetInnerHTML={{__html: movie.title}}></span>
                                    </a>
                                </div>
                            </Col>;
            movieList.push(details);
        });

        return movieList;
    }

    render() {
        const {
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
    return {};
}

const mapDispatchToProps = (dispatch) => {
    return {
        emitAPIRequest: (endpoint, params, callback, shouldDispatch)=>dispatch(emitAPIRequest(endpoint, params, callback, shouldDispatch))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MoviesList);