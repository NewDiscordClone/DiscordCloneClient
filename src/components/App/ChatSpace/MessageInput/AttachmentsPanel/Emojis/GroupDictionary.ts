export interface Group {
    emoji: string,
    skin_tone_support: boolean,
    name: string,
    slug: string,
    unicode_version: string,
    emoji_version: string
}

type GroupDictionary = {[groupName: string]: Group[]}

export default GroupDictionary;