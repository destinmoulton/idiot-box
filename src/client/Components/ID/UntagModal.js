import PropTypes from "prop-types";
import React, { Component } from "react";

import { Button, Modal } from "antd";

class UntagModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isUntagging: false
        };
    }

    _handlePressOk() {
        this._untagItems();
    }

    _untagItems() {
        const { callAPI, itemsToUntag } = this.props;

        this.setState({
            isUntagging: true
        });

        const options = {
            items_to_remove: itemsToUntag
        };

        callAPI(
            "id.movie_or_episode.remove_ids",
            options,
            this._untagComplete.bind(this),
            false
        );
    }

    _untagComplete(recd) {
        const { onUntagComplete } = this.props;

        this.setState({
            isUntagging: false
        });

        onUntagComplete();
    }

    render() {
        const { onCancel, itemsToUntag, isVisible } = this.props;

        const { isUntagging } = this.state;

        let list = [];
        itemsToUntag.forEach(item => {
            list.push(
                <li key={item.name}>
                    [{item.assocData.type}] <b>{item.assocData.title}</b> ({
                        item.name
                    })
                </li>
            );
        });

        return (
            <div>
                <Modal
                    title="Untag Confirmation"
                    visible={isVisible}
                    onCancel={onCancel}
                    onOk={this._handlePressOk.bind(this)}
                    footer={[
                        <Button key="cancel" size="large" onClick={onCancel}>
                            Cancel
                        </Button>,
                        <Button
                            key="submit"
                            type="primary"
                            size="large"
                            loading={isUntagging}
                            onClick={this._handlePressOk.bind(this)}
                        >
                            Confirm Untag
                        </Button>
                    ]}
                >
                    <div className="ib-trashmodal-list-box">
                        <ul className="ib-trashmodal-list">{list}</ul>
                    </div>
                </Modal>
            </div>
        );
    }
}

UntagModal.propTypes = {
    callAPI: PropTypes.func.isRequired,
    isVisible: PropTypes.bool.isRequired,
    itemsToUntag: PropTypes.array.isRequired,
    onCancel: PropTypes.func.isRequired,
    onUntagComplete: PropTypes.func.isRequired
};

export default UntagModal;
