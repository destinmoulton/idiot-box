import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Button, Col, Spin } from 'antd';

import { emitAPIRequest } from '../../actions/api.actions';

class MovieSearchDetails extends Component {

    static propTypes = {
        onSelectMovie: PropTypes.func.isRequired
    };

    constructor(props){
        super(props);

        this.state = {
            imageURL: ""
        };
    }

    componentWillMount(){
        this._getImageFromServer();
    }

    _getImageFromServer(){
        const { emitAPIRequest, movie } = this.props;

        const options = {
            imdb_id: movie.ids.imdb
        };
        
        emitAPIRequest("imdb.image.get", options, this._imageReceived.bind(this), false);
    }

    _handleSelectMovie(movie){
        const { onSelectMovie } = this.props;
        const { imageURL } = this.state;

        onSelectMovie(movie, imageURL);
    }

    _imageReceived(imageURL){
        this.setState({
            imageURL
        });
    }

    render() {
        const { imageURL } = this.state;
        const { movie, onSelectMovie } = this.props;

        let image = <Spin />;
        if(imageURL){
            image = <img src={imageURL} className={"ib-movie-search-details-img"} />
        }
        return (
            <Col 
                span={6} 
                key={movie.ids.trakt} 
                className={"ib-movie-search-details-box"}>
                <div className={"ib-movie-search-details-img-box"}>
                    {image}
                </div>
                <div>
                    <b>{movie.title}</b>
                    <br/>
                    {movie.year}
                    <br/>
                    <Button type="primary" icon="check" onClick={this._handleSelectMovie.bind(this, movie)}>This Is It</Button>
                </div>
            </Col>
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

export default connect(mapStateToProps, mapDispatchToProps)(MovieSearchDetails);