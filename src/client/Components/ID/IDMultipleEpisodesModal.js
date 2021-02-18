import PropTypes from "prop-types";
import React, { Component } from "react";

import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Select from "react-select";
import DialogModal from "../shared/DialogModal";
import Regex from "../../lib/Regex.lib";
class IDMultipleEpisodesModal extends Component {
    INITIAL_STATE = {
        currentEpisodesInfo: {},
        episodeDestPath: "",
        currentShowID: 0,
        currentShowInfo: {},
        currentSeasonID: 0,
        currentSeasonInfo: {},
        hasShowsFromAPI: false,
        isLoadingAPIData: false,
        episodes: [],
        seasonParseRegexStr: "E\\d+",
        seasons: [],
        shows: [],
    };

    constructor(props) {
        super(props);

        this.state = this.INITIAL_STATE;
    }

    componentDidMount() {
        this._getShows();
    }

    componentDidUpdate(prevProps) {
        const oldEpisodesToID = prevProps.episodesToID;
        const { episodesToID } = this.props;
        let isNewSet = true;
        if (episodesToID.length === 0) {
            isNewSet = false;
        } else if (
            episodesToID.length > 0 &&
            oldEpisodesToID.length === episodesToID.length
        ) {
            // Check that the episodes are different
            const newEpisodes = new Set();

            episodesToID.forEach((ep) => {
                newEpisodes.add(ep.name);
            });

            oldEpisodesToID.forEach((ep) => {
                if (newEpisodes.has(ep.name)) {
                    newEpisodes.delete(ep.name);
                }
            });
            isNewSet = newEpisodes.length > 0;
        }

        if (isNewSet) {
            let currentEpisodesInfo = {};
            episodesToID.forEach((ep) => {
                currentEpisodesInfo[ep.name] = {
                    info: ep,
                    newFilename: "",
                    selectedEpisodeID: 0,
                };
            });

            this.setState({
                ...this.INITIAL_STATE,
                currentEpisodesInfo,
            });
            this._getShows();
        }
    }

    _getShows() {
        const { callAPI } = this.props;

        callAPI("shows.shows.get", {}, this._showsReceived.bind(this), false);
    }

    _showsReceived(shows) {
        this.setState({
            currentSeasonID: 0,
            currentShowInfo: {},
            hasShowsFromAPI: true,
            shows,
            seasons: [],
            episodes: [],
            isLoadingAPIData: false,
        });
    }

    _getSeasons(showID) {
        const { callAPI } = this.props;
        const { shows } = this.state;

        const currentShowInfo = shows.find(
            (show) => show.id === parseInt(showID)
        );

        this.setState({
            currentSeasonID: 0,
            currentShowID: parseInt(showID),
            currentShowInfo,
            seasons: [],
            episodes: [],
        });

        const options = {
            show_id: showID,
        };
        callAPI(
            "shows.seasons.get",
            options,
            this._seasonsReceived.bind(this),
            false
        );
    }

    _seasonsReceived(seasons) {
        this.setState({
            seasons,
        });
    }

    _getEpisodes(seasonID) {
        const { callAPI } = this.props;
        const { currentShowInfo, seasons } = this.state;

        const currentSeasonInfo = seasons.find(
            (season) => season.id === parseInt(seasonID)
        );

        const name = Regex.sanitizeShowTitle(currentShowInfo.title);
        const seasonNum = this._getSeasonString(currentSeasonInfo);
        const episodeDestPath = name + "/" + seasonNum;
        this.setState({
            currentSeasonID: parseInt(seasonID),
            currentSeasonInfo,
            episodeDestPath,
            episodes: [],
        });

        const options = {
            show_id: this.state.currentShowID,
            season_id: parseInt(seasonID),
        };
        callAPI(
            "shows.episodes.get",
            options,
            this._episodesReceived.bind(this),
            false
        );
    }

    _episodesReceived(episodes) {
        const { seasonParseRegexStr } = this.state;

        this._collateEpisodeInfo(seasonParseRegexStr, episodes);
    }

    _collateEpisodeInfo(seasonParseRegexStr, episodes) {
        const { currentEpisodesInfo } = this.state;
        // Set the default selected episode based on the filename
        const epFilenames = Object.keys(currentEpisodesInfo);
        epFilenames.forEach((filename) => {
            // Get the S##E##
            const epPos = filename.search(RegExp(seasonParseRegexStr));
            if (epPos > -1) {
                const regexAsString = seasonParseRegexStr.toString();
                const regexPos = regexAsString.indexOf("\\d+");

                const offsetIndex = epPos + regexPos;
                const firstDigit = parseInt(filename.substr(offsetIndex, 1));
                const secondDigit = parseInt(
                    filename.substr(offsetIndex + 1, 1)
                );
                let episodeNumber = firstDigit;
                if (typeof firstDigit === "number") {
                    if (typeof secondDigit === "number") {
                        // ie 01
                        episodeNumber = parseInt(`${firstDigit}${secondDigit}`);
                    }
                }
                const ep = episodes.find(
                    (ep) => ep.episode_number === episodeNumber
                );
                const episodeID = ep !== undefined ? ep.id : 0;

                currentEpisodesInfo[filename] = this._constructEpisodeInfo(
                    episodes,
                    filename,
                    episodeID
                );
            }
        });

        this.setState({
            currentEpisodesInfo,
            episodes,
            seasonParseRegexStr,
        });
    }

    _buildShowSeasonSelectors() {
        const { currentShowID, currentSeasonID, seasons, shows } = this.state;

        const showSelector = this._buildSelect(
            shows,
            "title",
            this._getSeasons.bind(this),
            currentShowID
        );
        let seasonsSelector = "Select a show...";
        if (seasons.length > 0) {
            seasonsSelector = this._buildSelect(
                seasons,
                "season_number",
                this._getEpisodes.bind(this),
                currentSeasonID,
                "Season "
            );
        }

        return (
            <Grid item xs={12}>
                <div key="show">{showSelector}</div>
                <div key="season">{seasonsSelector}</div>
            </Grid>
        );
    }

    _buildEpisodeSelectors() {
        const { currentEpisodesInfo, episodes } = this.state;

        const filenames = Object.keys(currentEpisodesInfo);
        let editorList = [];
        filenames.forEach((filename) => {
            const episodeInfo = currentEpisodesInfo[filename];

            let episodesSelector = "";
            if (episodes.length > 0) {
                episodesSelector = this._buildSelect(
                    episodes,
                    "episode_number",
                    this._handleSelectEpisode.bind(this, filename),
                    episodeInfo.selectedEpisodeID,
                    "Episode "
                );
            }

            const episodeEditor = (
                <div key={filename} className="ib-idmultiplemodal-episode-box">
                    <h4>{filename}</h4>
                    {episodesSelector}
                    <TextField
                        value={episodeInfo.newFilename}
                        onChange={this._handleChangeEpisodeFilename.bind(
                            this,
                            filename
                        )}
                    />
                </div>
            );
            editorList.push(episodeEditor);
        });

        return editorList;
    }

    _buildSelect(items, titleKey, onChange, defaultValue, prefix = "") {
        let options = [];
        items.forEach((item) => {
            const itemTitle = prefix + item[titleKey];
            options.push({ value: item.id.toString(), name: itemTitle });
        });

        return (
            <SelectSearch
                options={options}
                key={Math.random()}
                onChange={onChange}
                search={true}
                placeholder="Select..."
                value={defaultValue.toString()}
                filterOptions={(input, option) => {
                    if (option) {
                        const toSearch = option.props.children;
                        return (
                            toSearch
                                .toLowerCase()
                                .indexOf(input.toLowerCase()) >= 0
                        );
                    }
                }}
            >
                {options}
            </SelectSearch>
        );
    }

    _handleSelectEpisode(filename, episodeID) {
        const { episodes, currentEpisodesInfo } = this.state;

        currentEpisodesInfo[filename] = this._constructEpisodeInfo(
            episodes,
            filename,
            episodeID
        );

        this.setState({
            currentEpisodesInfo,
        });
    }

    _constructEpisodeInfo(episodes, originalFilename, episodeIDString) {
        const {
            currentShowInfo,
            currentSeasonInfo,
            currentEpisodesInfo,
        } = this.state;
        let newEpisodeInfo = currentEpisodesInfo[originalFilename];

        const episodeID = parseInt(episodeIDString);
        let currentEpisode = episodes.find((ep) => ep.id === episodeID);
        if (currentEpisode === undefined) {
            newEpisodeInfo.newFilename = originalFilename;
            newEpisodeInfo.selectedEpisodeID = episodeID;
            return newEpisodeInfo;
        }

        let episodeNum = "E";
        if (currentEpisode.episode_number < 10) {
            episodeNum += "0";
        }
        episodeNum += currentEpisode.episode_number.toString();

        const ext = originalFilename.split(".").pop();

        const showTitle = Regex.sanitizeShowTitle(currentShowInfo.title);
        const seasonNum = this._getSeasonString(currentSeasonInfo);

        newEpisodeInfo.newFilename =
            showTitle + "." + seasonNum + episodeNum + "." + ext;
        newEpisodeInfo.selectedEpisodeID = episodeID;
        return newEpisodeInfo;
    }

    _handleChangeEpisodeFilename(filename, evt) {
        const { currentEpisodesInfo } = this.state;

        currentEpisodesInfo[filename].newFilename = evt.target.value;

        this.setState({
            currentEpisodesInfo,
        });
    }

    _handleChangeCurrentPath(evt) {
        const newPath = evt.target.value;

        this.setState({
            episodeDestPath: newPath,
        });
    }

    _getSeasonString(seasonInfo) {
        let seasonNum = "S";
        if (seasonInfo.season_number < 10) {
            seasonNum += "0";
        }
        seasonNum += seasonInfo.season_number.toString();
        return seasonNum;
    }

    _handleClickIDButton() {
        const { currentFilename, currentPathInfo, callAPI } = this.props;

        const {
            currentEpisodesInfo,
            currentSeasonID,
            currentShowID,
            episodeDestPath,
        } = this.state;

        this.setState({
            isIDing: true,
        });

        const options = {
            id_info: {
                season_id: currentSeasonID,
                show_id: currentShowID,
                episodes: currentEpisodesInfo,
            },
            source_path_info: {
                setting_id: currentPathInfo.setting_id,
                subpath: currentPathInfo.subpath,
            },
            dest_subpath: episodeDestPath,
        };

        callAPI(
            "id.multiple_episodes.id_and_archive",
            options,
            this._handleIDMultipleComplete.bind(this),
            false
        );
    }

    _handleIDMultipleComplete() {
        const { onIDComplete } = this.props;

        onIDComplete();
    }

    _areAllEpisodesSelected() {
        const { currentEpisodesInfo } = this.state;

        const epFilenames = Object.keys(currentEpisodesInfo);
        for (let i = 0; i < epFilenames.length; i++) {
            const filename = epFilenames[i];
            if (currentEpisodesInfo[filename].selectedEpisodeID === 0) {
                return false;
            }
        }
        return true;
    }

    _buildShowSeasonPathInput() {
        const { episodeDestPath } = this.state;

        let input = "";
        if (episodeDestPath !== "") {
            input = (
                <TextField
                    value={episodeDestPath}
                    onChange={this._handleChangeCurrentPath.bind(this)}
                />
            );
        }
        return input;
    }

    _handleChangeEpisodeRegex(evt) {
        const { episodes } = this.state;
        const seasonParseRegexStr = evt.target.value;
        this._collateEpisodeInfo(seasonParseRegexStr, episodes);
    }

    _buildEpisodeRegexInput() {
        const { seasonParseRegexStr } = this.state;

        const el = (
            <Grid item xs={12}>
                <TextField
                    label="Episode Regex: "
                    value={seasonParseRegexStr}
                    onChange={this._handleChangeEpisodeRegex.bind(this)}
                />
            </Grid>
        );
        return el;
    }

    render() {
        const { isVisible, onCancel } = this.props;

        const { episodes } = this.state;

        const showSeasonSelectors = ""; //this._buildShowSeasonSelectors();
        const pathInput = this._buildShowSeasonPathInput();
        let episodesSelectors = "";
        if (episodes.length > 0) {
            episodesSelectors = this._buildEpisodeSelectors();
        }

        const episodeRegexInput = this._buildEpisodeRegexInput();

        const buttonDisabled = !this._areAllEpisodesSelected();

        return (
            <DialogModal
                title="ID Multiple Episodes"
                isVisible={isVisible}
                onClose={onCancel}
                footer={[
                    <Button key="cancel" size="small" onClick={onCancel}>
                        Cancel
                    </Button>,
                ]}
            >
                <Grid container>
                    {showSeasonSelectors}
                    {pathInput}
                    {episodeRegexInput}
                    <Grid item xs={12}>
                        {episodesSelectors}
                    </Grid>
                    <div key="button" className="ib-idmodal-button-box">
                        <Button
                            onClick={this._handleClickIDButton.bind(this)}
                            disabled={buttonDisabled}
                        >
                            ID Episodes
                        </Button>
                    </div>
                </Grid>
            </DialogModal>
        );
    }
}

IDMultipleEpisodesModal.propTypes = {
    callAPI: PropTypes.func.isRequired,
    currentPathInfo: PropTypes.object.isRequired,
    episodesToID: PropTypes.array.isRequired,
    isVisible: PropTypes.bool.isRequired,
    onCancel: PropTypes.func.isRequired,
    onIDComplete: PropTypes.func.isRequired,
};

export default IDMultipleEpisodesModal;
