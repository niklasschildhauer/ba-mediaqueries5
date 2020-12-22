import {CommonTerm, Persona, UserPreference} from "../model/Model";
import {NetworkAPI} from "./NetworkAPI";


test('Network API - loadPreferenceSetFromPersona #1', (done) => {
    let network = new NetworkAPI();

    let test = network.loadPreferenceSetFromPersona(Persona.anna)
    test.then((result) => {
        expect(result.userPreferences[0]).toStrictEqual(new UserPreference(CommonTerm.pictogramsEnabled, "true"));
        done();
    })
});

test('Network API - loadPreferenceSetFromPersona #2', (done) => {
    let network = new NetworkAPI();

    let test = network.loadPreferenceSetFromPersona(Persona.carole)
    test.then((result) => {
        expect(result.userPreferences[0]).toStrictEqual(new UserPreference(CommonTerm.audioDescriptionEnabled, "true"));
        done();
    });
});

test('Network API - loadPreferenceSetFromPersona #3', (done) => {
    let network = new NetworkAPI();

    let test = network.loadPreferenceSetFromPersona(Persona.mary)
    test.then((result) => {
        expect(result.userPreferences[0]).toStrictEqual(new UserPreference(CommonTerm.displaySkiplinks, "always"));
        done();
    });
});

