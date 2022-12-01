/**
 * StatusTags
 *
 * Encode and decode status_tags column.
 */
import VisibilityIcon from "@mui/icons-material/Visibility";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import StarIcon from "@mui/icons-material/Star";
export class StatusTagsLib {
    decodeTags(tagString) {
        if (tagString == null) return [];
        return tagString.split(",");
    }

    encodeTags(tagsArr) {
        return tagsArr.join(",");
    }

    isTagEnabled(tagStr, tagToCheck) {
        const currTags = this.decodeTags(tagStr);

        return currTags.indexOf(tagToCheck) > -1 ? true : false;
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

export const STATUS_TAGS = [
    {
        title: "Watch List",
        tag: "towatch",
        icons: {
            active: <VisibilityIcon />,
            inactive: <VisibilityIcon />,
        },
    },
    {
        title: "Favorite",
        tag: "favorite",
        icons: {
            active: <StarIcon />,
            inactive: <StarBorderIcon />,
        },
    },
];
