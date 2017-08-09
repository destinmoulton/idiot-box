import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Button, Col, Modal, Row } from 'antd';

import { emitAPIRequest } from '../../actions/api.actions';
class MovieInfoModal extends Component {
    static propTypes = {
        isVisible: PropTypes.bool.isRequired,
        movie: PropTypes.object.isRequired,
        onClose: PropTypes.func.isRequired 
    };

    _handlePressDelete(){
        const { movie } = this.props;

        if(confirm(`Really delete ${movie.title}`)){
            this._deleteMovie();
        }
    }

    _deleteMovie(){
        const { emitAPIRequest, movie } = this.props;

        const params = {
            movie_id: movie.id
        };

        emitAPIRequest("movies.movie.delete", params, this._movieDeleted.bind(this), false);
    }

    _movieDeleted(){
        const { onClose } = this.props;
        onClose(true);
    }

    render() {
        const {
            isVisible,
            movie,
            onClose
        } = this.props;
        
        return (
            <Modal
                    title="Movie Info"
                    visible={isVisible}
                    onCancel={onClose}
                    footer={[
                        <Button key="close" size="large" onClick={onClose}>Close</Button>
                    ]}
                >
                <Row>
                    <Col span={5}>
                        <div className="ib-movies-thumbnail-box">
                            <img
                                className="ib-movies-thumbnail" 
                                src={"/images/movies/" + movie.image_filename}/>
                        </div>
                    </Col>
                    <Col span={18} offset={1}>
                        <h3 dangerouslySetInnerHTML={{__html: movie.title}}></h3>
                        <h4>{movie.year}</h4>
                        <h4><a href={"http://imdb.com/title/" + movie.imdb_id} target="_blank">IMDB</a></h4>
                        <Button onClick={this._handlePressDelete.bind(this)}>Delete</Button>
                        <p>{movie.overview}</p>
                    </Col>
                </Row>
            </Modal>
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

export default connect(mapStateToProps, mapDispatchToProps)(MovieInfoModal);