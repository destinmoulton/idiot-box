import React, {Component} from "react";
import {Box} from "@mui/material";

const TabPanel = ({children, value, index, ...other}) => {
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`moverenamemodal-tabpanel-${index}`}
            aria-labelledby={`moverenamemodal-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{p: 3}}>
                    {children}
                </Box>
            )}
        </div>
    );
};

export default TabPanel;