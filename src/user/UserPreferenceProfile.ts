import * as Model from "../model/Model";
import {CommonTerm, IUserPreference, Persona, UserPreference} from "../model/Model";
import {INetworkAPI} from "../network/NetworkAPI";

export interface IUserPreferenceProfile {
    doesMediaFeatureMatch(mediaFeature: Model.IMediaFeature): boolean;
    doesMediaQueryMatch(mediaQuery: Model.IMediaQuery): boolean;
    getValueForMediaFeature(mediaFeature: Model.CommonTerm): string;
    getUserPreferences(): Model.IUserPreference[];
    selectPersona(persona: Model.Persona): void;
    setUserPreferences(preferences: IUserPreference[]): void;
    setUserPreference(preference: IUserPreference): void; // nicht im Schaubild!!
    login(username: string, password: string): void;
}

export interface  UserPreferenceProfileDelegate {
    didUpdateProfile(from: IUserPreferenceProfile): void;
    didSelectPersona(persona: Persona, from: IUserPreferenceProfile): void;
    recievedLoginErrorMessage(message: string, from: IUserPreferenceProfile): void;
}

export class UserPreferenceProfile implements IUserPreferenceProfile {
    private userPreferences: Model.IUserPreference[];
    private network: INetworkAPI
    private delegate: UserPreferenceProfileDelegate;

    constructor(delegate: UserPreferenceProfileDelegate, network: INetworkAPI) {
        this.userPreferences = [];
        this.setDefaultValues();
        this.delegate = delegate;
        this.network = network;
    }

    private refresh() {
        this.delegate.didUpdateProfile(this);
        console.log(this.userPreferences);
    }

    private setDefaultValues() {
        this.userPreferences = defaultPreferences.slice();
        console.log("_-----------")
        console.log(defaultPreferences);
        console.log("_-----------")

    }

    login(username: string, password: string): void {
        this.network.loadUserContext(username, password)
            .then((result) => {
                if(result.success) {
                    this.setUserPreferences(result.userPreferences)
                }
                if(!result.success && result.errorMessage != null) {
                    this.delegate.recievedLoginErrorMessage(result.errorMessage, this)
                }
                return result
            })
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

    getUserPreferences(): Model.IUserPreference[] {
        return this.userPreferences;
    }

    private changeUserPreference(preference: IUserPreference): void {
        for (let i = 0; i < this.userPreferences.length; i++) {
            if(this.userPreferences[i].mediaFeature == preference.mediaFeature) {
                this.userPreferences[i] = preference
                if(preference.mediaFeature == CommonTerm.sessionTimeout) {
                    (parseFloat(preference.value) > 1) ?
                    this.changeUserPreference(new UserPreference(CommonTerm.extendedSessionTimeout, "true"))
                        :
                    this.changeUserPreference(new UserPreference(CommonTerm.extendedSessionTimeout, "false"));
                }
                return
            }
        }
    }

    setUserPreferences(preferences: IUserPreference[]): void {
        this.setDefaultValues();
        for (let i = 0; i < preferences.length; i++) {
            this.changeUserPreference(preferences[i]);
        }
        this.refresh();
    }

    setUserPreference(preference: IUserPreference): void {
        this.changeUserPreference(preference);
        this.refresh();
    }


    selectPersona(persona: Model.Persona): void {
        this.network.loadPreferenceSetFromPersona(persona)
            .then((result) => {
                if(result.success) {
                    this.setUserPreferences(result.userPreferences)
                    this.delegate.didSelectPersona(persona, this);
                }
                return result
            })
    }
}

const defaultPreferences = [new Model.UserPreference(CommonTerm.audioDescriptionEnabled, "false"),
    new Model.UserPreference(CommonTerm.captionsEnabled, "false"),
    new Model.UserPreference(CommonTerm.displaySkiplinks, "never"),
    new Model.UserPreference(CommonTerm.extendedSessionTimeout, "false"),
    new Model.UserPreference(CommonTerm.pictogramsEnabled, "false"),
    new Model.UserPreference(CommonTerm.selfVoicingEnabled, "false"),
    new Model.UserPreference(CommonTerm.sessionTimeout, "1"),
    new Model.UserPreference(CommonTerm.signLanguage, ""),
    new Model.UserPreference(CommonTerm.signLanguageEnabled, "false"),
    new Model.UserPreference(CommonTerm.tableOfContents, "true")
];