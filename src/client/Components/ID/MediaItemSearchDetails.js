import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Button, Col, Spin } from 'antd';

import { emitAPIRequest } from '../../actions/api.actions';

class MediaItemSearchDetails extends Component {

    static propTypes = {
        onSelectItem: PropTypes.func.isRequired
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
        const { emitAPIRequest, item } = this.props;

        const options = {
            imdb_id: item.ids.imdb
        };
        
        emitAPIRequest("imdb.image.get", options, this._imageReceived.bind(this), false);
    }

    _handleSelectMovie(item){
        const { onSelectItem } = this.props;
        const { imageURL } = this.state;

        onSelectItem(item, imageURL);
    }

    _imageReceived(imageURL){
        this.setState({
            imageURL
        });
    }

    render() {
        const { imageURL } = this.state;
        const { item, onSelectItem } = this.props;

        let image = <Spin />;
        if(imageURL){
            image = <img src={imageURL} className={"ib-idmodal-item-search-details-img"} />
        }
        let movieTitle = {__html: item.title};
        return (
            <Col 
                span={6} 
                key={item.ids.trakt} 
                className={"ib-idmodal-item-search-details-box"}>
                <div className={"ib-idmodal-item-search-details-img-box"}>
                    {image}
                </div>
                <div>
                    <b><span dangerouslySetInnerHTML={movieTitle} /></b>
                    <br/>
                    {item.year}
                    <br/>
                    <Button type="primary" icon="check" onClick={this._handleSelectMovie.bind(this, item)}>This Is It</Button>
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

export default connect(mapStateToProps, mapDispatchToProps)(MediaItemSearchDetails);