import {Persona, UserPreference} from "../model/Model";

export interface INetworkAPI {
    loadPreferenceSetFromPersona(persona: Persona): void;

}

export interface NetworkAPIDelegate {
    didLoadPreferenceSet(preferences: UserPreference[], from: INetworkAPI): void;
}

export class NetworkAPI implements  INetworkAPI {
    private delegate: NetworkAPIDelegate

    constructor(delegate: NetworkAPIDelegate) {
        this.delegate = delegate;
    }

    loadPreferenceSetFromPersona(persona: Persona): void {
        let preferenceString = "";
        switch (persona) {
            case Persona.alexander:
                preferenceString = ""
                break;
            case Persona.anna:
                preferenceString = ""
                break;
            case Persona.carole:
                preferenceString = ""
                break;
            case Persona.lars:
                preferenceString = ""
                break;
            case Persona.maria:
                preferenceString = ""
                break;
            case Persona.mary:
                preferenceString = ""
                break;
            case Persona.monika:
                preferenceString = ""
                break;
            case Persona.susan:
                preferenceString = ""
                break;
            case Persona.tom:
                preferenceString = ""
                break;
        }
    }
}

private const alexanderPreferences = "http://registry.gpii.eu/common/highContrastEnabled\": true,\n" +
    "    \"http://registry.gpii.eu/common/highContrastTheme\": \"white-black\""