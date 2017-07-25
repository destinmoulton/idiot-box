import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Button, Select } from 'antd';
const Option = Select.Option;

import { emitAPIRequest } from '../../actions/api.actions';

class EpisodeIDSelector extends Component {
    static propTypes = {
        onIDEpisode: PropTypes.func.isRequired
    }

    constructor(props){
        super(props);

        this.state = {
            currentShowID: 0,
            currentSeasonID: 0,
            currentEpisodeID: 0,
            episodes: [],
            seasons: [],
            shows: []
        };
    }

    componentWillMount(){
        this._getShows();
    }

    _getShows(){
        const { emitAPIRequest } = this.props;

        emitAPIRequest("shows.shows.get", {}, this._showsReceived.bind(this), false);
    }

    _showsReceived(shows){
        this.setState({
            currentSeasonID: 0,
            currentEpisodeID: 0,
            shows,
            seasons: [],
            episodes: []
        });
    }

    _getSeasons(showID){
        const { emitAPIRequest } = this.props;

        this.setState({
            currentEpisodeID: 0,
            currentSeasonID: 0,
            currentShowID: parseInt(showID),
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

        this.setState({
            currentSeasonID: parseInt(seasonID),
            currentEpisodeID: 0,
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

    _handleSelectEpisode(episodeID){
        this.setState({
            currentEpisodeID: parseInt(episodeID)
        })
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

    _handleClickIDButton(){
        const { onIDEpisode } = this.props;
        const {
            currentShowID,
            currentSeasonID,
            currentEpisodeID } = this.state;

        const episodeInfo = {
            currentShowID,
            currentSeasonID,
            currentEpisodeID
        };

        onIDEpisode(episodeInfo);
    }
    
    render() {
        const {
            currentShowID,
            currentSeasonID,
            currentEpisodeID,
            episodes,
            seasons,
            shows } = this.state;

        const showSelector = this._buildSelect(shows, 'title', this._getSeasons.bind(this), currentShowID);
        let seasonsSelector = "Select a show...";
        if(currentShowID > 0){
            seasonsSelector = this._buildSelect(seasons, 'title', this._getEpisodes.bind(this), currentSeasonID);
        }
        let episodesSelector = "Select a season...";
        if(currentSeasonID > 0){
            episodesSelector = this._buildSelect(episodes, 'episode_number', this._handleSelectEpisode.bind(this), currentEpisodeID, "Episode ");
        }

        let buttonDisabled = true;
        if( (currentShowID > 0) && (currentSeasonID > 0) && (currentEpisodeID > 0)){
            buttonDisabled = false;
        }
        return (
            <div>
                <div key="show">
                {showSelector}
                </div>
                <div key="season">
                {seasonsSelector}
                </div>
                <div key="episode">
                {episodesSelector}
                </div>
                <div key="button" className="ib-idmodal-button-box">
                    <Button onClick={this._handleClickIDButton.bind(this)} disabled={buttonDisabled}>ID Episode</Button>
                </div>
            </div>
        );
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

export default connect(mapStateToProps, mapDispatchToProps)(EpisodeIDSelector);