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
            episodePath: "",
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
            currentEpisodeID: 0,
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
            currentEpisodeID: 0,
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
        
        const name = Regex.getShowName(currentShowInfo.title);
        const seasonNum = this._getSeasonString(currentSeasonInfo);
        const episodePath = name + "/" + seasonNum;
        this.setState({
            currentSeasonID: parseInt(seasonID),
            currentSeasonInfo,
            currentEpisodeID: 0,
            episodePath,
            episodes: []
        });

        const options = {
            show_id: this.state.currentShowID,
            season_id: seasonID
        };
        emitAPIRequest("shows.episodes.get", options, this._episodesReceived.bind(this), false);
    }

    _episodesReceived(episodes){
        
        this.setState({
            episodes
        });
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

    _handleChangeEpisodeFilename(filename, evt){
        const { currentEpisodesInfo } = this.state;

        currentEpisodesInfo[filename].newFilename = evt.target.value;

        this.setState({
            currentEpisodesInfo
        });
    }

    _buildShowSeasonPathInput(){
        const { episodePath } = this.state;

        let input = "";
        if(episodePath !== ""){
            input = <Input value={episodePath} onChange={this._handleChangeCurrentPath.bind(this)}/>
        }
        return input;
    }

    _handleChangeCurrentPath(evt){
        const newPath = evt.target.value;

        this.setState({
            episodePath: newPath
        });
    }

    _handleSelectEpisode(filename, episodeID){
         const {
            currentShowID,
            currentShowInfo,
            currentSeasonID,
            currentSeasonInfo,
            currentEpisodesInfo,
            episodes,
            seasons,
            shows
        } = this.state;
        
        let currentEpisode = episodes.find((ep)=>ep.id === parseInt(episodeID));
        let episodeNum = "E";
        if(currentEpisode.episode_number < 10){
            episodeNum += "0";
        }
        episodeNum += currentEpisode.episode_number.toString();

        const ext = filename.split(".").pop();

        const name = Regex.getShowName(currentShowInfo.title);
        const seasonNum = this._getSeasonString(currentSeasonInfo);
        let episodeInfo = currentEpisodesInfo[filename];
        episodeInfo.newFilename = name + "." + seasonNum + "." + episodeNum + "." + ext;
        episodeInfo.selectedEpisodeID = episodeID;

        currentEpisodesInfo[filename] = episodeInfo;
        this.setState({
            currentEpisodesInfo
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
        const { newDirectory, newFilename } = this.state;

        this.setState({
            isIDing: true
        });

        const options = {
            episode_info: {
                show_id: episodeInfo.currentShowID,
                season_id: episodeInfo.currentSeasonID,
                episode_id: episodeInfo.currentEpisodeID
            },
            source_info: {
                setting_id: currentPathInfo.setting_id,
                filename: currentFilename,
                subpath: currentPathInfo.subpath
            },
            dest_info: {
                filename: newFilename,
                subpath: newDirectory
            }
        };
        emitAPIRequest("id.multiple_episodes.id_and_archive", options, this._handleIDMultipleComplete.bind(this), false);
    }

    _handleIDMultipleComplete(){
        const { onIDComplete } = this.state;

        onIDComplete();
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

        let buttonDisabled = true;
        if( (currentShowID > 0) && (currentSeasonID > 0)){
            buttonDisabled = false;
        }
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