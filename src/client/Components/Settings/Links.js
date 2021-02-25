import React from "react";
import _ from "lodash";

import { connect } from "react-redux";

import Button from "@material-ui/core/Button";
import LinkTable from "./Links/LinkTable";
import HelpModal from "./Links/HelpModal";

import { deleteSetting, saveSetting } from "../../actions/settings.actions";
import { callAPI } from "../../actions/api.actions";

const TYPES_OF_LINKS = [
    { name: "Episode", id: "link_for_episode" },
    { name: "Show", id: "link_for_show" },
    { name: "Movie", id: "link_for_movie" },
];
class Links extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isHelpModalVisible: false,
        };
    }

    _handleToggleHelpModal(toggleState) {
        this.setState({
            isHelpModalVisible: toggleState,
        });
    }
    _handleSaveLink(linkset) {
        // Encode the value field (multiple properties)
        // into a json string
        const mutable = _.clone(linkset);
        mutable.value = JSON.stringify(mutable.value);

        this.props.saveSetting(
            parseInt(mutable.id),
            "links",
            mutable.key,
            mutable.value
        );
    }
    _handleClickDelete(settingID) {
        this.props.deleteSetting(parseInt(settingID), "links");
    }
    render() {
        const { links } = this.props;
        const { isHelpModalVisible } = this.state;
        return (
            <div>
                <LinkTable
                    links={links}
                    saveLink={(linkset) => this._handleSaveLink(linkset)}
                    onDelete={(settingID) => this._handleClickDelete(settingID)}
                    linkTypes={TYPES_OF_LINKS}
                />
                <div style={{ textAlign: "center" }}>
                    <Button
                        variant="contained"
                        size="small"
                        color="primary"
                        disableElevation
                        onClick={() => this._handleToggleHelpModal(true)}
                    >
                        Link Code Help
                    </Button>
                </div>
                <HelpModal
                    isVisible={isHelpModalVisible}
                    onClose={() => this._handleToggleHelpModal(false)}
                />
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        serverInfo: state.server.serverInfo,
    };
};
const mapDispatchToProps = (dispatch) => {
    return {
        callAPI: (endpoint, params, callback, shouldDispatch) =>
            dispatch(callAPI(endpoint, params, callback, shouldDispatch)),
        saveSetting: (settingID, category, key, value) =>
            dispatch(saveSetting(settingID, category, key, value)),
        deleteSetting: (settingID, category) =>
            dispatch(deleteSetting(settingID, category)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Links);
