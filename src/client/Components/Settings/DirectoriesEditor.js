import PropTypes from "prop-types";
import React, { Component } from "react";
import { connect } from "react-redux";
import {
    Button,
    CircularProgress,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
} from "@material-ui/core";

import EditIcon from "@material-ui/icons/Edit";
import FolderIcon from "@material-ui/icons/Folder";
import SaveIcon from "@material-ui/icons/Save";
import DirectorySelectorModal from "./DirectorySelectorModal";

import { deleteSetting, saveSetting } from "../../actions/settings.actions";
import { callAPI } from "../../actions/api.actions";
import { InputAdornment } from "@material-ui/core";

const DEFAULT_INITIAL_DIR = "/";
const BLANK_DATA = {
    id: 0,
    key: "",
    value: DEFAULT_INITIAL_DIR,
};
class DirectoriesEditor extends Component {
    static propTypes = {
        settingCategory: PropTypes.string.isRequired,
        settings: PropTypes.array.isRequired,
    };

    constructor(props) {
        super(props);

        this.state = {
            dirModalSettingID: "",
            dirModalIsVisible: false,
            dirModalSelectedDirectory: DEFAULT_INITIAL_DIR,
            currentlyEditing: [],
            currentEditData: {},
        };
    }

    componentWillReceiveProps(nextProps) {
        const { currentlyEditing, currentEditData } = this.state;
        const { lastAPIAction, lastSavedSettingID } = nextProps;

        if (lastAPIAction === "save") {
            const indexOfLastSave = currentlyEditing.indexOf(
                lastSavedSettingID
            );
            if (indexOfLastSave > -1) {
                currentlyEditing.splice(indexOfLastSave, 1);
            }
            delete currentEditData[lastSavedSettingID];
        }

        this.setState({
            ...this.state,
            currentlyEditing,
            currentEditData,
        });
    }

    _openDirectorySelector(evt) {
        const { currentEditData } = this.state;
        const settingID = evt.currentTarget.getAttribute("data-setting-id");
        this.setState({
            ...this.state,
            dirModalSettingID: settingID,
            dirModalIsVisible: true,
            dirModalSelectedDirectory: currentEditData[settingID].value,
        });
    }

    _okDirectorySelector() {
        const {
            currentEditData,
            dirModalSelectedDirectory,
            dirModalSettingID,
        } = this.state;

        const settingID = dirModalSettingID;

        const newData = { ...currentEditData[settingID] };
        newData["value"] = dirModalSelectedDirectory;
        this.setState({
            ...this.state,
            dirModalSettingID: -1,
            dirModalSelectedDirectory: DEFAULT_INITIAL_DIR,
            dirModalIsVisible: false,
            currentEditData: {
                ...currentEditData,
                [settingID]: newData,
            },
        });
    }

    _cancelDirectorySelector() {
        this.setState({
            ...this.state,
            dirModalSettingID: -1,
            dirModalSelectedDirectory: "",
            dirModalIsVisible: false,
        });
    }

    _handleChangeDirectory(newDir) {
        this.setState({
            ...this.state,
            dirModalSelectedDirectory: newDir,
        });
    }

    _handleSaveButtonPress(e) {
        const { settingCategory } = this.props;
        const { currentEditData } = this.state;
        const settingID = e.currentTarget.getAttribute("data-setting-id");
        if (currentEditData[settingID].key !== "") {
            const settingData = currentEditData[settingID];
            this.props.saveSetting(
                parseInt(settingID),
                settingCategory,
                settingData.key,
                settingData.value
            );
        }
    }

    _handleChangeSettingInput(e) {
        const { currentEditData } = this.state;

        const settingID = e.currentTarget.getAttribute("data-setting-id");
        const settingField = e.currentTarget.getAttribute("data-setting-field");

        const newData = { ...currentEditData[settingID] };
        newData[settingField] = e.currentTarget.value;
        this.setState({
            ...this.state,
            currentEditData: {
                ...currentEditData,
                [settingID]: newData,
            },
        });
    }

    _handleEditSettingClick(e) {
        const { currentlyEditing, currentEditData } = this.state;
        const { settings } = this.props;
        const settingID = parseInt(
            e.currentTarget.getAttribute("data-setting-id")
        );
        currentlyEditing.push(settingID);

        for (let i = 0; i < settings.length; i++) {
            if (settingID === settings[i].id) {
                currentEditData[settingID] = settings[i];
            }
        }

        this.setState({
            ...this.state,
            currentlyEditing,
            currentEditData,
        });
    }

    _handleDeleteSettingClick(e) {
        const settingID = parseInt(
            e.currentTarget.getAttribute("data-setting-id")
        );
        this.props.deleteSetting(settingID);
    }

    _buildInputNameField(settingID) {
        const { saveInProgress } = this.props;
        const { currentEditData } = this.state;
        return (
            <TextField
                variant="outlined"
                onChange={this._handleChangeSettingInput.bind(this)}
                data-setting-field={"key"}
                data-setting-id={settingID}
                value={currentEditData[settingID].key}
                disabled={true}
            />
        );
    }

    _buildInputValueField(settingID, currentValue) {
        const { saveInProgress } = this.props;
        const { currentEditData } = this.state;
        return (
            <span>
                <input
                    className="setting-directory"
                    onChange={this._handleChangeSettingInput.bind(this)}
                    data-setting-field={"value"}
                    data-setting-id={settingID}
                    value={currentEditData[settingID].value}
                    disabled={saveInProgress}
                />
                <Button
                    variant="contained"
                    disableElevation
                    className="setting-dirselector-button"
                    onClick={this._openDirectorySelector.bind(this)}
                    data-setting-id={settingID}
                    startIcon={<FolderIcon />}
                >
                    Choose...
                </Button>
            </span>
        );
    }

    _buildSaveButton(settingID) {
        const { saveInProgress } = this.props;
        if (saveInProgress) {
            return <CircularProgress />;
        } else {
            return (
                <Button
                    variant="contained"
                    size="small"
                    disableElevation
                    data-setting-id={settingID}
                    onClick={this._handleSaveButtonPress.bind(this)}
                    startIcon={<SaveIcon />}
                >
                    Save
                </Button>
            );
        }
    }

    _buildDirectoriesTable() {
        const { settings, saveInProgress } = this.props;
        const { currentlyEditing } = this.state;

        let rows = [];
        settings.forEach((setting) => {
            let cols = [];
            if (currentlyEditing.indexOf(setting.id) > -1) {
                cols.push(this._buildInputNameField(setting.id, setting.key));
            } else {
                cols.push(<span>{setting.key}</span>);
            }
            if (currentlyEditing.indexOf(setting.id) > -1) {
                cols.push(
                    this._buildInputValueField(setting.id, setting.value)
                );
            } else {
                cols.push(<span>{setting.value}</span>);
            }
            if (currentlyEditing.indexOf(setting.id) > -1) {
                cols.push(this._buildSaveButton(setting.id));
            } else {
                cols.push(
                    <Button
                        variant="contained"
                        disableElevation
                        color="primary"
                        size="small"
                        onClick={this._handleEditSettingClick.bind(this)}
                        data-setting-id={setting.id}
                        startIcon={<EditIcon />}
                    >
                        Edit
                    </Button>
                );
            }
            rows.push(cols);
        });
        let rid = 0;
        const trs = rows.map((cols) => {
            let cid = 0;
            const cells = cols.map((col) => {
                cid++;
                return <TableCell key={cid}>{col}</TableCell>;
            });
            rid++;
            return <TableRow key={rid}>{cells}</TableRow>;
        });
        return (
            <TableContainer>
                <Table className="ib-filemanager-table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Setting</TableCell>
                            <TableCell>Directory</TableCell>
                            <TableCell>Edit</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>{trs}</TableBody>
                </Table>
            </TableContainer>
        );
    }

    render() {
        const { dirModalIsVisible } = this.state;

        return (
            <div>
                <div className="ib-settings-editor-wrapper">
                    {this._buildDirectoriesTable()}
                </div>
                <DirectorySelectorModal
                    callAPI={this.props.callAPI}
                    initialPath={DEFAULT_INITIAL_DIR}
                    visible={dirModalIsVisible}
                    onCancel={this._cancelDirectorySelector.bind(this)}
                    onChangeDirectory={this._handleChangeDirectory.bind(this)}
                    onOk={this._okDirectorySelector.bind(this)}
                    serverInfo={this.props.serverInfo}
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
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DirectoriesEditor);
