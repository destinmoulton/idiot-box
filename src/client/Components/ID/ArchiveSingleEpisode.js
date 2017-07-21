import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Button, Input, Spin } from 'antd';

import { emitAPIRequest } from '../../actions/api.actions';

class ArchiveSingleEpisode extends Component {
    static propTypes = {
        episodeInfo: PropTypes.object.isRequired
    };

    constructor(props){
        super(props);

        this.state = {
            isCollating: false,
            episode: {},
            season: {},
            show: {}
        };
    }

    componentWillMount(){
        this._getEpisodeCollation();
    }

    _getEpisodeCollation(){
        const { emitAPIRequest, episodeInfo } = this.props;

        this.setState({
            isCollating: true
        });

        const options = {
            episode_info: {
                show_id: episodeInfo.currentShowID,
                season_id: episodeInfo.currentSeasonID,
                episode_id: episodeInfo.currentEpisodeID
            }
        };
        emitAPIRequest("shows.episode.collate", options, this._handleCollationReceived.bind(this), false);
    }

    _handleCollationReceived(data){
        this.setState({
            isCollating: false,
            episode: data.episode,
            season: data.season,
            show: data.show
        });
    }

    _buildEpisodeForm(){
        const {
            episode,
            season,
            show
        } = this.state;
        console.log(episode);
        return (
            <div>
                <div>{show.title}</div>
                <div>{season.title}</div>
                <div>Episode {episode.episode_number}</div>
                <div>
                    <Button>Archive Episode</Button>
                </div>
            </div>
        );
    }

    render() {
        const { isCollating } = this.state;

        let content = <Spin />;
        if(!isCollating){
            content = this._buildEpisodeForm();
        }

        return (
            <div>{content}</div>
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

export default connect(mapStateToProps, mapDispatchToProps)(ArchiveSingleEpisode);