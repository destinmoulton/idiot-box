/**
 * StatusTags
 *
 * Encode and decode status_tags column.
 */
export default class StatusTagsLib {
    decodeTags(tagString) {
        if (tagString === null) return [];
        return tagString.split(",");
    }

    encodeTags(tagsArr) {
        return tagsArr.join(",");
    }

    toggleTag(currentTagsStr, tagToToggle) {
        const currTags = this.decodeTags(currentTagsStr);
        const idxTag = currTags.indexOf(tagToToggle);
        let statusTags = "";
        if (idxTag > -1) {
            currTags.splice(idxTag, 1);
        } else {
            currTags.push(tagToToggle);
        }
        return this.encodeTags(currTags);
    }
}
