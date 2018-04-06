/**
 * StatusTags
 *
 * Encode and decode status_tags column.
 */
export default class StatusTagsLib {
    decodeTags(tagString) {
        return tagString.split(",");
    }

    encodeTags(tagsArr) {
        return tagsArr.join(",");
    }

    toggleTag(currentTagsStr, tagToToggle) {
        const currTags = this.decodeTags(currentTagsStr);

        const idxTag = currTags.indexOf(tagToToggle);
        if (idxTag > -1) {
            return this.encodeTags(currTags.splice(idxTag, 1));
        } else {
            return this.encodeTags(currTags.push(tagToToggle));
        }
    }
}
