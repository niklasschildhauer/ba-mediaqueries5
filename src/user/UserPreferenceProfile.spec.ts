import * as Model from "../model/Model";
import {CommonTerm, MediaFeature, MediaQuery, Persona} from "../model/Model";
import {IUserPreferenceProfile, UserPreferenceProfile, UserProfileDelegate} from "./UserPreferenceProfile";
import {NetworkAPI, NetworkAPIDelegate} from "../network/NetworkAPI";


test('User Preference Profile - doesMediaFeatureMatch #1', () => {
    // @ts-ignore
    let delegate: UserProfileDelegate = null;
    // @ts-ignore
    let delegate: NetworkAPIDelegate = null;
    let network = new NetworkAPI(delegate);
    let profile = new UserPreferenceProfile(delegate, network);

    let mediaFeature = new MediaFeature(CommonTerm.tableOfContents, false, "false");
    expect(profile.doesMediaFeatureMatch(mediaFeature)).toBe(true);
});

test('User Preference Profile - doesMediaFeatureMatch #2', () => {
    // @ts-ignore
    let delegate: UserProfileDelegate = null;
    // @ts-ignore
    let delegate: NetworkAPIDelegate = null;
    let network = new NetworkAPI(delegate);
    let profile = new UserPreferenceProfile(delegate, network);

    let mediaFeature = new MediaFeature(CommonTerm.tableOfContents, true, "true");
    expect(profile.doesMediaFeatureMatch(mediaFeature)).toBe(true);
});

test('User Preference Profile - doesMediaFeatureMatch #3', () => {
    // @ts-ignore
    let delegate: UserProfileDelegate = null;
    // @ts-ignore
    let delegate: NetworkAPIDelegate = null;
    let network = new NetworkAPI(delegate);
    let profile = new UserPreferenceProfile(delegate, network);

    let mediaFeature = new MediaFeature(CommonTerm.tableOfContents, true, "false");
    expect(profile.doesMediaFeatureMatch(mediaFeature)).toBe(false);
});

test('User Preference Profile - doesMediaQueryMatch #1', () => {
    // @ts-ignore
    let delegate: UserProfileDelegate = null;
    // @ts-ignore
    let delegate: NetworkAPIDelegate = null;
    let network = new NetworkAPI(delegate);
    let profile = new UserPreferenceProfile(delegate, network);

    let mediaFeatures = [new MediaFeature(CommonTerm.tableOfContents, false, "false"),
                        new MediaFeature(CommonTerm.signLanguage, true, "gsd"),
                        new MediaFeature(CommonTerm.extendedSessionTimeout, true, "true")]

    let mediaQuery = new MediaQuery(mediaFeatures, "", false);

    expect(profile.doesMediaQueryMatch(mediaQuery)).toBe(true);
});

test('User Preference Profile - doesMediaQueryMatch #2', () => {
    // @ts-ignore
    let delegate: UserProfileDelegate = null;
    // @ts-ignore
    let delegate: NetworkAPIDelegate = null;
    let network = new NetworkAPI(delegate);
    let profile = new UserPreferenceProfile(delegate, network);

    let mediaFeatures = [new MediaFeature(CommonTerm.tableOfContents, false, "false"),
        new MediaFeature(CommonTerm.signLanguage, true, "gsd"),
        new MediaFeature(CommonTerm.extendedSessionTimeout, true, "true")]

    let mediaQuery = new MediaQuery(mediaFeatures, "", true);

    expect(profile.doesMediaQueryMatch(mediaQuery)).toBe(false);
});

test('User Preference Profile - setUserPreferences #1', () => {
    class DelegateClass implements  UserProfileDelegate {
        didUpdateProfile(): void {
            console.log("did update")
        }

        recievedLoginErrorMessage(message: string, from: IUserPreferenceProfile): void {
        }
    }
    // @ts-ignore
    let delegate: NetworkAPIDelegate = null;
    let network = new NetworkAPI(delegate);
    let profile = new UserPreferenceProfile(new DelegateClass(), network);

    let userPreferences = [new Model.UserPreference(CommonTerm.audioDescriptionEnabled, "false"),
        new Model.UserPreference(CommonTerm.captionsEnabled, "false"),
        new Model.UserPreference(CommonTerm.displaySkiplinks, "never"),
        new Model.UserPreference(CommonTerm.extendedSessionTimeout, "false"),
        new Model.UserPreference(CommonTerm.pictogramsEnabled, "false"),
        new Model.UserPreference(CommonTerm.selfVoicingEnabled, "true"),
        new Model.UserPreference(CommonTerm.sessionTimeout, "1"),
        new Model.UserPreference(CommonTerm.signLanguage, ""),
        new Model.UserPreference(CommonTerm.signLanguageEnabled, "false"),
        new Model.UserPreference(CommonTerm.tableOfContents, "false")
    ];

    profile.didSelectPersona(Persona.alexander);

    expect(profile.getUserPreferences()).toStrictEqual(userPreferences);
});