import React from "react";

import ALPHABET from "../../lib/alphabet.lib";

const LetterBar = ({ selectedLetter, onClick }) => {
    let localLetters = ["All", ...ALPHABET];
    let letters = [];
    for (let letter of localLetters) {
        const active = letter === selectedLetter ? " active-letter" : "";
        letters.push(
            <div
                key={letter}
                className={"letter " + active}
                onClick={() => onClick(letter)}
            >
                {letter}
            </div>
        );
    }
    return letters;
};

export default LetterBar;
