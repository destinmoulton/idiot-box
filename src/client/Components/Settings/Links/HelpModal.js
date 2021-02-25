import React from "react";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
const HelpModal = ({}) => {
    return (
        <TableContainer>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Code</TableCell>
                        <TableCell>Description</TableCell>
                        <TableCell>Example</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    <TableRow>
                        <TableCell>{"{imdb_id}"}</TableCell>
                        <TableCell>IMDB ID</TableCell>
                        <TableCell>
                            https://www.imdb.com/title/{"{imdb_id}"}/
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>{"{SHOW_TITLE}"}</TableCell>
                        <TableCell>Season #, two or more digits </TableCell>
                        <TableCell>
                            https://www.google.com/search?q={"{SHOW_TITLE}"}/
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>{"{SEASON_##}"}</TableCell>
                        <TableCell>Season number, two or more digits</TableCell>
                        <TableCell>
                            https://www.google.com/search?q={"{SHOW_TITLE}"}
                            +Season+{"{SEASON_##}"}/
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>{"{EPISODE_##}"}</TableCell>
                        <TableCell>Season number, two or more digits</TableCell>
                        <TableCell>
                            https://www.google.com/search?q={"{SHOW_TITLE}"}
                            +Episode+{"{EPISODE_##}"}/
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default HelpModal;
