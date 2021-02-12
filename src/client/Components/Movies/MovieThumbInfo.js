import React from "react";

import Button from "@material-ui/core/Button";
import DeleteIcon from "@material-ui/icons/Delete";
import Grid from "@material-ui/core/Grid";
import PlayButton from "../PlayButton";
import StatusTagIcons from "./StatusTagIcons";

import { getCurrentBreakpoint } from "../../lib/breakpoints.lib";
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

        const breakpoint = getCurrentBreakpoint();
        const breakClass = "bpoint-" + breakpoint;

        return (
            <Grid
                key={movie.id}
                className={"ib-movies-thumbnail-box " + breakClass}
                item
                xs={4}
                md={2}
                sm={3}
                lg={2}
            >
                <a onClick={this._handleClick.bind(this, movie)}>
                    <img
                        className="ib-movies-thumbnail"
                        alt={movieTitle}
                        src={"/images/movies/" + movie.image_filename}
                    />
                </a>
                <div className="ib-movies-thumbnail-title">
                    <a onClick={this._handleClick.bind(this, movie)}>
                        <span dangerouslySetInnerHTML={movieTitle} />
                    </a>
                </div>
                <div className="ib-movies-thumbnail-statustags">
                    <StatusTagIcons
                        movie={movie}
                        onClickToggleStatusTag={onClickToggleStatusTag}
                    />
                </div>
            </Grid>
        );
    }
}

export default MovieThumbInfo;
