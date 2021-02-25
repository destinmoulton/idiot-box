import React from "react";
import _ from "lodash";

import AddIcon from "@material-ui/icons/Add";
import Button from "@material-ui/core/Button";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

import LinkEditorRow from "./LinkEditorRow";
import LinkRegularRow from "./LinkRegularRow";
class LinkTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentlyEditing: new Map(),
        };
    }

    _handleClickEditLink(settingID) {
        const { currentlyEditing } = this.state;
        const { links } = this.props;

        let linkset = links.filter((link) => {
            return link.id === settingID;
        });
        if (linkset.length > 0) {
            linkset = linkset[0];
            let newEditMap = new Map(currentlyEditing);

            newEditMap.set(settingID, linkset);

            this.setState({
                currentlyEditing: newEditMap,
            });
        }
    }
    _handleSave(settingID) {
        const { currentlyEditing } = this.state;
        if (currentlyEditing.has(settingID)) {
            const linkset = currentlyEditing.get(settingID);
            this.props.saveLink(linkset);

            // Create a new map for immutability
            const newEditMap = new Map(currentlyEditing);
            newEditMap.delete(settingID);
            this.setState({ currentlyEditing: newEditMap });
        }
    }

    _handleCancel(settingID) {
        const { currentlyEditing } = this.state;
        currentlyEditing.delete(settingID);
        this.setState({ currentlyEditing });
    }

    _handleChangeFormInput(linkID, propertyPath, value) {
        const { currentlyEditing } = this.state;
        const linkset = currentlyEditing.get(linkID);

        // Use lodash set to alter the property value
        // as some are nested properties
        _.set(linkset, propertyPath, value);

        currentlyEditing.set(linkID, linkset);
        this.setState({ currentlyEditing });
    }
    _handleClickAdd() {
        const { linkTypes } = this.props;
        const { currentlyEditing } = this.state;
        if (!currentlyEditing.has(0)) {
            const newlink = {
                id: 0,
                category: "links",
                key: linkTypes[0].id,
                value: {
                    title: "",
                    link: "",
                },
            };
            currentlyEditing.set(0, newlink);
        }
        this.setState({ currentlyEditing });
    }

    render() {
        const { currentlyEditing } = this.state;
        const { links, linkTypes, onDelete } = this.props;

        let rows = [];
        if (currentlyEditing.has(0)) {
            // Build the new row
            const linkset = currentlyEditing.get(0);
            rows.push(
                <LinkEditorRow
                    key="newlink"
                    linkTypes={linkTypes}
                    linkset={linkset}
                    onChange={(id, key, value) =>
                        this._handleChangeFormInput(id, key, value)
                    }
                    onSave={(settingID) => this._handleSave(settingID)}
                    onCancel={(settingID) => this._handleCancel(settingID)}
                />
            );
        }
        for (const linkset of links) {
            if (currentlyEditing.has(linkset.id)) {
                rows.push(
                    <LinkEditorRow
                        key={linkset.id}
                        linkTypes={linkTypes}
                        linkset={linkset}
                        onChange={(id, key, value) =>
                            this._handleChangeFormInput(id, key, value)
                        }
                        onSave={(settingID) => this._handleSave(settingID)}
                        onCancel={(settingID) => this._handleCancel(settingID)}
                    />
                );
            } else {
                rows.push(
                    <LinkRegularRow
                        key={linkset.id}
                        linkTypes={linkTypes}
                        linkset={linkset}
                        onEdit={(settingID) =>
                            this._handleClickEditLink(settingID)
                        }
                        onDelete={onDelete}
                    />
                );
            }
        }

        return (
            <div>
                <h3>Links</h3>
                <div>
                    <Button
                        onClick={this._handleClickAdd.bind(this)}
                        startIcon={<AddIcon />}
                        variant="contained"
                        size="small"
                        disableElevation
                    >
                        Add a Link
                    </Button>
                </div>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Type</TableCell>
                                <TableCell>Title</TableCell>
                                <TableCell>Link</TableCell>
                                <TableCell>Edit</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>{rows}</TableBody>
                    </Table>
                </TableContainer>
            </div>
        );
    }
}
export default LinkTable;
