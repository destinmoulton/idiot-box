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
}
