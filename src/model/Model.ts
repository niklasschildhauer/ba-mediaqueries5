import * as Util from "../common/utility"
/**
 * @interface IMediaDescriptor
 *
 * Represents the CSS @media descriptor with media query and body.
 */
export interface IMediaDescriptor {
    mediaQuery: IMediaQuery
    body: string;
}

/**
 * @interface IMediaQuery
 *
 * Represents a CSS media query. It divides the query into browser
 * supported and unsupported ones. The unsupported ones are
 * those which contains common term media features. A media query
 * can be negated, which means that 'not' is in front of the query.
 */
export interface IMediaQuery {
    unSupportedMediaQuery: IMediaFeature[];
    supportedMediaQuery: string | null;
    negated: boolean;

}

/**
 * @interface IMediaFeature
 *
 * Represents a CSS media feature. In this case the media feature is a
 * common term media feature, which belongs to the unsupported media query.
 * A media query consists of a media type and 0 <= media features.
 * A media feature can be negated, which means that 'not' is in front of the feature.
 */
export interface IMediaFeature {
    mediaFeature: CommonTerm;
    value: string;
    negated: boolean;
}

/**
 * @interface IUserPreference
 *
 * The user context consists of various user preferences. In this case they representing
 * a Common Term media feature and the associated value.
 */
export interface IUserPreference {
    mediaFeature: CommonTerm;
    value: string;

}

/**
 * @class CommonTermUtil
 *
 * Helper Class with static functions
 */
export class CommonTermUtil {
    /**
     * Static function to check if a query contains a common term media feature
     *
     * @param query  A string of a media query.
     * @returns A tuple with a boolean if the query contains a common term media feature
     * and the media feature if it does.
     */
    public static  containsCommonTermMediaFeature(query: string): [boolean, CommonTerm | null] {
        let result: [boolean, CommonTerm | null] = [false, null];
        for (const value of Util.enumKeys(CommonTerm)) {
            if (query.match(CommonTerm[value])) {
                let commonTerm: CommonTerm = CommonTerm[value];
                return result = [true, commonTerm]
            }
        }
        return result;
    }
}

/**
 * @class MediaQuery
 */
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

/**
 * @class MediaDescriptor
 */
export class MediaDescriptor implements IMediaDescriptor {
    mediaQuery: IMediaQuery;
    body: string;

    constructor(unSupportedMediaQuery: IMediaFeature[], supportedMediaQuery: string | null, body: string, negated: boolean) {
        this.mediaQuery = new MediaQuery(unSupportedMediaQuery, supportedMediaQuery, negated);
        this.body = body;
    }
}

/**
 * @interface ICommonTermList
 *
 * Is the implementation of the MediaList for the Common Term Media features. Like the MediaList,
 * the CommonTermList should also be able to be queried in JS in order to be able to use
 * media queries there. An EventListener can be stored to be notified when the value of the media query changes.
 */
export interface ICommonTermList {
    callbackFunction: () => any;
    mediaQuery: IMediaQuery;
    addListener(event: string, callback: () => any): void;
    matches(): boolean;
    setMatchValue(value: boolean): void;
}

/**
 * @class CommonTermList
 */
export class CommonTermList implements ICommonTermList {
    mediaQuery: IMediaQuery;
    private matchValue: boolean;
    callbackFunction: () => any = () => void 0;

    constructor(unSupportedMediaQuery: IMediaFeature[], supportedMediaQuery: string | null, negated: boolean) {
        this.mediaQuery = new MediaQuery(unSupportedMediaQuery, supportedMediaQuery, negated);
        this.matchValue = false
    }

    /**
     * Adds a Event Listener, which should be called, when the value changes
     *
     * @param event   For example "change"
     * @param callback   The function which should be executet.
     */
    addListener(event: string, callback: () => any): void {
        this.callbackFunction = callback;
    }

    /**
     * @returns True if the media query does match
     */
    matches():boolean {
        return this.matchValue;
    }

    /**
     * @param value   Sets the match value.
     */
    setMatchValue(value: boolean): void {
        this.matchValue = value;
    }

}

/**
 * @class MediaFeature
 */
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

/**
 * @class UserPreference
 */
export class UserPreference implements IUserPreference {
    mediaFeature: CommonTerm;
    value: string;

    constructor(mediaFeature: CommonTerm, value: string) {
        this.mediaFeature = mediaFeature;
        this.value = value;
    }

}

/**
 * @enum CommonTerm
 *
 * Contains all new media features from the common terms.
 */
export enum CommonTerm {
    displaySkiplinks = "display-skiplinks",
    audioDescriptionEnabled = "audio-description-enabled",
    captionsEnabled = "captions-enabled",
    pictogramsEnabled = "pictograms-enabled",
    selfVoicingEnabled = "self-voicing-enabled",
    tableOfContents = "table-of-contents",
    extendedSessionTimeout = "extended-session-timeout",
    signLanguageEnabled = "sign-language-enabled",
    signLanguage = "sign-language",
    sessionTimeout = "session-timeout"
}

/**
 * @enum Persona
 *
 * Contains all Personas from the 'A day in the life of …' descriptions
 * [MOOCAP](https://moocap.gpii.eu/?page_id=33).
 */
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

/**
 * @enum SkipLinkValues
 *
 * The common term media feature 'dispaly-skiplinks' has three values to choose from.
 */
export enum SkipLinkValues {
    onfocus = "onfocus",
    always = "always",
    never = "never"
}

/**
 * @enum TableOfContentsValues
 *
 * The common term media feature 'table-of-contents' has three values to choose from.
 */
export enum TableOfContentsValue {
    noPreferences = "no-preferences",
    show = "show",
    hide = "hide"
}
