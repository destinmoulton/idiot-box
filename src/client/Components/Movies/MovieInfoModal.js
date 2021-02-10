import PropTypes from "prop-types";
import React, { Component } from "react";

import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Modal from "@material-ui/core/Modal";
import StatusTagIcons from "./StatusTagIcons";

class MovieInfoModal extends Component {
    static propTypes = {
        isVisible: PropTypes.bool.isRequired,
        movie: PropTypes.object.isRequired,
        onClose: PropTypes.func.isRequired,
        onClickDelete: PropTypes.func.isRequired,
        onClickToggleStatusTag: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);

        this._handleCancelClose = this._handleCancelClose.bind(this);
        this._handleClickDelete = this._handleClickDelete.bind(this);
    }

    _handleCancelClose() {
        this.props.onClose(false);
    }

    _handleClickDelete() {
        this.props.onClickDelete(this.props.movie);
    }

    render() {
        const { onClickToggleStatusTag, isVisible, movie } = this.props;
        return (
            <Modal
                title="Movie Info"
                visible={isVisible}
                onCancel={this._handleCancelClose}
                footer={[
                    <Button
                        key="close"
                        size="small"
                        onClick={this._handleCancelClose}
                    >
                        Close
                    </Button>,
                ]}
                width={700}
            >
                <Grid container spacing={2}>
                    <Grid item xs={2}>
                        <div className="ib-moviemodal-thumbnail-box">
                            <img
                                className="ib-movies-thumbnail"
                                src={"/images/movies/" + movie.image_filename}
                            />
                        </div>
                    </Grid>
                    <Grid item xs={8}>
                        <div
                            className="ib-moviemodal-title"
                            dangerouslySetInnerHTML={{ __html: movie.title }}
                        />
                        <div className="ib-moviemodal-byline">
                            <div className="ib-moviemodal-byline-movieinfo">
                                {movie.year}&nbsp;|&nbsp;
                                <a
                                    href={
                                        "http://imdb.com/title/" + movie.imdb_id
                                    }
                                    target="_blank"
                                >
                                    IMDB
                                </a>
                            </div>
                            <div className="ib-moviemodal-byline-statustags">
                                <StatusTagIcons
                                    movie={movie}
                                    onClickToggleStatusTag={
                                        onClickToggleStatusTag
                                    }
                                />
                            </div>
                            &nbsp;
                            <div className="ib-moviemodal-byline-button">
                                <Button
                                    onClick={this._handleClickDelete}
                                    size="small"
                                >
                                    Delete
                                </Button>
                            </div>
                        </div>

                        <div className="ib-moviemodal-description">
                            {movie.overview}
                        </div>
                    </Grid>
                </Grid>
            </Modal>
        );
    }
}

export default MovieInfoModal;
