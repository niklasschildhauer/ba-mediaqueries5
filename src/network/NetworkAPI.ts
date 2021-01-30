import {CommonTerm, IUserPreference, Persona, UserPreference} from "../model/Model";
import * as Personas from "./Personas/Personas"

/**
 * @interface INetworkAPI
 *
 * Defines the network API. It contains two methods to load user preferences from a server.
 */
export interface INetworkAPI {
    loadPreferenceSetFromPersona(persona: Persona): Promise<INetworkResultUserPreference>;
    loadUserContext(username: string, password: string): Promise<INetworkResultUserPreference>;
}

/**
 * @interface INetworkResultUserPreference
 *
 * Defines the model of the network result. This is the return value of the NetworkAPI methods.
 */
export interface INetworkResultUserPreference {
    success: boolean
    errorMessage: string | null
    userPreferences: IUserPreference[]
}

/**
 * @class NetworkUserResultUserPreference
 *
 * Implements INetworkResultUserPreference interface.
 */
export class NetworkUserResultUserPreference implements INetworkResultUserPreference{
    success: boolean
    errorMessage: string | null
    userPreferences: IUserPreference[]

    constructor(success: boolean, errorMessage: string | null, userPreferences: IUserPreference[]) {
        this.success = success
        this.errorMessage = errorMessage
        this.userPreferences = userPreferences
    }
}


/**
 * @class NetworkAPI
 *
 * This class uses the Javascript OpenAPEClient class to load data from the server.
 * It shields the external OpenAPEClient code from the rest of the polyfill-script so that it can be easily replaced if necessary.
 */
export class NetworkAPI implements  INetworkAPI {
    private client: OpenAPEClient

    constructor() {
        this.client = new OpenAPEClient();
    }

    /**
     * Loads the user context from a user. For this the method does several steps:
     * 1. It logs the user in
     * 2. It loads all the user Context Lists of the user
     * 3. It loads all matching user preferences
     * 4. it returns a NetworkUserResultUserPreference Object with either the UserPreferences or a error
     * message
     *
     * @param username: string   (the openAPE username)
     * @param passwort: string   (the openAPE password)
     * @returns Promise<INetworkResultUserPreference>
     */
    async loadUserContext(username: string, password: string): Promise<INetworkResultUserPreference> {
        try {
            await this.client.login(username, password)
        }
        catch(e) {
            return new NetworkUserResultUserPreference(false, "Login failed", [])
        }


        let userContextList = await this.client.getUserContextList()
            .then(function (result) {
                return result["user-context-uris"]
            })
            .catch(function (err) {
                return new NetworkUserResultUserPreference(false, err, [])
            })

        let userPreferenceArrays: IUserPreference[][] = await Promise.all(userContextList.map(async (context: string) => {
                return await this.client.getUserContext(context)
                    .then(result => {
                        return this.createUserPreferencesFromOpenAPEJSON(result);
                })
        }))

        let userPreferences: IUserPreference[] = []
        userPreferenceArrays.forEach(array => {
            array.forEach(preference => {
                userPreferences.push(preference);
            })
        })
        if(userPreferences.length === 0) {
            return new NetworkUserResultUserPreference(false, "No suitable user context can be loaded", [])
        }

        this.client.token = null;
        return new NetworkUserResultUserPreference(true, null, userPreferences);
    }

    /**
     * Loads the user context of a Persona from the {@linkcode Persona}. For demo reasons the user context
     * is not loaded from the OpenApe server, instead it is loaded from constants
     *
     * @param persona: Persona
     * @returns Promise<INetworkResultUserPreference>
     */
    loadPreferenceSetFromPersona(persona: Persona): Promise<INetworkResultUserPreference> {
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


    /**
     * Private function which creates the UserPreference array from the returned JSON
     *
     * @param json: any   (from the openAPE Server)
     * @returns IUserPreference[]
     */
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
            console.log(e);
            return [];
        }
        if(preferences === undefined) {
            return [];
        }
        let preferenceSet: IUserPreference[] = [];
        try {
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
        } catch (e) {
            console.log(e);
        }
        return preferenceSet
    }


}



let CONSTANTS = {
    TOKEN_PATH: "/token",
    USER_CONTEXT_PATH: "/api/user-contexts",
    OPENAPE_SERVER_URL: "https://openape.gpii.eu",
    CONTENT_TYPE: "application/json"
};


/**
 * @class OpenAPEClient
 *
 * This class is a copy of the [JavaScript OpenAPE Client](https://github.com/REMEXLabs/openape.js).
 */
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

    /**
     * login
     *
     * This function logs the current user in.
     *
     * @param {string} username
     * @param {string} password
     * @returns {Promise} - A JavaScript Promise object.
     */
    async login(username: string, password: string) {
        if (this.isPasswordCorrect(password) && this.isUsernameCorrect(username)) {
            const data = new URLSearchParams();
            data.append("grant_type", "password");
            data.append("username", username);
            data.append("password", password);
           // try {
                return await this.fetchAPIPost(data, CONSTANTS.OPENAPE_SERVER_URL + CONSTANTS.TOKEN_PATH)
                    .then((response) => {
                        this.token = response.access_token
                    });
                //this.token = response.access_token;
            // }
            // catch(err) {
            //     console.log('Fetch Error :-S', err);
            //     throw new Error("Login failed");
            // }
        } else {
            console.log("Passord or username are not valid.")
        }
    }

    /**
     * getUserContexts
     *
     * This function gets the user ContextLists from the logged in user
     *
     * @param {string[]} userContextList
     * @returns {Promise} - A JavaScript Promise object.
     */
    async getUserContexts(userContextList: string[]): Promise<any[]> {
        let resultData: any[] = []
        await userContextList.forEach((uri: string) => {
            this.getUserContext(uri)
                .then(function (result) {
                    resultData.push(result)
                })
                .catch(function (err) {
                    console.log(err)
                });
        })
        return Promise.resolve(resultData);
    }


    /**
     * fetchAPIPost
     *
     * This function fetchs the openAPE Server with a post request
     *
     * @param {string} url - The URL of the server.
     * @param {URLSearchParams} The URL Search Params
     * @returns {Promise} - A JavaScript Promise object.
     */
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
                return json
            })
    }

    /**
     * fetchAPIGet
     *
     * This function fetchs the openAPE Server with a get request
     *
     * @param {string} url - The URL of the server.
     * @returns {Promise} - A JavaScript Promise object.
     */
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
     * @returns {Promise} - A JavaScript Promise object with the user context lists.
     */
    async getUserContextList() {
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
     * @returns {Promise} - A JavaScript Promise object with the user context's information.
     */
    async getUserContext(userContextId: string) {
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





