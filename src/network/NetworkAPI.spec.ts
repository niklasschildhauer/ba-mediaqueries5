import {CommonTerm, Persona, UserPreference} from "../model/Model";
import {NetworkAPI, NetworkAPIDelegate} from "./NetworkAPI";


test('Network API - loadPreferenceSetFromPersona #1', (done) => {
    class DelegateClass implements  NetworkAPIDelegate {
    }
    let network = new NetworkAPI(new DelegateClass());

    let test = network.loadPreferenceSetFromPersona(Persona.alexander)
    test.then((result) => {
        expect(result.userPreferences[0]).toStrictEqual(new UserPreference(CommonTerm.selfVoicingEnabled, "false"));
        done();
    })
});

test('Network API - loadPreferenceSetFromPersona #2', (done) => {
    class DelegateClass implements  NetworkAPIDelegate {
    }
    let network = new NetworkAPI(new DelegateClass());

    let test = network.loadPreferenceSetFromPersona(Persona.anna)
    test.then((result) => {
        expect(result.userPreferences[0]).toStrictEqual(new UserPreference(CommonTerm.selfVoicingEnabled, "false"));
        done();
    });
});

test('Network API - loadPreferenceSetFromPersona #3', (done) => {
    class DelegateClass implements  NetworkAPIDelegate {
    }
    let network = new NetworkAPI(new DelegateClass());

    let test = network.loadPreferenceSetFromPersona(Persona.mary)
    test.then((result) => {
        expect(result.userPreferences[0]).toStrictEqual(new UserPreference(CommonTerm.signLanguage, "true"));
        done();
    });
});


test('Network API - OpenAPEConnection #1', () => {
    class DelegateClass implements  NetworkAPIDelegate {
    }
    let network = new NetworkAPI(new DelegateClass());

    network.loadUserContext("niklas", "IlPmK#97bJ#fy")
    expect(false).toBe(true);
});

test('Network API - OpenAPEConnection #2', (done) => {
    class DelegateClass implements  NetworkAPIDelegate {
    }
    let network = new NetworkAPI(new DelegateClass());

    let test = network.loadUserContext("niklas", "IlPmK#97bJ#fy")

    test.then((result) => {
        expect(result.success).toBe(true);
        done();
    });
});