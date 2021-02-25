import PropTypes from "prop-types";
import React, { Component } from "react";

import { Button, Grid, CircularProgress } from "@material-ui/core";

import Regex from "../../lib/Regex.lib";

class ArchiveSingleEpisode extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isCollating: false,
            isIDing: false,
            episode: {},
            season: {},
            show: {},
            newDirectory: "",
            newFilename: "",
        };
    }

    componentWillMount() {
        this._getEpisodeCollation();
    }

    _getEpisodeCollation() {
        const { callAPI, episodeInfo } = this.props;

        this.setState({
            isCollating: true,
        });

        const options = {
            episode_info: {
                show_id: episodeInfo.currentShowID,
                season_id: episodeInfo.currentSeasonID,
                episode_id: episodeInfo.currentEpisodeID,
            },
        };
        callAPI(
            "shows.episode.collate",
            options,
            this._handleCollationReceived.bind(this),
            false
        );
    }

    _handleCollationReceived(data) {
        this.setState({
            isCollating: false,
            episode: data.episode,
            season: data.season,
            show: data.show,
            newDirectory: this._getDirectory(data.show, data.episode),
            newFilename: this._getFilename(data.show, data.episode),
        });
    }

    _idAndArchiveEpisode() {
        const {
            currentFilename,
            currentPathInfo,
            callAPI,
            episodeInfo,
        } = this.props;
        const { newDirectory, newFilename } = this.state;

        this.setState({
            isIDing: true,
        });

        const options = {
            episode_info: {
                show_id: episodeInfo.currentShowID,
                season_id: episodeInfo.currentSeasonID,
                episode_id: episodeInfo.currentEpisodeID,
            },
            source_info: {
                setting_id: currentPathInfo.setting_id,
                filename: currentFilename,
                subpath: currentPathInfo.subpath,
            },
            dest_info: {
                filename: newFilename,
                subpath: newDirectory,
            },
        };
        callAPI(
            "id.episode.id_and_archive",
            options,
            this._handleArchiveComplete.bind(this),
            false
        );
    }

    _handleArchiveComplete(data) {
        const { onIDComplete } = this.props;
        onIDComplete();
    }

    _getDirectory(show, episode) {
        const showTitle = Regex.sanitizeShowTitle(show.title);
        const seasonID = this._getSeasonID(episode.season_number);
        return showTitle + "/" + seasonID;
    }

    _getFilename(show, episode) {
        const { currentFilename } = this.props;

        const ext = currentFilename.split(".").pop();

        const episodeID = this._getEpisodeID(episode.episode_number);
        const seasonID = this._getSeasonID(episode.season_number);

        const showTitle = Regex.sanitizeShowTitle(show.title);
        return showTitle + "." + seasonID + episodeID + "." + ext;
    }

    _getEpisodeID(episodeNumber) {
        let episodeID = "E";
        if (episodeNumber < 10) {
            episodeID += "0";
        }
        return episodeID + episodeNumber.toString();
    }

    _getSeasonID(seasonNumber) {
        let seasonID = "S";
        if (seasonNumber < 10) {
            seasonID += "0";
        }
        return seasonID + seasonNumber.toString();
    }

    _handleChangeFilename(evt) {
        this.setState({
            newFilename: evt.target.value,
        });
    }

    _handleChangeDirectory(evt) {
        this.setState({
            newDirectory: evt.target.value,
        });
    }

    _buildEpisodeForm() {
        const { episode, season, show, newDirectory, newFilename } = this.state;

        return (
            <Grid container>
                <Grid
                    item
                    xs={12}
                    className="ib-idmodal-archivesingle-episodeinfo"
                >
                    <div>{show.title}</div>
                    <div>{season.title}</div>
                    <div>Episode {episode.episode_number}</div>
                </Grid>
                <Grid
                    item
                    xs={12}
                    className="ib-idmodal-archivesingle-form-box"
                >
                    <label htmlFor="episode-destination-directory">
                        Destination Directory:
                    </label>
                    <br />
                    <input
                        name="episode-destination-directory"
                        onChange={this._handleChangeDirectory.bind(this)}
                        value={newDirectory}
                    />
                    <br />
                    <label htmlFor="episode-filename">Filename:</label>
                    <br />
                    <input
                        name="episode-filename"
                        onChange={this._handleChangeFilename.bind(this)}
                        value={newFilename}
                    />
                    <div className="ib-idmodal-button-box">
                        <Button
                            className="ib-button-green"
                            size="small"
                            onClick={this._idAndArchiveEpisode.bind(this)}
                        >
                            Archive Episode
                        </Button>
                    </div>
                </Grid>
            </Grid>
        );
    }

    render() {
        const { isCollating } = this.state;

        let content = <CircularProgress />;
        if (!isCollating) {
            content = this._buildEpisodeForm();
        }

        return <div>{content}</div>;
    }
}

ArchiveSingleEpisode.propTypes = {
    callAPI: PropTypes.func.isRequired,
    currentFilename: PropTypes.string.isRequired,
    currentPathInfo: PropTypes.object.isRequired,
    episodeInfo: PropTypes.object.isRequired,
    onIDComplete: PropTypes.func.isRequired,
};

export default ArchiveSingleEpisode;
