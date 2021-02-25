import React from "react";

import ButtonGroup from "@material-ui/core/ButtonGroup";
import Button from "@material-ui/core/Button";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
const LinkRegularRow = ({ linkset, linkTypes, onEdit, onDelete }) => {
    const currentType = linkTypes.filter((type) => {
        return type.id === linkset.key;
    });

    return (
        <TableRow>
            <TableCell>{currentType[0].name}</TableCell>
            <TableCell>{linkset.value.title}</TableCell>
            <TableCell>{linkset.value.link}</TableCell>
            <TableCell>
                <ButtonGroup>
                    <Button
                        startIcon={<EditIcon />}
                        onClick={() => onEdit(linkset.id)}
                        variation="contained"
                        disableElevation
                    >
                        Edit
                    </Button>
                    <Button
                        startIcon={<DeleteIcon />}
                        onClick={() => onDelete(linkset.id)}
                        variation="contained"
                        disableElevation
                    >
                        Delete
                    </Button>
                </ButtonGroup>
            </TableCell>
        </TableRow>
    );
};

export default LinkRegularRow;
