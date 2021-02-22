import PropTypes from "prop-types";
import React, { Component } from "react";

import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import CheckIcon from "@material-ui/icons/Check";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CircularProgress from "@material-ui/core/CircularProgress";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Grid from "@material-ui/core/Grid";
import LockIcon from "@material-ui/icons/Lock";
import LockOpenIcon from "@material-ui/icons/LockOpen";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import moment from "moment";

import PlayButton from "../../PlayButton";

class EpisodesTable extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedSeasonNum: -1,
            episodes: [],
            isLoadingEpisodes: false,
            selectedEpisodeKeys: [],
        };
    }

    componentDidMount() {
        this._shouldGetEpisodes(this.props);
    }

    componentDidUpdate() {
        this._shouldGetEpisodes(this.props);
    }

    _shouldGetEpisodes(props) {
        if (props.activeSeasonNum !== this.state.selectedSeasonNum) {
            this.setState({
                selectedSeasonNum: props.activeSeasonNum,
            });
            this._getEpisodes(props.activeSeasonNum);
        }
    }

    _getEpisodes(seasonNum) {
        const { callAPI, show } = this.props;

        this.setState({
            isLoadingEpisodes: true,
        });

        const options = {
            show_id: show.id,
            season_number: seasonNum,
        };

        callAPI(
            "shows.episodes.get_all_with_file_info",
            options,
            this._episodesReceived.bind(this, seasonNum),
            false
        );
    }

    _episodesReceived(seasonNum, episodes) {
        this.setState({
            episodes,
            isLoadingEpisodes: false,
        });
    }

    _changeSelectedEpisodeWatchedStatus(newWatchedStatus) {
        const { selectedEpisodeKeys } = this.state;
        const { activeSeasonNum, callAPI } = this.props;

        this.setState({
            isLoadingEpisodes: true,
        });

        const params = {
            episode_ids: selectedEpisodeKeys,
            watched_status: newWatchedStatus,
        };
        callAPI(
            "shows.episodes.toggle_watched",
            params,
            this._getEpisodes.bind(this, activeSeasonNum),
            false
        );
    }

    _handleSelectEpisodeTableRow(selectedEpisodeKeys) {
        this.setState({
            selectedEpisodeKeys,
        });
    }

    _handleToggleSingleSeasonLock(newStatus) {
        this.props.onToggleSingleSeasonLock(newStatus);
    }

    _handleToggleAllSeasonsLock(newStatus) {
        this.props.onToggleAllSeasonsLock(newStatus);
    }

    _buildEpisodesTable() {
        let rows = this._episodeTableRows();

        return (
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Ep</TableCell>
                            <TableCell></TableCell>
                            <TableCell>Episode Info</TableCell>
                            <TableCell>Aired</TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>{rows}</TableBody>
                </Table>
            </TableContainer>
        );
    }

    _episodeTableRows() {
        const { directories } = this.props.settings;

        const { episodes } = this.state;
        let output = [];
        episodes.forEach((ep) => {
            let watchedIcon = <CheckIcon />;
            if (ep.watched) {
                watchedIcon = <CheckBoxOutlineBlankIcon />;
            }
            let airedDate = moment
                .unix(ep.first_aired)
                .format("MMM. D, YYYY, h:mm:ss a");
            let play = <span></span>;
            if (ep.file_info.hasOwnProperty("id")) {
                const fullPath = directories.Shows + "/" + ep.file_info.subpath;
                play = (
                    <PlayButton
                        filename={ep.file_info.filename}
                        fullPath={fullPath}
                    />
                );
            }

            output.push(
                <TableRow key={ep.id}>
                    <TableCell>{ep.episode_number}</TableCell>
                    <TableCell>{watchedIcon}</TableCell>
                    <TableCell style={{ width: "60%" }}>
                        <Accordion>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <strong>{ep.title}</strong>
                            </AccordionSummary>
                            <AccordionDetails>{ep.overview}</AccordionDetails>
                        </Accordion>
                    </TableCell>
                    <TableCell>{airedDate}</TableCell>
                    <TableCell>{play}</TableCell>
                </TableRow>
            );
        });
        return output;
    }

    _buildEpisodesList() {
        const { episodes } = this.state;

        let episodeList = [];

        episodes.forEach((episode) => {
            let playButton = "";

            const el = (
                <div
                    key={episode.id}
                    className="ib-shows-seasonlist-episode-row"
                >
                    {playButton}
                    {episode.episode_number}. {episode.title}
                </div>
            );
            episodeList.push(el);
        });
        return episodeList;
    }

    _buildButtons() {
        const { season } = this.props;
        const { selectedEpisodeKeys } = this.state;

        let toggleLockButton = null;
        if (season.locked) {
            toggleLockButton = (
                <Button
                    size="small"
                    variant="contained"
                    disableElevation
                    onClick={this._handleToggleSingleSeasonLock.bind(this, 0)}
                    startIcon={<LockOpenIcon />}
                >
                    Unlock This Season
                </Button>
            );
        } else {
            toggleLockButton = (
                <Button
                    size="small"
                    variant="contained"
                    disableElevation
                    onClick={this._handleToggleSingleSeasonLock.bind(this, 1)}
                    startIcon={<LockIcon />}
                >
                    Lock This Season
                </Button>
            );
        }

        const buttonsDisabled = selectedEpisodeKeys.length > 0 ? false : true;

        return (
            <Grid item xs={12}>
                <ButtonGroup>
                    <Button
                        size="small"
                        onClick={this._changeSelectedEpisodeWatchedStatus.bind(
                            this,
                            1
                        )}
                        disabled={buttonsDisabled}
                    >
                        Toggle to Watched
                    </Button>
                    <Button
                        size="small"
                        onClick={this._changeSelectedEpisodeWatchedStatus.bind(
                            this,
                            0
                        )}
                        disabled={buttonsDisabled}
                    >
                        Toggle to UnWatched
                    </Button>
                </ButtonGroup>
                <ButtonGroup>
                    <Button
                        size="small"
                        onClick={this._handleToggleAllSeasonsLock.bind(this, 0)}
                        startIcon={<LockOpenIcon />}
                    >
                        Unlock All Seasons
                    </Button>
                    <Button
                        size="small"
                        onClick={this._handleToggleAllSeasonsLock.bind(this, 1)}
                        startIcon={<LockIcon />}
                    >
                        Lock All Seasons
                    </Button>
                </ButtonGroup>
                {toggleLockButton}
            </Grid>
        );
    }

    render() {
        const { activeSeasonNum } = this.props;
        const { selectedSeasonNum, isLoadingEpisodes } = this.state;

        let episodeList = "";
        if (selectedSeasonNum > -1) {
            if (isLoadingEpisodes) {
                episodeList = (
                    <div id="ib-loading-box">
                        <CircularProgress />
                    </div>
                );
            } else {
                episodeList = this._buildEpisodesTable();
            }
        }

        const buttons = this._buildButtons();

        return (
            <div className="ib-show-seasonlist-episodes-container">
                <h3>Season {activeSeasonNum}</h3>
                {buttons}
                {episodeList}
            </div>
        );
    }
}

EpisodesTable.propTypes = {
    activeSeasonNum: PropTypes.number.isRequired,
    callAPI: PropTypes.func.isRequired,
    onToggleSingleSeasonLock: PropTypes.func.isRequired,
    onToggleAllSeasonsLock: PropTypes.func.isRequired,
    season: PropTypes.object.isRequired,
    settings: PropTypes.object.isRequired,
    show: PropTypes.object.isRequired,
};

export default EpisodesTable;
