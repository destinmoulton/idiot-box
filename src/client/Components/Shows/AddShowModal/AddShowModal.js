import PropTypes from "prop-types";
import React from "react";

import { Button, Col, Input, Modal, Select } from "antd";

import ShowResults from "./ShowResults";

const AddShowModal = props => {
    const {
        callAPI,
        currentSearchString,
        isVisible,
        onAddShowComplete,
        onCancel
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
        <Modal
            title="Add New Show"
            visible={isVisible}
            onCancel={onCancel}
            footer={[
                <Button key="cancel" size="large" onClick={onCancel}>
                    Cancel
                </Button>
            ]}
            width={700}
        >
            {showResults}
        </Modal>
    );
};

AddShowModal.propTypes = {
    callAPI: PropTypes.func.isRequired,
    currentSearchString: PropTypes.string.isRequired,
    isVisible: PropTypes.bool.isRequired,
    onAddShowComplete: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired
};

export default AddShowModal;
