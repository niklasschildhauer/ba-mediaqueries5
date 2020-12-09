import {CommonTerm, IUserPreference, Persona, UserPreference} from "../model/Model";
import * as Personas from "./Personas/Personas"

export interface INetworkAPI {
    loadPreferenceSetFromPersona(persona: Persona): Promise<INetworkUserResultUserPreference>;
    login(email: string, password: string): boolean;
}

export interface NetworkAPIDelegate {
}

export interface INetworkUserResultUserPreference {
    success: boolean
    errorMessage: string | null
    userPreferences: IUserPreference[]
}

export class NetworkUserResultUserPreference implements INetworkUserResultUserPreference{
    success: boolean
    errorMessage: string | null
    userPreferences: IUserPreference[]

    constructor(success: boolean, errorMessage: string | null, userPreferences: IUserPreference[]) {
        this.success = success
        this.errorMessage = errorMessage
        this.userPreferences = userPreferences
    }
}

export class NetworkAPI implements  INetworkAPI {
    private delegate: NetworkAPIDelegate
    private client: OpenAPEClient

    constructor(delegate: NetworkAPIDelegate) {
        this.delegate = delegate;
        this.client = new OpenAPEClient();
        this.loadUserContext("niklas", "IlPmK#97bJ#fy").catch((err) => console.log("error " + err))
            .then((result)=> {
                console.log(result)
            });
    }

    async loadUserContext(username: string, password: string): Promise<INetworkUserResultUserPreference> {
        await this.client.login(username, password)
            .catch(function (err) {
                return new NetworkUserResultUserPreference(false, err, [])
            })

        let userContextList = await this.client.getUserContextList()
            .then(function (result) {
                console.log(result)
                return result["user-context-uris"]
            })
            .catch(function (err) {
                return new NetworkUserResultUserPreference(false, err, [])
            })

        let result = await Promise.all(userContextList.map(async (context: string) => {
                await this.client.getUserContext(context)
                .then(result => {
                    console.log(result);
                    let preferences = this.createUserPreferencesFromOpenAPEJSON(result);
                    console.log(preferences);
                    return preferences
                })
        }));

        console.log(result);

    /*    let userContexts = await this.client.getUserContexts(userContextList)
            .then((result) => {
                let iterator = result.entries();
                console.log(iterator.next())
                console.log(result[0])
                console.log(typeof result)

                return result
        })

        userContexts.forEach((context) => {
            let preferences = this.createUserPreferencesFromOpenAPEJSON(context)
            if(preferences != []) {
                return new NetworkUserResultUserPreference(true, null, preferences)
            }
        })*/
        return new NetworkUserResultUserPreference(false, "No suitable user context can be loaded", [])
    }

    private async getUserContextId(uri: string) {
        console.log(uri)
        this.client.getUserContext(uri)
            .then(function(result){
                console.log(result)
            })
            .catch(function(err){
                console.log(err)
            })
    }

    login(email: string, password: string): boolean {
        return false;
    }

    loadPreferenceSetFromPersona(persona: Persona): Promise<INetworkUserResultUserPreference> {
        let userPreferences: IUserPreference[]
        switch (persona) {
            case Persona.alexander:
                userPreferences = this.createUserPreferencesFromOpenAPEJSON(Personas.alexanderPreferences);
                break;
            case Persona.anna:
                 userPreferences = this.createUserPreferencesFromOpenAPEJSON(Personas.annaPreferences);
                break;
            case Persona.carole:
                userPreferences =  this.createUserPreferencesFromOpenAPEJSON(Personas.carolePreferences);
                break;
            case Persona.lars:
                userPreferences =  this.createUserPreferencesFromOpenAPEJSON(Personas.larsPreferences);
                break;
            case Persona.maria:
                userPreferences =  this.createUserPreferencesFromOpenAPEJSON(Personas.mariaPreferences);
                break;
            case Persona.mary:
                userPreferences =  this.createUserPreferencesFromOpenAPEJSON(Personas.maryPreferences);
                break;
            case Persona.monika:
                userPreferences =  this.createUserPreferencesFromOpenAPEJSON(Personas.monikaPreferences);
                break;
            case Persona.susan:
                userPreferences =  this.createUserPreferencesFromOpenAPEJSON(Personas.susanPreferences);
                break;
            case Persona.tom:
                userPreferences =  this.createUserPreferencesFromOpenAPEJSON(Personas.tomPreferences);
                break;
            default:
                userPreferences = []
                break;
        }
        return Promise.resolve(new NetworkUserResultUserPreference(true, null, userPreferences));
    }

    // hier muss noch gecheckt werden wie der Kontext heißt...
    private createUserPreferencesFromOpenAPEJSON(json: any): IUserPreference[] {
        let preferences = json;
        if(preferences["contexts"] !== undefined) {
            preferences = preferences["contexts"];
        }
        if(preferences["gpii-default"] !== undefined) {
            preferences = preferences["gpii-default"];
        }
        try {
            preferences = preferences["preferences"];
        }
        catch(e) {
            console.log("Could not load Preferences");
            return [];
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

let CONSTANTS = {
    TOKEN_PATH: "/token",
    USER_CONTEXT_PATH: "/api/user-contexts",
    OPENAPE_SERVER_URL: "https://openape.gpii.eu",
    CONTENT_TYPE: "application/json"
};

class OpenAPEClient {
    contentType: string
    serverUrl: string
    token: string | null
    arrStatusText: string[] = []


    /**
     * constructor
     *
     * Creates a new client for the given login data.
     *
     * @param {string} username - The username used to login.
     * @param {string} password - The password used to login.
     * @param {string} [serverUrl="http://openape.gpii.eu"] - The URL of the server to connect to.
     * @param {string} [contentType="JSON"] - The content type to be used a default. Can be "JSON" or "XML".
     */
    constructor(serverUrl = CONSTANTS.OPENAPE_SERVER_URL, contentType = CONSTANTS.CONTENT_TYPE) {
        this.contentType = contentType;
        this.serverUrl = serverUrl;
        this.token = null;
    }

    async login(username: string, password: string) {
        if (this.isPasswordCorrect(password) && this.isUsernameCorrect(username)) {
            const data = new URLSearchParams();
            data.append("grant_type", "password");
            data.append("username", username);
            data.append("password", password);
            try {
                let response = await this.fetchAPIPost(data, CONSTANTS.OPENAPE_SERVER_URL + CONSTANTS.TOKEN_PATH);
                this.token = response.access_token;
            } catch(err) {
                console.log('Fetch Error :-S', err);
                throw new Error("Login failed");
            }
        } else {
            console.log("Passord or username are not valid.")
        }
    }

    async getUserContexts(userContextList: string[]): Promise<any[]> {
        let resultData: any[] = []
        await userContextList.forEach((uri: string) => {
            this.getUserContext(uri)
                .then(function (result) {
                    resultData.push(result)
                    console.log(result)
                })
                .catch(function (err) {
                    console.log(err)
                });
        })
        return Promise.resolve(resultData);
    }


    async fetchAPIPost(data: URLSearchParams, url: string) {
        console.log("Connection will be established with server: " + url);
        return await fetch(url, {
            method: 'post',
            body: data
        })
            .then(function (response) {
                if (response.status !== 200 && response.status !== 201) {
                    console.log('Looks like there was a problem. Status Code: ' + response.status);
                    return;
                }
                return response.json()
            })
            .then(function (json) {
                console.log(json.access_token)
                return json
            })
    }

    async fetchAPIGet(url: string) {
        if(!this.isTokenCorrect(this.token)) {
            throw new Error("Token is not correct");
            return
        }
        console.log("Connection will be established with server: " + url);
        // @ts-ignore
        return await fetch(url, {
            'method': 'get',
            // @ts-ignore
            'headers': {
                'Content-Type': this.contentType,
                'Authorization': this.token,
            },
        })
            .then(function (response) {
                if (response.status !== 200 && response.status !== 201) {
                    console.log('Looks like there was a problem. Status Code: ' + response.status);
                    return;
                }
                return response.json()
            })
            .then(function (json) {
                return json
            })
    }

    /**
     * getUserContextList
     *
     * This function is used to retrieve a list of URIs to accessible user contexts.
     * It relates to ISO/IEC 24752-8 7.2.6.
     *
     * @param {function} successCallback - The function to be called on success.
     * @param {function} errorCallback - The function to be called on error.
     * @param {string} [contentType="JSON"] - The content type to be used if the default set in the client
     * should not be used. Can be "JSON" or "XML".
     * @returns {object} - A JavaScript object with all user contexts information.
     */
    async getUserContextList(contentType = this.contentType) {
        try {
            return await this.fetchAPIGet(CONSTANTS.OPENAPE_SERVER_URL + CONSTANTS.USER_CONTEXT_PATH);
        } catch(err) {
            console.log('Fetch Error :-S', err);
            throw new Error("Loading user contexts failed");
        }
    }

    /**
     * getUserContext
     *
     * This function can be used to retrieve a certain user context from the OpenAPE server with a given ID.
     * It relates to ISO/ICE 24752-8 7.2.3.
     *
     * @param {string} userContextId - The ID of the stored user context that shall be retrieved.
     * @param {function} successCallback - The function to be called on success.
     * @param {function} errorCallback - The function to be called on error.
     * @param {string} [contentType="JSON"] - The content type to be used if the default set in the client
     * should not be used. Can be "JSON" or "XML".
     * @returns {object} - A JavaScript object with the user context's information.
     */
    async getUserContext(userContextId: string, contentType = this.contentType) {
        if(!this.isContextIdCorrect(userContextId)) {
            throw new Error("User context is not correct");
            return
        }
        try {
            return await this.fetchAPIGet(CONSTANTS.OPENAPE_SERVER_URL + CONSTANTS.USER_CONTEXT_PATH + '/' + userContextId);
        } catch(err) {
            console.log('Fetch Error :-S', err);
            throw new Error("Loading user context id failed");
        }
    }


// HELPER-METHODS

    /**
     * isPasswordCorrect
     *
     * This function checks the correctness of the given password.
     *
     * @param {string} password - The password to be checked.
     * @returns {boolean} - Whether the password is correct or not.
     */
    private isPasswordCorrect(password: string) {
        let isPasswordCorrect = true;
        if (password == "") {
            console.log("Password can not be empty");
            isPasswordCorrect = false;
        } else if (password === undefined) {
            console.log("Please enter a password");
            isPasswordCorrect = false;
        }
        return isPasswordCorrect;
    }

    /**
     * isUsernameCorrect
     *
     * This function checks the correctness of the given username.
     *
     * @param {string} username - The username to be checked.
     * @returns {boolean} - Whether the username is correct or not.
     */
    private isUsernameCorrect(username: string) {
        let isUsernameCorrect = true;
        if (username == "") {
            this.arrStatusText.push("Username can not be empty");
            isUsernameCorrect = false;
        } else if (username === undefined) {
            console.log("Please enter a username");
            isUsernameCorrect = false;
        }
        return isUsernameCorrect
    }

    /**
     * isTokenCorrect
     *
     * This function checks the correctness of the given token.
     *
     * @returns {boolean} - Whether the token is correct or not.
     */
    private isTokenCorrect(token: string | null) {
        let isTokenCorrect = true;
        if (token === undefined ||token === null) {
            console.log("Please initialize the library");
            isTokenCorrect = false;
        }
        return isTokenCorrect;
    }

    /**
     * isContextIdCorrect
     *
     * This function checks the correctness of the given context ID.
     *
     * @param {string} contextId  - The context ID to be checked.
     * @returns {boolean} - Whether the context ID is correct or not.
     */
    private isContextIdCorrect(contextId: string) {
        let isContextIdCorrect = true;
        if (contextId == "") {
            console.log("The contextId can not be empty");
            isContextIdCorrect = false;
        } else if (contextId === undefined) {
            console.log("Please enter a contextId");
            isContextIdCorrect = false;
        }

        return isContextIdCorrect;
    }

}





