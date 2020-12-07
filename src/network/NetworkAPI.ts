import {CommonTerm, IUserPreference, Persona, UserPreference} from "../model/Model";
import * as Personas from "./Personas/Personas"

export interface INetworkAPI {
    loadPreferenceSetFromPersona(persona: Persona): IUserPreference[];
    login(email: string, password: string): boolean;
}

export interface NetworkAPIDelegate {
}

export class NetworkAPI implements  INetworkAPI {
    private delegate: NetworkAPIDelegate

    constructor(delegate: NetworkAPIDelegate) {
        this.delegate = delegate;
    }

    login(email: string, password: string): boolean {
        return false;
    }

    loadPreferenceSetFromPersona(persona: Persona): IUserPreference[] {
        switch (persona) {
            case Persona.alexander:
                return this.createUserPreferencesFromOpenAPEJSON(Personas.alexanderPreferences);
            case Persona.anna:
                return this.createUserPreferencesFromOpenAPEJSON(Personas.annaPreferences);
            case Persona.carole:
                return this.createUserPreferencesFromOpenAPEJSON(Personas.carolePreferences);
            case Persona.lars:
                return this.createUserPreferencesFromOpenAPEJSON(Personas.larsPreferences);
            case Persona.maria:
                return this.createUserPreferencesFromOpenAPEJSON(Personas.mariaPreferences);
            case Persona.mary:
                return this.createUserPreferencesFromOpenAPEJSON(Personas.maryPreferences);
            case Persona.monika:
                return this.createUserPreferencesFromOpenAPEJSON(Personas.monikaPreferences);
            case Persona.susan:
                return this.createUserPreferencesFromOpenAPEJSON(Personas.susanPreferences);
            case Persona.tom:
                return this.createUserPreferencesFromOpenAPEJSON(Personas.tomPreferences);
                break;

                return []
        }
    }

    // hier muss noch gecheckt werden wie der Kontext heißt...
    private createUserPreferencesFromOpenAPEJSON(json: any): IUserPreference[] {
        let preferences = json;
        try {
            preferences = preferences["contexts"]["gpii-default"]["preferences"];
        } catch (e) {
            console.log("Could not load Preferences");
        }
        let preferenceSet: IUserPreference[] = [];
        (preferences["http://registry.gpii.eu/common/signLanguage"] != undefined) ?
            preferenceSet.push(new UserPreference(CommonTerm.signLanguage, preferences["http://registry.gpii.eu/common/signLanguage"] + "")) : "";
        (preferences["http://registry.gpii.eu/common/signLanguageEnabled"] != undefined) ?
            preferenceSet.push(new UserPreference(CommonTerm.signLanguageEnabled, preferences["http://registry.gpii.eu/common/signLanguageEnabled"] + "")) : "";
        (preferences["http://registry.gpii.eu/common/pictogramsEnabled"] != undefined) ?
            preferenceSet.push(new UserPreference(CommonTerm.pictogramsEnabled, preferences["http://registry.gpii.eu/common/pictogramsEnabled"] + "")) : "";
        (preferences["http://registry.gpii.eu/common/audioDescriptionEnabled"] != undefined) ?
            preferenceSet.push(new UserPreference(CommonTerm.audioDescriptionEnabled, preferences["http://registry.gpii.eu/common/audioDescriptionEnabled"] + "")) : "";
        (preferences["http://registry.gpii.eu/common/captionsEnabled"] != undefined) ?
            preferenceSet.push(new UserPreference(CommonTerm.captionsEnabled, preferences["http://registry.gpii.eu/common/captionsEnabled"] + "")) : "";
        (preferences["http://registry.gpii.eu/common/tableOfContents"] != undefined) ?
            preferenceSet.push(new UserPreference(CommonTerm.tableOfContents, preferences["http://registry.gpii.eu/common/tableOfContents"] + "")) : "";
        (preferences["http://registry.gpii.eu/common/displaySkiplinks"] != undefined) ?
            preferenceSet.push(new UserPreference(CommonTerm.displaySkiplinks, preferences["http://registry.gpii.eu/common/displaySkiplinks"] + "")) : "";
        (preferences["http://registry.gpii.eu/common/sessionTimeout"] != undefined) ?
            preferenceSet.push(new UserPreference(CommonTerm.sessionTimeout, preferences["http://registry.gpii.eu/common/sessionTimeout"] + "")) : "";
        (preferences["http://registry.gpii.eu/common/selfVoicingEnabled"] != undefined) ?
            preferenceSet.push(new UserPreference(CommonTerm.selfVoicingEnabled, preferences["http://registry.gpii.eu/common/selfVoicingEnabled"] + "")) : "";

        return preferenceSet
    }


}

