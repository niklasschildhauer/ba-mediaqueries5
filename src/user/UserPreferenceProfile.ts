import * as Model from "../model/Model";
import {CommonTerm, IMediaFeature, IMediaQuery, IUserPreference} from "../model/Model";

export interface IUserPreferenceProfile {
    doesMediaFeatureMatch(mediaFeature: Model.IMediaFeature): boolean;
    doesMediaQueryMatch(mediaQuery: Model.IMediaQuery): boolean;
    getValueForMediaFeature(mediaFeature: Model.CommonTerm): string;
    getUserPreferences(): Model.UserPreference[];
}

export interface  UserProfileDelegate {
    didUpdateProfile(): void;
}

export class UserPreferenceProfile implements IUserPreferenceProfile {
    private userPreferences: Model.IUserPreference[];
    delegate: UserProfileDelegate;

    constructor(delegate: UserProfileDelegate) {
        this.userPreferences = [];
        this.setDefaultValues();
        this.delegate = delegate;
    }

    private setDefaultValues() {
        this.userPreferences = defaultPreferences;
    }

    doesMediaFeatureMatch(mediaFeature: Model.IMediaFeature): boolean {
        for (let k = 0; k < this.userPreferences.length; k++) {
            let preference = this.userPreferences[k];
            if (mediaFeature.mediaFeature === preference.mediaFeature) {
                if (mediaFeature.value !== preference.value && !mediaFeature.negated ||
                    mediaFeature.value === preference.value && mediaFeature.negated) {
                    return false;
                }
            }
        }
        return true;
    }

    doesMediaQueryMatch(mediaQuery: Model.IMediaQuery): boolean {
        for (var i = 0; i < mediaQuery.unSupportedMediaQuery.length; i++) {
            let mediaFeature = mediaQuery.unSupportedMediaQuery[i];
            let matchValue = this.doesMediaFeatureMatch(mediaFeature)
            if (mediaQuery.negated && matchValue ||
                !matchValue && !mediaQuery.negated) {
                return false
            }
        }
        return true
    }

    getValueForMediaFeature(mediaFeature: Model.CommonTerm): string {
        for (let i = 0; i < this.userPreferences.length; i++) {
            if(this.userPreferences[i].mediaFeature == mediaFeature) {
                return this.userPreferences[i].value;
            }
        }
        // else return the default value
        for (let i = 0; i < defaultPreferences.length; i++) {
            if(defaultPreferences[i].mediaFeature == mediaFeature) {
                return this.userPreferences[i].value;
            }
        }
        return "";
    }

    getUserPreferences(): Model.UserPreference[] {
        return this.userPreferences;
    }
}

let defaultPreferences = [new Model.UserPreference(CommonTerm.audioDescriptionEnabled, "false"),
    new Model.UserPreference(CommonTerm.captionsEnabled, "false"),
    new Model.UserPreference(CommonTerm.displaySkiplinks, "never"),
    new Model.UserPreference(CommonTerm.extendedSessionTimeout, "true"),
    new Model.UserPreference(CommonTerm.pictogramsEnabled, "true"),
    new Model.UserPreference(CommonTerm.selfVoicingEnabled, "false"),
    new Model.UserPreference(CommonTerm.sessionTimeout, "1"),
    new Model.UserPreference(CommonTerm.signLanguage, "gsdh"),
    new Model.UserPreference(CommonTerm.signLanguageEnabled, "false"),
    new Model.UserPreference(CommonTerm.tableOfContents, "false")
];