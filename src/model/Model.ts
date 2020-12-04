import * as common from '../common/utility'

export interface IMediaDescriptor {
    unsupportedMediaQuery: IMediaFeature[]
    supportedMediaQuery: string | null
    negated: boolean
    body: string
}

export interface IMediaFeature {
    mediaFeature: CommonTerm
    value: string
    negated: boolean
}


export interface ISourceTag {

}

export interface IUserPreference {
    mediaFeature: CommonTerm
    value: string

}

export enum CommonTerm {
    displaySkiplinks = "displaySkiplinks",
    audioDescriptionEnabled = "audioDescriptionEnabled",
    captionsEnabled = "captionsEnabled",
    pictogramsEnabled = "pictogramsEnabled",
    selfVoicingEnabled = "selfVoicingEnabled",
    tableOfContents = "tableOfContents",
    extendedSessionTimeout = "extendedSessionTimeout",
    signLanguageEnabled = "signLanguageEnabled",
    signLanguage = "signLanguage",
    sessionTimeout = "sessionTimeout"
}

export class CommonTermUtil {
    public static  containsCommonTermMediaFeature(query: string): [boolean, CommonTerm | null] {
        let result: [boolean, CommonTerm | null] = [false, null];
        Object.keys(CommonTerm).forEach((key) => {
            if (query.match(key)) {
                let commonTerm: CommonTerm = key as CommonTerm;
                result = [true, commonTerm]
            }
        });
        return result;
    }
}

export class MediaDescriptor implements IMediaDescriptor {
    body: string;
    negated: boolean;
    supportedMediaQuery: string | null;
    unsupportedMediaQuery: IMediaFeature[];

    constructor(unsupportedMediaQuery: IMediaFeature[], supportedMediaQuery: string | null, body: string, negated: boolean) {
        this.body = body;
        this.negated = negated;
        this.supportedMediaQuery = supportedMediaQuery;
        this.unsupportedMediaQuery = unsupportedMediaQuery;
    }
}



export class MediaFeature implements IMediaFeature {
    mediaFeature: CommonTerm;
    negated: boolean;
    value: string;

    constructor(mediaFeature: CommonTerm, negated: boolean, value: string) {
        this.mediaFeature = mediaFeature;
        this.negated = negated;
        this. value = value;
    }
}


