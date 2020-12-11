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

export interface ICommonTermList {
    callbackFunction: () => any;
    mediaQuery: IMediaQuery;
    addListener(event: string, callback: () => any): void;
    matches(): boolean;
    setMatchValue(value: boolean): void;
}

export class CommonTermList implements ICommonTermList {
    mediaQuery: IMediaQuery;
    matchValue: boolean;
    callbackFunction: () => any = () => void 0;

    addListener(event: string, callback: () => any): void {
        this.callbackFunction = callback;
    }

    matches():boolean {
        return this.matchValue;
    }

    constructor(unSupportedMediaQuery: IMediaFeature[], supportedMediaQuery: string | null, negated: boolean) {
        this.mediaQuery = new MediaQuery(unSupportedMediaQuery, supportedMediaQuery, negated);
        this.matchValue = false
    }

    setMatchValue(value: boolean): void {
        this.matchValue = value;
    }

}

export interface IVideoElement {

}

export class VideoElement implements IVideoElement {

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

export enum Persona {
    alexander = "Alexander",
    anna = "Anna",
    carole = "Carole",
    lars = "Lars",
    maria = "Maria",
    mary = "Mary",
    monika = "Monika",
    susan = "Susan",
    tom = "Tom"
}

export enum SkipLinkValues {
    onfocus = "onfocus",
    always = "always",
    never = "never"
}
