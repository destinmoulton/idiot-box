import React from "react";

import { truncate } from "lodash";
import { Col } from "antd";

import PlayButton from "../PlayButton";

class MovieThumbInfo extends React.Component {
    constructor(props) {
        super(props);
    }

    _handleClick(movie) {
        this.props.onClickMovie(movie);
    }

    render() {
        const { directories, movie, onClickMovie } = this.props;
        const fullPath = directories.Movies + "/" + movie.file_info.subpath;
        const movieTitle = {
            __html: truncate(movie.title, { length: 30 })
        };
        return (
            <div>
                <a
                    href="javascript:void(0)"
                    onClick={this._handleClick.bind(this, movie)}
                >
                    <img
                        className="ib-movies-thumbnail"
                        src={"/images/movies/" + movie.image_filename}
                    />
                </a>
                <PlayButton
                    filename={movie.file_info.filename}
                    fullPath={fullPath}
                />
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
