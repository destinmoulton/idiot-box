import React from "react";

import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
import Checkbox from "@material-ui/core/Checkbox";
import FolderIcon from "@material-ui/icons/Folder";
import IconButton from "@material-ui/core/IconButton";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

import FileDetails from "./FileDetails";

const PARENT_DIR_NAME = "..";
const buildTableRows = ({
    basePath,
    enableCheckboxes,
    enableSize,
    handleClickDir,
    handleClickSingleCheckbox,
    path,
    rowData,
    selectedRows,
}) => {
    const rows = [];
    rowData.forEach((item) => {
        let name = "";
        let checked = false;
        let hasCheckbox = false;
        if (enableCheckboxes) {
            hasCheckbox = true;
            if (selectedRows.has(item.name)) {
                checked = true;
            }
        }
        if (item.isDirectory) {
            let icon = <FolderIcon className="filemanager-folder-icon" />;
            if (item.name === PARENT_DIR_NAME) {
                hasCheckbox = false;
                icon = <ArrowUpwardIcon className="filemanager-arrowup-icon" />;
            }
            name = (
                <div
                    className="filemanager-directory-details"
                    onClick={() => handleClickDir(item.name)}
                >
                    <IconButton className="filemanager-directory-icon">
                        {icon}
                    </IconButton>
                    <div className="filemanager-directory-name">
                        {item.name}
                    </div>
                </div>
            );
        } else {
            name = (
                <FileDetails
                    assocData={item.assocData}
                    filename={item.name}
                    basePath={basePath}
                    fullPath={path}
                />
            );
        }

        let checkbox = null;
        if (hasCheckbox) {
            checkbox = (
                <Checkbox
                    checked={checked}
                    onChange={() => handleClickSingleCheckbox(item.name)}
                />
            );
        }

        let checkboxColumn = null;
        if (enableCheckboxes) {
            checkboxColumn = (
                <TableCell className="filemanager-checkbox-column">
                    {checkbox}
                </TableCell>
            );
        }

        let sizeColumn = "";
        if (enableSize) {
            sizeColumn = (
                <TableCell align="right" className="filemanager-size-column">
                    {item.size}
                </TableCell>
            );
        }
        rows.push(
            <TableRow key={item.name}>
                {checkboxColumn}
                <TableCell className="filemanager-name-column">
                    {name}
                </TableCell>
                {sizeColumn}
            </TableRow>
        );
    });
    return rows;
};

const BrowserTable = ({
    basePath,
    enableCheckboxes,
    enableSize,
    handleClickAllCheckbox,
    handleClickDir,
    handleClickSingleCheckbox,
    isAllChecked,
    path,
    rowData,
    selectedRows,
}) => {
    const rows = buildTableRows({
        basePath,
        enableCheckboxes,
        enableSize,
        handleClickDir,
        handleClickSingleCheckbox,
        path,
        rowData,
        selectedRows,
    });
    let checkboxColumn = null;
    if (enableCheckboxes) {
        checkboxColumn = (
            <TableCell className="filemanager-checkbox-column">
                <Checkbox
                    checked={isAllChecked}
                    onChange={handleClickAllCheckbox}
                />
            </TableCell>
        );
    }

    let sizeColumn = null;
    if (enableSize) {
        sizeColumn = (
            <TableCell align="right" className="filemanager-size-column">
                Size
            </TableCell>
        );
    }

    return (
        <TableContainer>
            <Table className="ib-filemanager-table">
                <TableHead>
                    <TableRow>
                        {checkboxColumn}
                        <TableCell
                            align="left"
                            className="filemanager-name-column"
                        >
                            Name
                        </TableCell>
                        {sizeColumn}
                    </TableRow>
                </TableHead>
                <TableBody>{rows}</TableBody>
            </Table>
        </TableContainer>
    );
};

export default BrowserTable;
