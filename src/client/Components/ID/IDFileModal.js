import PropTypes from "prop-types";
import React, { Component } from "react";
import { connect } from "react-redux";

import { Button, Checkbox, Col, Input, Modal, Row } from "antd";

import ArchiveSingleEpisode from "./ArchiveSingleEpisode";
import EpisodeIDSelector from "./EpisodeIDSelector";
import MovieCheckForm from "./MovieCheckForm";
import MovieID from "./MovieID";

class IDFileModal extends Component {
    INITIAL_VIEW = "two_column_single_id";
    MOVIE_SEARCH_VIEW = "movie_search_results";
    ARCHIVE_EPISODE_VIEW = "archive_episode";

    INITIAL_STATE = {
        currentView: "two_column_single_id",
        episodeInfo: {},
        movieSearchString: ""
    };

    static propTypes = {
        currentFilename: PropTypes.string.isRequired,
        currentPathInfo: PropTypes.object.isRequired,
        isVisible: PropTypes.bool.isRequired,
        onCancel: PropTypes.func.isRequired,
        onIDComplete: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);

        this.state = this.INITIAL_STATE;
    }

    componentWillMount() {
        this.setState(this.INITIAL_STATE);
    }

    _handleCancel() {
        const { onCancel } = this.props;
        this.setState({
            currentView: "two_column_single_id",
            movieSearchString: ""
        });
        onCancel();
    }

    _handleClickSearchMovies(movieSearchString) {
        this.setState({
            currentView: "movie_search_results",
            movieSearchString
        });
    }

    _handleClickIDEpisode(episodeInfo) {
        this.setState({
            currentView: "archive_episode",
            episodeInfo
        });
    }

    _buildTwoColumnSingleID() {
        const { currentFilename } = this.props;
        return (
            <div>
                <Col span={10}>
                    <h4>Movie</h4>
                    <MovieCheckForm
                        currentFilename={currentFilename}
                        onSearchMovies={this._handleClickSearchMovies.bind(
                            this
                        )}
                    />
                </Col>
                <Col span={12} offset={1}>
                    <div className="ib-idmodal-idepisode-box">
                        <h4>Episode</h4>
                        <EpisodeIDSelector
                            onIDEpisode={this._handleClickIDEpisode.bind(this)}
                        />
                    </div>
                </Col>
            </div>
        );
    }

    _buildMovieIDView() {
        const { movieSearchString } = this.state;
        const { currentFilename, currentPathInfo, onIDComplete } = this.props;

        return (
            <MovieID
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
            currentFilename,
            currentPathInfo,
            currentToplevelDirectory,
            onIDComplete
        } = this.props;

        return (
            <ArchiveSingleEpisode
                episodeInfo={episodeInfo}
                currentFilename={currentFilename}
                currentPathInfo={currentPathInfo}
                onIDComplete={onIDComplete}
            />
        );
    }

    _changeCurrentView(newView) {
        this.setState({
            currentView: newView
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
                    onClick={this._changeCurrentView.bind(
                        this,
                        this.INITIAL_VIEW
                    )}
                    icon="caret-left"
                >
                    Back
                </Button>
            );
        }

        return (
            <div>
                <Modal
                    title="ID File"
                    visible={isVisible}
                    onCancel={this._handleCancel.bind(this)}
                    onOk={() => {}}
                    footer={[
                        <Button
                            key="cancel"
                            size="large"
                            onClick={this._handleCancel.bind(this)}
                        >
                            Cancel
                        </Button>
                    ]}
                    width={700}
                >
                    <Row>
                        <div className="ib-idmodal-filename">
                            {backButton}&nbsp;&nbsp;{currentFilename}
                        </div>
                    </Row>
                    <Row>{contents}</Row>
                </Modal>
            </div>
        );
    }
}

export default IDFileModal;
