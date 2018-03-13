import React from "react";

import { truncate } from "lodash";
import { Col } from "antd";

import PlayButton from "../PlayButton";

class MovieThumbInfo extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isMouseOverMovie: false,
            isMouseOverVeil: false
        };
    }

    _handleClick(movie) {
        this.props.onClickMovie(movie);
    }

    _handleMouseOverMovie() {
        this.setState({
            isMouseOverMovie: true
        });
    }

    _handleMouseOutMovie() {
        this.setState({
            isMouseOverMovie: false
        });
    }

    render() {
        const { directories, movie, onClickMovie } = this.props;
        const fullPath = directories.Movies + "/" + movie.file_info.subpath;
        const movieTitle = {
            __html: truncate(movie.title, { length: 30 })
        };

        let playButton = null;
        if (this.state.isMouseOverMovie) {
            playButton = (
                <div className="ib-movies-veil">
                    <PlayButton
                        filename={movie.file_info.filename}
                        fullPath={fullPath}
                    />
                </div>
            );
        }
        return (
            <div
                onMouseEnter={this._handleMouseOverMovie.bind(this)}
                onMouseLeave={this._handleMouseOutMovie.bind(this)}
            >
                <a
                    href="javascript:void(0)"
                    onClick={this._handleClick.bind(this, movie)}
                >
                    <img
                        className="ib-movies-thumbnail"
                        src={"/images/movies/" + movie.image_filename}
                    />
                </a>
                {playButton}
                <a
                    href="javascript:void(0)"
                    onClick={this._handleClick.bind(this, movie)}
                >
                    <span dangerouslySetInnerHTML={movieTitle} />
                </a>
            </div>
        );
    }
}

export default MovieThumbInfo;
