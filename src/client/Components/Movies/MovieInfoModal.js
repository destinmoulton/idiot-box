import PropTypes from 'prop-types';
import React, { Component } from 'react';

import { Button, Col, Modal, Row } from 'antd';

class MovieInfoModal extends Component {
    static propTypes = {
        isVisible: PropTypes.bool.isRequired,
        movie: PropTypes.object.isRequired,
        onClose: PropTypes.func.isRequired 
    };

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
                        <p>{movie.overview}</p>
                    </Col>
                </Row>
            </Modal>
        );
    }
}

export default MovieInfoModal;