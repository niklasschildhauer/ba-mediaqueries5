import * as Model from "../model/Model";
import {CommonTerm, MediaFeature, MediaQuery, Persona} from "../model/Model";
import {IUserPreferenceProfile, UserPreferenceProfile, UserPreferenceProfileDelegate} from "./UserPreferenceProfile";
import {NetworkAPI} from "../network/NetworkAPI";


test('User Preference Profile - doesMediaFeatureMatch #1', () => {
    // @ts-ignore
    let delegate: UserPreferenceProfileDelegate = null;
    let network = new NetworkAPI();
    let profile = new UserPreferenceProfile(delegate, network);

    let mediaFeature = new MediaFeature(CommonTerm.tableOfContents, false, "false");
    expect(profile.doesMediaFeatureMatch(mediaFeature)).toBe(false);
});

test('User Preference Profile - doesMediaFeatureMatch #2', () => {
    // @ts-ignore
    let delegate: UserPreferenceProfileDelegate = null;
    let network = new NetworkAPI();
    let profile = new UserPreferenceProfile(delegate, network);

    let mediaFeature = new MediaFeature(CommonTerm.tableOfContents, true, "false");
    expect(profile.doesMediaFeatureMatch(mediaFeature)).toBe(true);
});

test('User Preference Profile - doesMediaFeatureMatch #3', () => {
    class Delegateclass implements  UserPreferenceProfileDelegate {
        didSelectPersona(persona: Persona, from: IUserPreferenceProfile): void {
        }

        didUpdateProfile(from: IUserPreferenceProfile): void {
        }

        recievedLoginErrorMessage(message: string, from: IUserPreferenceProfile): void {
        }

    }
    let network = new NetworkAPI();
    let profile = new UserPreferenceProfile(new Delegateclass(), network);
    profile.setUserPreferences([new MediaFeature(CommonTerm.tableOfContents, false, "false")]);

    let mediaFeature = new MediaFeature(CommonTerm.tableOfContents, true, "true");
    expect(profile.doesMediaFeatureMatch(mediaFeature)).toBe(true);
});

test('User Preference Profile - doesMediaQueryMatch #1', () => {
    // @ts-ignore
    let delegate: UserPreferenceProfileDelegate = null;
    let network = new NetworkAPI();
    let profile = new UserPreferenceProfile(delegate, network);

    let mediaFeatures = [new MediaFeature(CommonTerm.tableOfContents, false, "no-preferences"),
                        new MediaFeature(CommonTerm.signLanguage, true, "gsd"),
                        new MediaFeature(CommonTerm.extendedSessionTimeout, false, "false")]

    let mediaQuery = new MediaQuery(mediaFeatures, "", false);

    expect(profile.doesMediaQueryMatch(mediaQuery)).toBe(true);
});

test('User Preference Profile - doesMediaQueryMatch #2', () => {
    // @ts-ignore
    let delegate: UserPreferenceProfileDelegate = null;
    let network = new NetworkAPI();
    let profile = new UserPreferenceProfile(delegate, network);

    let mediaFeatures = [new MediaFeature(CommonTerm.tableOfContents, false, "false"),
        new MediaFeature(CommonTerm.signLanguage, true, "gsd"),
        new MediaFeature(CommonTerm.extendedSessionTimeout, true, "true")]

    let mediaQuery = new MediaQuery(mediaFeatures, "", true);

    expect(profile.doesMediaQueryMatch(mediaQuery)).toBe(false);
});

