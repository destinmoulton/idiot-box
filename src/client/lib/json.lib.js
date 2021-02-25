// Determine if a string is valid JSON
function isJSON(testString) {
    try {
        const testObj = JSON.parse(testString);
        if (testObj && typeof testObj === "object") {
            return true;
        }
    } catch (err) {
        // Don't throw; just let it gracefully pass to the other return
    }
    return false;
}

export { isJSON };
