import PropTypes from "prop-types";
import React from "react";

import { Box, Button } from "@material-ui/core";
import DialogModal from "../../shared/DialogModal";

import ShowResults from "./ShowResults";

const AddShowModal = (props) => {
    const {
        callAPI,
        currentSearchString,
        isVisible,
        onAddShowComplete,
        onCancel,
    } = props;

    let showResults = null;

    if (isVisible) {
        showResults = (
            <ShowResults
                callAPI={callAPI}
                currentSearchString={currentSearchString}
                onAddShowComplete={onAddShowComplete}
            />
        );
    }

    return (
        <DialogModal
            title="Add New Show"
            isVisible={isVisible}
            onClose={onCancel}
            footer={[
                <Box justify="center">
                    <Button
                        key="cancel"
                        size="small"
                        onClick={onCancel}
                        is="center"
                    >
                        Cancel
                    </Button>
                </Box>,
            ]}
            width={700}
        >
            {showResults}
        </DialogModal>
    );
};

AddShowModal.propTypes = {
    callAPI: PropTypes.func.isRequired,
    currentSearchString: PropTypes.string.isRequired,
    isVisible: PropTypes.bool.isRequired,
    onAddShowComplete: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
};

export default AddShowModal;
