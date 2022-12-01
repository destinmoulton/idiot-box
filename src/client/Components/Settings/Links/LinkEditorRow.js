import React from "react";

import { Button, ButtonGroup, TableCell, TableRow } from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import LinkTypeSelector from "./LinkTypeSelector";
import SaveIcon from "@mui/icons-material/Save";
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
                    style={{ width: "100%" }}
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
                    style={{ width: "100%" }}
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
