import React, { Component } from 'react';

import SeasonsList from './SeasonsList';
import ShowsList from './ShowsList';

class ShowsRouter extends Component {
    constructor(props){
        super(props);

        this.state = {
            currentView: 'shows_list',
            selectedShow: {}
        };
    }

    _handleSelectShow(show){

        this.setState({
            currentView: 'seasons_list',
            selectedShow: show
        });
    }

    render() {
        const { currentView, selectedShow } = this.state;

        let contents = "";
        switch(currentView){
            case 'shows_list':
                contents = <ShowsList onSelectShow={this._handleSelectShow.bind(this)}/>;
                break;
            case 'seasons_list':
                contents = <SeasonsList show={selectedShow}/>;
                break;
        }
        
        return (
            <div>{contents}</div>    
        );
    }
}

export default ShowsRouter;