import { truncate } from "lodash";
import PropTypes from "prop-types";
import React, { Component } from "react";
import { connect } from "react-redux";

import { Col, Input, Row, Spin } from "antd";
import MovieInfoModal from "./MovieInfoModal";
import MovieThumbInfo from "./MovieThumbInfo";

import { emitAPIRequest } from "../../actions/api.actions";

class MoviesList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            currentSearchString: "",
            infomodalIsVisible: false,
            infomodalMovie: {},
            isLoadingMovies: false,
            movies: []
        };
    }

    componentWillMount() {
        this._getMovies();
    }

    _getMovies() {
        const { emitAPIRequest } = this.props;

        this.setState({
            isLoadingMovies: true
        });

        emitAPIRequest(
            "movies.movies.get_all_with_file_info",
            {},
            this._moviesReceived.bind(this),
            false
        );
    }

    _moviesReceived(movies) {
        let processedMovies = [];
        movies.forEach(movie => {
            movie["is_visible"] = true;
            movie["searchable_text"] = this._prepStringForFilter(movie.title);
            processedMovies.push(movie);
        });
        this.setState({
            isLoadingMovies: false,
            movies: processedMovies
        });
    }

    _handleClickMovie(movie) {
        this.setState({
            infomodalIsVisible: true,
            infomodalMovie: movie
        });
    }

    _handleCloseModal(shouldReload = false) {
        this.setState({
            infomodalIsVisible: false,
            infomodalMovie: {}
        });

        if (shouldReload) {
            this._getMovies();
        }
    }

    _handlePressDelete(movie) {
        if (
            confirm(
                `Really delete ${movie.title}?\nThis will NOT remove the file.`
            )
        ) {
            this._deleteMovie(movie);
        }
    }

    _deleteMovie(movie) {
        const { emitAPIRequest } = this.props;

        const params = {
            movie_id: movie.id
        };

        emitAPIRequest(
            "movies.movie.delete",
            params,
            this._movieDeleteComplete.bind(this, movie.id),
            false
        );
    }

    _movieDeleteComplete(movieId) {
        // Delete can be called from the modal (close it)
        this._handleCloseModal(false);

        const { movies } = this.state;

        const filteredMovies = movies.filter(movie => {
            return movie.id !== movieId;
        });

        this.setState({
            movies: filteredMovies
        });
    }

    _handleChangeFilter(evt) {
        const { movies } = this.state;

        const currentSearchString = evt.currentTarget.value;
        const filterText = this._prepStringForFilter(currentSearchString);

        let filteredMovies = [];
        movies.forEach(movie => {
            if (filterText === "") {
                movie.is_visible = true;
            } else {
                movie.is_visible = true;
                if (movie.searchable_text.search(filterText) === -1) {
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

    _prepStringForFilter(title) {
        const lowerTitle = title.toLowerCase();
        return lowerTitle.replace(/[^a-z0-9]/g, "");
    }

    _buildMovieList() {
        const { movies } = this.state;

        let movieList = [];
        movies.forEach(movie => {
            if (movie.is_visible) {
                movieList.push(
                    <Col
                        key={movie.id}
                        className="ib-movies-thumbnail-box"
                        span={4}
                    >
                        <MovieThumbInfo
                            movie={movie}
                            directories={this.props.directories}
                            onClickDelete={this._handlePressDelete.bind(this)}
                            onClickMovie={this._handleClickMovie.bind(this)}
                        />
                    </Col>
                );
            }
        });

        return movieList;
    }

    render() {
        const {
            currentSearchString,
            infomodalIsVisible,
            infomodalMovie,
            isLoadingMovies,
            movies
        } = this.state;

        let content = "";
        if (isLoadingMovies) {
            content = (
                <div className="ib-spinner-container">
                    <Spin />
                </div>
            );
        } else {
            content = this._buildMovieList();
        }

        const filterPlaceholder = `Filter ${movies.length} movies...`;
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
                        placeholder={filterPlaceholder}
                    />
                </Row>
                <Row>{content}</Row>
                <MovieInfoModal
                    onClickDelete={this._handlePressDelete.bind(this)}
                    onClose={this._handleCloseModal.bind(this)}
                    movie={infomodalMovie}
                    isVisible={infomodalIsVisible}
                />
            </div>
        );
    }
}

const mapStateToProps = state => {
    const { settings } = state;
    return {
        directories: settings.settings.directories
    };
};

const mapDispatchToProps = dispatch => {
    return {
        emitAPIRequest: (endpoint, params, callback, shouldDispatch) =>
            dispatch(emitAPIRequest(endpoint, params, callback, shouldDispatch))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(MoviesList);
