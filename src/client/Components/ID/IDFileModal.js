import PropTypes from "prop-types";
import React, { Component } from "react";

import Grid from "@material-ui/core/Grid";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import Button from "@material-ui/core/Button";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import DialogModal from "../shared/DialogModal";
import ArchiveSingleEpisode from "./ArchiveSingleEpisode";
import EpisodeIDSelector from "./EpisodeIDSelector";
import MovieCheckForm from "./MovieID/MovieCheckForm";
import MovieID from "./MovieID/MovieID";

class IDFileModal extends Component {
    INITIAL_VIEW = "two_column_single_id";
    MOVIE_SEARCH_VIEW = "movie_search_results";
    ARCHIVE_EPISODE_VIEW = "archive_episode";

    INITIAL_STATE = {
        currentView: "two_column_single_id",
        episodeInfo: {},
        movieSearchString: "",
    };

    constructor(props) {
        super(props);

        this.state = this.INITIAL_STATE;
    }

    componentDidMount() {
        this.setState(this.INITIAL_STATE);
    }

    _handleCancel() {
        const { onCancel } = this.props;
        this.setState({
            currentView: "two_column_single_id",
            movieSearchString: "",
        });
        onCancel();
    }

    _handleClickSearchMovies(movieSearchString) {
        this.setState({
            currentView: "movie_search_results",
            movieSearchString,
        });
    }

    _handleClickIDEpisode(episodeInfo) {
        this.setState({
            currentView: "archive_episode",
            episodeInfo,
        });
    }

    _buildTwoColumnSingleID() {
        const { callAPI, currentFilename } = this.props;
        return (
            <div className="idmodal-accordion-wrapper">
                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        Episode
                    </AccordionSummary>
                    <AccordionDetails>
                        <EpisodeIDSelector
                            callAPI={callAPI}
                            onIDEpisode={this._handleClickIDEpisode.bind(this)}
                        />
                    </AccordionDetails>
                </Accordion>
                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        Movie
                    </AccordionSummary>
                    <AccordionDetails>
                        <MovieCheckForm
                            currentFilename={currentFilename}
                            onSearchMovies={this._handleClickSearchMovies.bind(
                                this
                            )}
                        />
                    </AccordionDetails>
                </Accordion>
            </div>
        );
    }

    _buildMovieIDView() {
        const { movieSearchString } = this.state;
        const {
            callAPI,
            currentFilename,
            currentPathInfo,
            onIDComplete,
        } = this.props;

        return (
            <MovieID
                callAPI={callAPI}
                currentFilename={currentFilename}
                currentPathInfo={currentPathInfo}
                movieSearchString={movieSearchString}
                onIDComplete={onIDComplete}
            />
        );
    }

    _buildArchiveEpisodeView() {
        const { episodeInfo } = this.state;
        const {
            callAPI,
            currentFilename,
            currentPathInfo,
            currentToplevelDirectory,
            onIDComplete,
        } = this.props;

        return (
            <ArchiveSingleEpisode
                callAPI={callAPI}
                currentFilename={currentFilename}
                currentPathInfo={currentPathInfo}
                episodeInfo={episodeInfo}
                onIDComplete={onIDComplete}
            />
        );
    }

    _changeCurrentView(newView) {
        this.setState({
            currentView: newView,
        });
    }

    _selectCurrentView() {
        const { currentView } = this.state;
        switch (currentView) {
            case this.INITIAL_VIEW:
                return this._buildTwoColumnSingleID();
            case this.MOVIE_SEARCH_VIEW:
                return this._buildMovieIDView();
            case this.ARCHIVE_EPISODE_VIEW:
                return this._buildArchiveEpisodeView();
        }
    }

    render() {
        const { currentFilename, isVisible } = this.props;
        const { currentView } = this.state;

        const contents = this._selectCurrentView();

        let backButton = "";
        if (currentView !== this.INITIAL_VIEW) {
            backButton = (
                <Button
                    variant="contained"
                    onClick={this._changeCurrentView.bind(
                        this,
                        this.INITIAL_VIEW
                    )}
                    startIcon={<ArrowBackIcon />}
                >
                    Back
                </Button>
            );
        }

        return (
            <DialogModal
                title="ID File"
                isVisible={isVisible}
                onClose={this._handleCancel.bind(this)}
                width={400}
                footer={[
                    <Button
                        variant="contained"
                        key="cancel"
                        size="small"
                        onClick={this._handleCancel.bind(this)}
                    >
                        Cancel
                    </Button>,
                ]}
            >
                <div>
                    <div className="ib-idmodal-filename">
                        {backButton}&nbsp;&nbsp;{currentFilename}
                    </div>
                </div>
                <div className="ib-idmodal-wrapper">{contents}</div>
            </DialogModal>
        );
    }
}

IDFileModal.propTypes = {
    callAPI: PropTypes.func.isRequired,
    currentFilename: PropTypes.string.isRequired,
    currentPathInfo: PropTypes.object.isRequired,
    isVisible: PropTypes.bool.isRequired,
    onCancel: PropTypes.func.isRequired,
    onIDComplete: PropTypes.func.isRequired,
};

export default IDFileModal;
