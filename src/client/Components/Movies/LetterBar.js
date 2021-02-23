import React from "react";

import ALPHABET from "../../lib/alphabet.lib";

const LetterBar = ({ selectedLetter }) => {
    let localLetters = ["All", ...ALPHABET];
    let letters = [];
    for (let letter of localLetters) {
        const active = letter === selectedLetter ? " active-letter" : "";
        letters.push(<div className={"letter " + active}>{letter}</div>);
    }
    return letters;
};

export default LetterBar;
