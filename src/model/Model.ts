import * as common from '../common/utility'

export interface IMediaDescriptor {
    mediaQuery: IMediaQuery
    body: string;
}

export interface IMediaQuery {
    unSupportedMediaQuery: IMediaFeature[];
    supportedMediaQuery: string | null;
    negated: boolean;

}

export interface IMediaFeature {
    mediaFeature: CommonTerm;
    value: string;
    negated: boolean;
}


export interface ISourceTag {

}

export interface IUserPreference {
    mediaFeature: CommonTerm;
    value: string;

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

export class MediaQuery implements IMediaQuery {
    negated: boolean;
    unSupportedMediaQuery: IMediaFeature[];
    supportedMediaQuery: string | null;


    constructor(unSupportedMediaQuery: IMediaFeature[], supportedMediaQuery: string | null, negated: boolean) {
        this.negated = negated;
        this.supportedMediaQuery = supportedMediaQuery;
        this.unSupportedMediaQuery = unSupportedMediaQuery;
    }

}

export class MediaDescriptor implements IMediaDescriptor {
    mediaQuery: IMediaQuery;
    body: string;

    constructor(unSupportedMediaQuery: IMediaFeature[], supportedMediaQuery: string | null, body: string, negated: boolean) {
        this.mediaQuery = new MediaQuery(unSupportedMediaQuery, supportedMediaQuery, negated);
        this.body = body;
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

export class UserPreference implements IUserPreference {
    mediaFeature: CommonTerm;
    value: string;

    constructor(mediaFeature: CommonTerm, value: string) {
        this.mediaFeature = mediaFeature;
        this.value = value;
    }

}


