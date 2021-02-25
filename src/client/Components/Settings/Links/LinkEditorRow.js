import React from "react";

import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import CancelIcon from "@material-ui/icons/Cancel";
import LinkTypeSelector from "./LinkTypeSelector";
import SaveIcon from "@material-ui/icons/Save";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
const LinkEditorRow = ({ linkTypes, linkset, onChange, onSave, onCancel }) => {
    const selector = (
        <LinkTypeSelector
            selectedValue={linkset.key}
            options={linkTypes}
            onChange={(evt) => {
                onChange(linkset.id, "key", evt.currentTarget.value);
            }}
        />
    );

    return (
        <TableRow>
            <TableCell>{selector}</TableCell>
            <TableCell>
                <input
                    type="text"
                    value={linkset.value.title}
                    onChange={(evt) => {
                        onChange(
                            linkset.id,
                            "value.title",
                            evt.currentTarget.value
                        );
                    }}
                />
            </TableCell>
            <TableCell>
                <input
                    type="text"
                    value={linkset.value.link}
                    onChange={(evt) => {
                        onChange(
                            linkset.id,
                            "value.link",
                            evt.currentTarget.value
                        );
                    }}
                />
            </TableCell>
            <TableCell>
                <ButtonGroup>
                    <Button
                        startIcon={<SaveIcon />}
                        variant="contained"
                        size="small"
                        disableElevation
                        onClick={() => onSave(linkset.id)}
                    >
                        Save
                    </Button>
                    <Button
                        startIcon={<CancelIcon />}
                        variant="contained"
                        size="small"
                        disableElevation
                        onClick={() => onCancel(linkset.id)}
                    >
                        Cancel
                    </Button>
                </ButtonGroup>
            </TableCell>
        </TableRow>
    );
};

export default LinkEditorRow;
