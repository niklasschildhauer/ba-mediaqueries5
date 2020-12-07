import {CommonTerm, Persona, UserPreference} from "../model/Model";
import {NetworkAPI, NetworkAPIDelegate} from "./NetworkAPI";


test('Network API - loadPreferenceSetFromPersona #1', () => {
    class DelegateClass implements  NetworkAPIDelegate {
    }
    let network = new NetworkAPI(new DelegateClass());

    let test = network.loadPreferenceSetFromPersona(Persona.alexander)
    expect(test[0]).toStrictEqual(new UserPreference(CommonTerm.selfVoicingEnabled, "true"));
});

test('Network API - loadPreferenceSetFromPersona #2', () => {
    class DelegateClass implements  NetworkAPIDelegate {
    }
    let network = new NetworkAPI(new DelegateClass());

    let test = network.loadPreferenceSetFromPersona(Persona.anna)
    expect(test[0]).toStrictEqual(new UserPreference(CommonTerm.selfVoicingEnabled, "false"));
});