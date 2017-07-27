import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Button, Input, Modal, Select } from 'antd';
const Option = Select.Option;

import { emitAPIRequest } from '../../actions/api.actions';

import Regex from '../../lib/Regex.lib';

class IDMultipleEpisodesModal extends Component {
    static propTypes = {
        currentPathInfo: PropTypes.object.isRequired,
        isVisible: PropTypes.bool.isRequired,
        onCancel: PropTypes.func.isRequired,
        onIDComplete: PropTypes.func.isRequired,
        episodesToID: PropTypes.array.isRequired
    };

    constructor(props){
        super(props);

        this.state = {
            currentEpisodesInfo: {},
            episodeDestPath: "",
            currentShowID: 0,
            currentShowInfo: {},
            currentSeasonID: 0,
            currentSeasonInfo: {},
            isIDing: false,
            episodes: [],
            seasons: [],
            shows: []
        };
    }

    componentWillMount(){
        this._getShows();
    }

    componentWillReceiveProps(nextProps){
        const { episodesToID } = nextProps;

        let currentEpisodesInfo = {};
        episodesToID.forEach((ep)=>{
            
            currentEpisodesInfo[ep.name] = {
                info: ep,
                newFilename: "",
                selectedEpisodeID: 0,
                
            };
        });

        this.setState({
            currentEpisodesInfo
        });
    }

    _getShows(){
        const { emitAPIRequest } = this.props;

        emitAPIRequest("shows.shows.get", {}, this._showsReceived.bind(this), false);
    }

    _showsReceived(shows){
        this.setState({
            currentSeasonID: 0,
            currentShowInfo: {},
            shows,
            seasons: [],
            episodes: []
        });
    }

    _getSeasons(showID){
        const { emitAPIRequest } = this.props;
        const { shows } = this.state;

        const currentShowInfo = shows.find((show)=> show.id === parseInt(showID));

        this.setState({
            currentSeasonID: 0,
            currentShowID: parseInt(showID),
            currentShowInfo,
            seasons: [],
            episodes: []
        });

        const options = {
            show_id: showID
        };
        emitAPIRequest("shows.seasons.get", options, this._seasonsReceived.bind(this), false);
    }

    _seasonsReceived(seasons){
        this.setState({
            seasons,
        });
    }

    _getEpisodes(seasonID){
        const { emitAPIRequest } = this.props;
        const { currentShowInfo, seasons } = this.state;

        const currentSeasonInfo = seasons.find((season)=> season.id === parseInt(seasonID));
        
        const name = Regex.sanitizeShowTitle(currentShowInfo.title);
        const seasonNum = this._getSeasonString(currentSeasonInfo);
        const episodeDestPath = name + "/" + seasonNum;
        this.setState({
            currentSeasonID: parseInt(seasonID),
            currentSeasonInfo,
            episodeDestPath,
            episodes: []
        });

        const options = {
            show_id: this.state.currentShowID,
            season_id: seasonID
        };
        emitAPIRequest("shows.episodes.get", options, this._episodesReceived.bind(this), false);
    }

    _episodesReceived(episodes){
        const { currentEpisodesInfo } = this.state;

        // Set the default selected episode based on the filename
        const epFilenames = Object.keys(currentEpisodesInfo);
        epFilenames.forEach((filename)=>{
            // Get the S##E##
            const seasEp = Regex.parseSeasonEpisodeDoublet(filename);
            if(seasEp !== ""){
                const episodeNumber = parseInt(seasEp.split("E").pop());

                const ep = episodes.find((ep)=>ep.episode_number === episodeNumber);

                currentEpisodesInfo[filename] = this._constructEpisodeInfo(episodes, filename, ep.id);
            }
        });
        
        this.setState({
            currentEpisodesInfo,
            episodes
        });
    }

    _buildShowSeasonSelectors(){
        const {
            currentShowID,
            currentSeasonID,
            seasons,
            shows
        } = this.state;

        const showSelector = this._buildSelect(shows, 'title', this._getSeasons.bind(this), currentShowID);
        let seasonsSelector = "Select a show...";
        if(currentShowID > 0){
            seasonsSelector = this._buildSelect(seasons, 'title', this._getEpisodes.bind(this), currentSeasonID);
        }
        
        return (
            <div>
                <div key="show">
                {showSelector}
                </div>
                <div key="season">
                {seasonsSelector}
                </div>
            </div>
        );
    }

    _buildEpisodeSelectors(){
        const {
            episodesToID
        } = this.props;

        const {
            currentEpisodesInfo,
            episodes
        } = this.state;

        let editorList = [];
        episodesToID.forEach((ep)=>{
            let episodesSelector = "";
            if(episodes.length > 0){
                episodesSelector = this._buildSelect(episodes, 'episode_number', this._handleSelectEpisode.bind(this, ep.name), currentEpisodesInfo[ep.name].selectedEpisodeID, "Episode ");
            }
            const episodeEditor = <div key={ep.name} className="ib-idmultiplemodal-episode-box">
                                        <h4>{ep.name}</h4>
                                        {episodesSelector}
                                        <Input value={currentEpisodesInfo[ep.name].newFilename} onChange={this._handleChangeEpisodeFilename.bind(this, ep.name)}/>
                                  </div>;
            editorList.push(episodeEditor);
        });
        return editorList;
    }

    _buildSelect(items, titleKey, onChange, defaultValue, prefix = ""){
        let options = [<Option key="0" value="0">Select...</Option>];
        items.forEach((item)=>{
            options.push(<Option key={item.id.toString()} value={item.id.toString()}>{prefix}{item[titleKey]}</Option>)
        });

        return (
            <Select onChange={onChange} style={{ width: 200}} defaultValue={defaultValue.toString()}>
                {options}
            </Select>
        );
    }

    _handleSelectEpisode(filename, episodeID){
        const { episodes, currentEpisodesInfo } = this.state;

        currentEpisodesInfo[filename] = this._constructEpisodeInfo(episodes, filename, episodeID);

        this.setState({
            currentEpisodesInfo
        });
    }

    _constructEpisodeInfo(episodes, originalFilename, episodeIDString){
        const {
            currentShowID,
            currentShowInfo,
            currentSeasonID,
            currentSeasonInfo,
            currentEpisodesInfo,
            seasons,
            shows
        } = this.state;
        
        const episodeID = parseInt(episodeIDString);
        let newEpisodeInfo = currentEpisodesInfo[originalFilename];

        let currentEpisode = episodes.find((ep)=>ep.id === episodeID);
        if(currentEpisode === undefined){
            newEpisodeInfo.newFilename = originalFilename;
            newEpisodeInfo.selectedEpisodeID = episodeID;
            return newEpisodeInfo;
        }

        let episodeNum = "E";
        if(currentEpisode.episode_number < 10){
            episodeNum += "0";
        }
        episodeNum += currentEpisode.episode_number.toString();

        const ext = originalFilename.split(".").pop();

        const showTitle = Regex.sanitizeShowTitle(currentShowInfo.title);
        const seasonNum = this._getSeasonString(currentSeasonInfo);
        
        newEpisodeInfo.newFilename = showTitle + "." + seasonNum + episodeNum + "." + ext;
        newEpisodeInfo.selectedEpisodeID = episodeID;
        return newEpisodeInfo;
    }

    _handleChangeEpisodeFilename(filename, evt){
        const { currentEpisodesInfo } = this.state;

        currentEpisodesInfo[filename].newFilename = evt.target.value;

        this.setState({
            currentEpisodesInfo
        });
    }

    _handleChangeCurrentPath(evt){
        const newPath = evt.target.value;

        this.setState({
            episodeDestPath: newPath
        });
    }

    _getSeasonString(seasonInfo){

        let seasonNum = "S";
        if(seasonInfo.season_number < 10){
            seasonNum += "0";
        }
        seasonNum += seasonInfo.season_number.toString();
        return seasonNum;
    }

    _handleClickIDButton(){
        const { 
            currentFilename,
            currentPathInfo,
            emitAPIRequest,
        } = this.props;

        const {
            currentEpisodesInfo,
            currentSeasonID,
            currentShowID,
            episodeDestPath
        } = this.state;

        this.setState({
            isIDing: true
        });

        const options = {
            id_info: {
                season_id: currentSeasonID,
                show_id: currentShowID,
                episodes: currentEpisodesInfo
            },
            source_path_info: {
                setting_id: currentPathInfo.setting_id,
                subpath: currentPathInfo.subpath
            },
            dest_subpath: episodeDestPath
        };
        
        emitAPIRequest("id.multiple_episodes.id_and_archive", options, this._handleIDMultipleComplete.bind(this), false);
    }

    _handleIDMultipleComplete(){
        const { onIDComplete } = this.props;

        onIDComplete();
    }

    _areAllEpisodesSelected(){
        const { currentEpisodesInfo } = this.state;

        const epFilenames = Object.keys(currentEpisodesInfo);
        for(let i=0; i<epFilenames.length; i++){
            const filename = epFilenames[i];
            if(currentEpisodesInfo[filename].selectedEpisodeID === 0){
                return false;
            }
        }
        return true;
    }

    _buildShowSeasonPathInput(){
        const { episodeDestPath } = this.state;

        let input = "";
        if(episodeDestPath !== ""){
            input = <Input value={episodeDestPath} onChange={this._handleChangeCurrentPath.bind(this)}/>
        }
        return input;
    }

    render() {
        const {
            currentShowID,
            currentSeasonID,
            isVisible,
            onCancel,
        } = this.props;

        const showSeasonSelectors = this._buildShowSeasonSelectors();
        const pathInput = this._buildShowSeasonPathInput();
        const episodesSelectors = this._buildEpisodeSelectors();

        const buttonDisabled = !(this._areAllEpisodesSelected());

        return (
            <Modal
                    title="ID Multiple Episodes"
                    visible={isVisible}
                    onCancel={onCancel}
                    footer={[
                        <Button key="cancel" size="large" onClick={onCancel}>Cancel</Button>
                    ]}
                >
                {showSeasonSelectors}
                {pathInput}
                <div>
                    {episodesSelectors}
                </div>
                <div key="button" className="ib-idmodal-button-box">
                    <Button onClick={this._handleClickIDButton.bind(this)} disabled={buttonDisabled}>ID Episodes</Button>
                </div>
            </Modal>
        )
    }
}

const mapStateToProps = (state)=>{
    return {};
}
const mapDispatchToProps = (dispatch) => {
    return {
        emitAPIRequest: (endpoint, params, callback, shouldDispatch)=>dispatch(emitAPIRequest(endpoint, params, callback, shouldDispatch))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(IDMultipleEpisodesModal);