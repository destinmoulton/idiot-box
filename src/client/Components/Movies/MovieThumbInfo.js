import React from "react";

import { Col, Icon } from "antd";
import { LazyLoadImage } from "react-lazy-load-image-component";
import PlayButton from "../PlayButton";
import StatusTagIcons from "./StatusTagIcons";

class MovieThumbInfo extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isMouseOverMovie: false,
            isMouseOverVeil: false,
        };
    }

    _handleClick(movie) {
        this.props.onClickMovie(movie);
    }

    _handleClickDelete() {
        this.props.onClickDelete(this.props.movie);
    }

    _handleMouseOverMovie() {
        this.setState({
            isMouseOverMovie: true,
        });
    }

    _handleMouseOutMovie() {
        this.setState({
            isMouseOverMovie: false,
        });
    }

    render() {
        const {
            directories,
            movie,
            onClickMovie,
            onClickToggleStatusTag,
        } = this.props;
        const fullPath = directories.Movies + "/" + movie.file_info.subpath;
        const movieTitle = {
            __html: movie.title,
        };

        let veilOptions = null;
        if (this.state.isMouseOverMovie) {
            veilOptions = (
                <div className="ib-movies-veil">
                    <PlayButton
                        filename={movie.file_info.filename}
                        fullPath={fullPath}
                    />
                    <a
                        href="javascript:void(0)"
                        onClick={this._handleClickDelete.bind(this)}
                    >
                        <Icon type="delete" className="ib-playbutton-icon" />
                    </a>
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
                    <LazyLoadImage
                        className="ib-movies-thumbnail"
                        width={136}
                        height={200}
                        alt={movieTitle}
                        src={"/images/movies/" + movie.image_filename}
                    />
                </a>
                {veilOptions}
                <div className="ib-movies-thumbnail-title">
                    <a
                        href="javascript:void(0)"
                        onClick={this._handleClick.bind(this, movie)}
                    >
                        <span dangerouslySetInnerHTML={movieTitle} />
                    </a>
                </div>
                <div className="ib-movies-thumbnail-statustags">
                    <StatusTagIcons
                        movie={movie}
                        onClickToggleStatusTag={onClickToggleStatusTag}
                    />
                </div>
            </div>
        );
    }
}

export default MovieThumbInfo;
