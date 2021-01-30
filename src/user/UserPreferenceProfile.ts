import * as Model from "../model/Model";
import {CommonTerm, IUserPreference, Persona, UserPreference} from "../model/Model";
import {INetworkAPI} from "../network/NetworkAPI";

/**
 * @interface IUserPreferenceProfile
 *
 * Defines the Profile class. It contains methods to check if the user preferences matches
 * and sets the current user preferences.
 */
export interface IUserPreferenceProfile {
    doesMediaFeatureMatch(mediaFeature: Model.IMediaFeature): boolean;
    doesMediaQueryMatch(mediaQuery: Model.IMediaQuery): boolean;
    getValueForMediaFeature(mediaFeature: Model.CommonTerm): string;
    getUserPreferences(): Model.IUserPreference[];
    selectPersona(persona: Model.Persona): void;
    setUserPreferences(preferences: IUserPreference[]): void;
    setUserPreference(preference: IUserPreference): void;
    login(username: string, password: string): void;
}

/**
 * @interface UserPreferenceProfileDelegate
 *
 * Defines the delegate methods which will be called from the profile to inform the
 * {@linkcode ScriptCoordinator} that something has changed.
 */
export interface  UserPreferenceProfileDelegate {
    didUpdateProfile(from: IUserPreferenceProfile): void;
    didSelectPersona(persona: Persona, from: IUserPreferenceProfile): void;
    recievedLoginErrorMessage(message: string, from: IUserPreferenceProfile): void;
}

/**
 * @class UserPreferenceProfile
 *
 * Implements the IUserPreferenceProfile interface.
 * The UserProfile is the only class in the program which uses the network API.
 * This is where user preferences are managed.
 */
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

    /**
     * Calls the delegate to inform the coordinator, that the profile has updated.
     */
    private refresh() {
        this.delegate.didUpdateProfile(this);
    }

    /**
     * Sets the default user preferences.
     */
    private setDefaultValues() {
        this.userPreferences = defaultPreferences.slice();
    }

    /**
     * Logs in a user into the OpenAPE server and queries their user preferences.
     * If the login is successful, the new user preferences are set. Otherwise,
     * the delegate will inform that an error has occurred.
     *
     * @param username: string   (openAPE username)
     * @param passwort: string   (openAPE password)
     */
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

    /**
     * Checks if a media feature does match the user preferences.
     *
     * @param mediaFeature: IMediaFeature  (common term media feature)
     * @returns boolean (true if a media feature matches the user preferences)
     */
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

    /**
     * Checks if a media query does match the user preferences.
     * For this purpose the {@linkcode doesMediaFeatureMatch} method is called several times.
     *
     * @param mediaFeature: IMediaQuery  (a common term media query)
     * @returns boolean (True if the media feature matches the user preferences)
     */
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

    /**
     * @param mediaFeature: CommonTerm
     * @returns The user preference value of a certain media feature (string).
     */
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

    /**
     * @returns All user preferences (IUserPreference[])
     */
    getUserPreferences(): Model.IUserPreference[] {
        return this.userPreferences;
    }

    /**
     * Changes the profile with a new user preference.
     * If the new user preference is of the type 'sessionTimeout' and the value is > 1,
     * the extendedSessionTimeout is set to true
     *
     * @param preference: IUserPreference  (the new UserPreference)
     */
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

    /**
     * Resets the profile and sets new user preferences.
     * At first the default values are set, then the new preferences are set
     * and at least the refresh method is called
     *
     * @param preferences: IUserPreference[]  (the new user preferences)
     */
    setUserPreferences(preferences: IUserPreference[]): void {
        this.setDefaultValues();
        for (let i = 0; i < preferences.length; i++) {
            this.changeUserPreference(preferences[i]);
        }
        this.refresh();
    }

    /**
     * Changes the profile with one new user preference.
     * First the new preference is set and then the refresh method is called
     *
     * @param preference: IUserPreference   (the new user preference)
     */
    setUserPreference(preference: IUserPreference): void {
        this.changeUserPreference(preference);
        this.refresh();
    }


    /**
     * Loads the user preferences from the selected persona.
     * After the pereferences are set the delegate informs that an Persona is selected.
     *
     * @param persona: Persona
     */
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
    new Model.UserPreference(CommonTerm.tableOfContents, "no-preferences")
];