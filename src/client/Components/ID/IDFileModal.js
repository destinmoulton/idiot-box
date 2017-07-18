import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';

import { 
    Button,
    Checkbox,
    Col,
    Input,
    Modal,
    Row
} from 'antd';

import MovieCheckForm from './MovieCheckForm';
import MovieSearchResults from './MovieSearchResults';

class IDFileModal extends Component {
    static propTypes = {
        currentFilename: PropTypes.string.isRequired,
        currentPathInfo: PropTypes.object.isRequired,
        isVisible: PropTypes.bool.isRequired,
        onCancel: PropTypes.func.isRequired,
        onIDComplete: PropTypes.func.isRequired
    };

    constructor(props){
        super(props);

        this.state = {
            currentView: 'two_column_single_id',
            movieSearchString: ""
        };
    }

    _handleCancel(){
        const { onCancel } = this.props;
        this.setState({
            currentView: 'two_column_single_id',
            movieSearchString: ""
        });
        onCancel();
    }

    _handleClickSearchMovies(movieSearchString){
        this.setState({
            currentView: 'movie_search_results',
            movieSearchString
        });
    }

    _buildTwoColumnSingleID(){
        const { currentFilename } = this.props;
        return (
            <div>
                <Col span={8}>
                    <MovieCheckForm
                        currentFilename={currentFilename}
                        onSearchMovies={this._handleClickSearchMovies.bind(this)}
                    />
                </Col>
                <Col span={8} offset={2}>
                    <h4>ID Episode Here</h4>
                </Col>
            </div>
        );
    }

    _buildMovieSearchResults(){
        const { movieSearchString } = this.state;
        const { currentFilename, currentPathInfo, onIDComplete } = this.props;

        return <MovieSearchResults 
                    initialSearchString={movieSearchString}
                    currentFilename={currentFilename}
                    currentPathInfo={currentPathInfo}
                    onIDComplete={onIDComplete}/>;
    }

    _selectCurrentView(){
        const { currentView } = this.state;
        switch(currentView){
            case 'two_column_single_id':
                return this._buildTwoColumnSingleID();
            case 'movie_search_results':
                return this._buildMovieSearchResults();
        }
    }

    render() {
        const { currentFilename, isVisible } = this.props;

        const contents = this._selectCurrentView();

        return (
            <div>
                <Modal
                    title="ID File"
                    visible={isVisible}
                    onCancel={this._handleCancel.bind(this)}
                    onOk={()=>{}}
                    footer={[
                        <Button key="cancel" size="large" onClick={this._handleCancel.bind(this)}>Cancel</Button>,
                    ]} >
                    <Row>
                        {contents}
                    </Row>
                </Modal>
            </div>
        );
    }
}

export default IDFileModal;