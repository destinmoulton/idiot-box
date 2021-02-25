import React from "react";

const LinkTypeSelector = ({ options, selectedValue, onChange }) => {
    let selectOptions = [];
    for (let item of options) {
        selectOptions.push(
            <option key={item.id} value={item.id}>
                {item.name}
            </option>
        );
    }

    return (
        <select onChange={onChange} defaultValue={selectedValue}>
            {selectOptions}
        </select>
    );
};

export default LinkTypeSelector;
