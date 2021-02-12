import PropTypes from "prop-types";
import React, { Component } from "react";

import Button from "@material-ui/core/Button";
import DeleteIcon from "@material-ui/icons/Delete";
import Grid from "@material-ui/core/Grid";
import StatusTagIcons from "./StatusTagIcons";

import DialogModal from "../shared/DialogModal";

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
            <DialogModal
                title="Movie Info"
                isVisible={isVisible}
                onClose={this._handleCancelClose}
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
                <Grid container item xs={12} className="ib-moviemodal-contents">
                    <Grid item xs={4}>
                        <div className="ib-moviemodal-thumbnail-box">
                            <img
                                src={"/images/movies/" + movie.image_filename}
                            />
                        </div>
                    </Grid>
                    <Grid container item xs={8} alignContent={"flex-start"}>
                        <Grid
                            item
                            xs={12}
                            className="mm-title"
                            dangerouslySetInnerHTML={{ __html: movie.title }}
                        />
                        <Grid item xs={12} className="mm-byline">
                            {movie.year}&nbsp;|&nbsp;
                            <a
                                href={"http://imdb.com/title/" + movie.imdb_id}
                                target="_blank"
                            >
                                IMDB
                            </a>
                            &nbsp;|&nbsp;
                            {movie.runtime} minutes
                        </Grid>
                        <Grid item container xs={12}>
                            <Grid item xs={6} style={{ textAlign: "center" }}>
                                <StatusTagIcons
                                    movie={movie}
                                    onClickToggleStatusTag={
                                        onClickToggleStatusTag
                                    }
                                />
                            </Grid>
                            <Grid item xs={6} style={{ textAlign: "center" }}>
                                <Button
                                    onClick={this._handleClickDelete}
                                    size="small"
                                    startIcon={<DeleteIcon />}
                                    color="secondary"
                                >
                                    Delete
                                </Button>
                            </Grid>
                        </Grid>

                        <Grid
                            item
                            xs={12}
                            className="ib-moviemodal-description"
                        >
                            {movie.overview}
                        </Grid>
                    </Grid>
                </Grid>
            </DialogModal>
        );
    }
}

export default MovieInfoModal;
