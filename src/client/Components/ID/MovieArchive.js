import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Button, Input, Spin } from 'antd';

import { emitAPIRequest } from '../../actions/api.actions';

class MovieArchive extends Component {
    static propTypes = {
        currentFilename: PropTypes.string.isRequired,
        currentPathInfo: PropTypes.object.isRequired,
        movie: PropTypes.object.isRequired,
        movieImageURL: PropTypes.string.isRequired,
        onIDComplete: PropTypes.func.isRequired
    };

    constructor(props){
        super(props);

        this.state = {
            newMovieDirectory: "",
            newMovieFilename: "",
            isIDing: false
        };
    }

    componentWillMount(){
        this.setState({
            newMovieDirectory: this._getMovieTitleAndYear(),
            newMovieFilename: this._getMovieFilename()
        });
    }

    _getMovieFilename(){
        const { currentFilename, movie } = this.props;

        const ext = currentFilename.split(".").pop();

        const movieName = this._getMovieTitleAndYear(movie);

        return movieName + "." + ext;
    }
    
    _getMovieTitleAndYear(){
        const { movie } = this.props;

        const movieName = this._getCleanMovieName(movie);

        return movieName + "." + movie.year.toString();
    }

    _getCleanMovieName(movie){

        // Replace current periods
        let newName = movie.title.replace(/\./g, "");

        // Replace spaces and dashes with periods
        newName = newName.replace(/(\s|\-)/g, ".");

        // Replace everything else with blank
        return newName.replace(/[^\.a-zA-Z0-9]/g, "");
    }

     _idAndArchiveMovie(){
        const { 
            currentFilename,
            currentPathInfo,
            emitAPIRequest,
            movie,
            movieImageURL
        } = this.props;

        const {
            newMovieDirectory,
            newMovieFilename
        } = this.state;


        this.setState({
            isIDing: true
        });

        const options = {
            movie_info: movie,
            image_url: movieImageURL,
            source_info: {
                setting_id: currentPathInfo.setting_id,
                subpath: currentPathInfo.subpath,
                filename: currentFilename
            },
            dest_info: {
                subpath: newMovieDirectory,
                filename: newMovieFilename
            }
        };
        
        emitAPIRequest("id.movie.id_and_archive", options, this._idMovieComplete.bind(this), false);
    }

    _idMovieComplete(recd){
        const { onIDComplete } = this.props;

        onIDComplete();
    }

    _handleChangeFilename(evt){
        this.setState({
            newMovieFilename: evt.target.value
        });
    }

    _handleChangeDirectory(evt){
        this.setState({
            newMovieDirectory: evt.target.value
        });
    }

    _buildEpisodeForm(){
        const {
            newMovieDirectory,
            newMovieFilename
        } = this.state;

        const {
            movie
        } = this.props;
        
        return (
            <div>
                <div className="ib-idmodal-archivesingle-episodeinfo">
                    <div>{movie.title}</div>
                    <div>{movie.year}</div>
                </div>
                <div className="ib-idmodal-archivesingle-form-box">
                    Directory: <Input onChange={this._handleChangeDirectory.bind(this)}
                                    value={newMovieDirectory}/>
                    Filename: <Input onChange={this._handleChangeFilename.bind(this)}
                                    value={newMovieFilename}/>
                    <div className="ib-idmodal-button-box">
                        <Button className="ib-button-green"
                                onClick={this._idAndArchiveMovie.bind(this)}>Archive Movie</Button>
                    </div>
                </div>
                
            </div>
        );
    }

    render() {
        const { isIDing } = this.state;

        let contents = "";
        if(isIDing){
            contents = <Spin />;
        } else {
            contents = this._buildEpisodeForm();
        }
        
        return (
            <div>
                {contents}
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

export default connect(mapStateToProps, mapDispatchToProps)(MovieArchive);