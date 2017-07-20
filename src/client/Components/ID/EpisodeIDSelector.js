import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Select } from 'antd';
const Option = Select.Option;

import { emitAPIRequest } from '../../actions/api.actions';

class EpisodeIDSelector extends Component {

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
            shows
        });
    }

    _getSeasons(showID){
        const { emitAPIRequest } = this.props;

        this.setState({
            currentShowID: showID
        });

        const options = {
            show_id: showID
        };
        emitAPIRequest("shows.seasons.get", options, this._seasonsReceived.bind(this), false);
    }

    _seasonsReceived(seasons){
        this.setState({
            seasons
        });
    }

    _getEpisodes(seasonID){
        const { emitAPIRequest } = this.props;

        this.setState({
            currentSeasonID: seasonID
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

    _buildSelect(items, titleKey, onChange){
        let options = [];
        items.forEach((item)=>{
            options.push(<Option key={item.id.toString()} value={item.id.toString()}>{item[titleKey]}</Option>)
        });

        return (
            <Select onChange={onChange} style={{ width: 200}}>
                {options}
            </Select>
        );
    }

    render() {
        const { episodes, seasons, shows } = this.state;

        const showSelector = this._buildSelect(shows, 'title', this._getSeasons.bind(this));
        const seasonsSelector = this._buildSelect(seasons, 'title', this._getEpisodes.bind(this));
        const episodesSelector = this._buildSelect(episodes, 'episode_number', ()=>{});
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