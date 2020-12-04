import {CommonTerm, MediaFeature, MediaQuery} from "../model/Model";
import {UserPreferenceProfile, UserProfileDelegate} from "./UserPreferenceProfile";


test('User Preference Profile - doesMediaFeatureMatch #1', () => {
    // @ts-ignore
    let delegate: UserProfileDelegate = null;
    let profile = new UserPreferenceProfile(delegate);

    let mediaFeature = new MediaFeature(CommonTerm.tableOfContents, false, "false");
    expect(profile.doesMediaFeatureMatch(mediaFeature)).toBe(true);
});

test('User Preference Profile - doesMediaFeatureMatch #2', () => {
    // @ts-ignore
    let delegate: UserProfileDelegate = null;
    let profile = new UserPreferenceProfile(delegate);

    let mediaFeature = new MediaFeature(CommonTerm.tableOfContents, true, "true");
    expect(profile.doesMediaFeatureMatch(mediaFeature)).toBe(true);
});

test('User Preference Profile - doesMediaFeatureMatch #3', () => {
    // @ts-ignore
    let delegate: UserProfileDelegate = null;
    let profile = new UserPreferenceProfile(delegate);

    let mediaFeature = new MediaFeature(CommonTerm.tableOfContents, true, "false");
    expect(profile.doesMediaFeatureMatch(mediaFeature)).toBe(false);
});

test('User Preference Profile - doesMediaQueryMatch #1', () => {
    // @ts-ignore
    let delegate: UserProfileDelegate = null;
    let profile = new UserPreferenceProfile(delegate);

    let mediaFeatures = [new MediaFeature(CommonTerm.tableOfContents, false, "false"),
                        new MediaFeature(CommonTerm.signLanguage, true, "gsd"),
                        new MediaFeature(CommonTerm.extendedSessionTimeout, true, "true")]

    let mediaQuery = new MediaQuery(mediaFeatures, "", false);

    expect(profile.doesMediaQueryMatch(mediaQuery)).toBe(true);
});

test('User Preference Profile - doesMediaQueryMatch #2', () => {
    // @ts-ignore
    let delegate: UserProfileDelegate = null;
    let profile = new UserPreferenceProfile(delegate);

    let mediaFeatures = [new MediaFeature(CommonTerm.tableOfContents, false, "false"),
        new MediaFeature(CommonTerm.signLanguage, true, "gsd"),
        new MediaFeature(CommonTerm.extendedSessionTimeout, true, "true")]

    let mediaQuery = new MediaQuery(mediaFeatures, "", true);

    expect(profile.doesMediaQueryMatch(mediaQuery)).toBe(false);
});