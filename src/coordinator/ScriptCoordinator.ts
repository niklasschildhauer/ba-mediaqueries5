import {IViewController, UserPreferenceViewController } from '../view/UserPreferenceViewController';
import {CommonTerm, IMediaDescriptor, Persona, UserPreference} from "../model/Model";
import {IUserPreferenceProfile, UserPreferenceProfile, UserPreferenceProfileDelegate} from "../user/UserPreferenceProfile";
import {JSVariableParser} from "../parser/JSVariableParser";
import {CodeParser, ICodeParser} from "../parser/CodeParser";
import {CSSCodeParser} from "../parser/CSSCodeParser";
import {NetworkAPI} from "../network/NetworkAPI";
import {IUserPreferencePresenter} from "../view/UserPreferencePresenter";
import {CSSReader, CSSReaderDelegate, IReader} from "../reader/CSSReader";

/**
 * @interface ICoordinator<T>
 *
 * Defines a Coordinator with a rootViewController
 */
export interface ICoordinator<T> {
    rootViewController: IViewController<T>
}

/**
 * @interface IScriptCoordinator
 *
 * Defines the ScriptCoordinator. It is the main coordinator, which is the only visible class for the web author.
 * It defines all methods which the web author can use to configure the polyfill script.
 */
export interface IScriptCoordinator {
    addCSSCode(code: string): void;
    setAudioDescriptionEnabledValue(value: string): void;
    setCaptionsEnabledValue(value: string): void;
    setTableOfContentsValue(value: string): void;
    setSignLanguageValue(value: string): void;
    setSignLanguageEnabledValue(value: string): void;
    setPictogramsEnabledValue(value: string): void;
    setSelfVoicingEnabledValue(value: string): void;
    setSessionTimeoutValue(value: string): void;
    setDisplaySkiplinksValue(value: string): void;
    showPreferencePanel(): void;
    hidePreferencePanel(): void;
    removePreferencePanel(): void;
}

/**
 * @class ScriptCoordinator
 *
 * This Coordinator implements several delegate methods.
 * If something changes, it will be coordinated here.
 */
export class ScriptCoordinator implements ICoordinator<IUserPreferencePresenter>, IScriptCoordinator, CSSReaderDelegate, UserPreferenceProfileDelegate{
    private cssReader: IReader<IMediaDescriptor>;
    private userProfile: IUserPreferenceProfile;
    private codeParser: ICodeParser;
    rootViewController: IViewController<IUserPreferencePresenter>;


    public constructor() {
        console.log("Hello World");
        console.log("-----------");

        this.cssReader = new CSSReader(this);
        this.userProfile = this.createUserProfile()
        this.rootViewController = new UserPreferenceViewController(this.userProfile);
        this.codeParser = this.createCodeParser(this.userProfile);
    }

    private createUserProfile(): IUserPreferenceProfile {
        let network = new NetworkAPI();
        return new UserPreferenceProfile(this, network);
    }

    private createCodeParser(userProfile: IUserPreferenceProfile): ICodeParser {
        let jsParser = new JSVariableParser(userProfile);
        let cssParser = new CSSCodeParser(userProfile, this.cssReader);
        return new CodeParser(jsParser, cssParser);
    }

    /**
     * Can be called when the web author wants to add CSS code by himself instead
     * of letting CSSReader read it automatically.
     */
    public addCSSCode(string: string) {
        this.cssReader.read(string);
    }
    /**
     * Changes the AudioDescriptionEnabled value.
     *
     * @param value: string
     */
    public setAudioDescriptionEnabledValue(value: string): void {
        this.userProfile.setUserPreference(new UserPreference(CommonTerm.audioDescriptionEnabled, value));
    }
    /**
     * Changes the CaptionsEnabled value.
     *
     * @param value: string
     */
    public setCaptionsEnabledValue(value: string): void{
        this.userProfile.setUserPreference(new UserPreference(CommonTerm.captionsEnabled, value));
    }
    /**
     * Changes the SignLanguage value.
     *
     * @param value: string
     */
    public setSignLanguageValue(value: string): void {
        this.userProfile.setUserPreference(new UserPreference(CommonTerm.signLanguage, value));
    }
    /**
     * Changes the SignLanguageEnabled value.
     *
     * @param value: string
     */
    public setSignLanguageEnabledValue(value: string): void {
        this.userProfile.setUserPreference(new UserPreference(CommonTerm.signLanguageEnabled, value));
    }
    /**
     * Changes the PictogramsEnabled value.
     *
     * @param value: string
     */
    public setPictogramsEnabledValue(value: string): void {
        this.userProfile.setUserPreference(new UserPreference(CommonTerm.pictogramsEnabled, value));
    }
    /**
     * Changes the SelfVoicingEnabled value.
     *
     * @param value: string
     */
    public setSelfVoicingEnabledValue(value: string): void {
        this.userProfile.setUserPreference(new UserPreference(CommonTerm.selfVoicingEnabled, value));
    }
    /**
     * Changes the SessionTimeout value.
     *
     * @param value: string
     */
    public setSessionTimeoutValue(value: string): void {
        this.userProfile.setUserPreference(new UserPreference(CommonTerm.sessionTimeout, value));
    }
    /**
     * Changes the DisplaySkiplinks value.
     *
     * @param value: string
     */
    public setDisplaySkiplinksValue(value: string): void {
        this.userProfile.setUserPreference(new UserPreference(CommonTerm.displaySkiplinks, value));
    }
    /**
     * Changes the TableOfContents value.
     *
     * @param value: string
     */
    public setTableOfContentsValue(value: string): void {
        this.userProfile.setUserPreference(new UserPreference(CommonTerm.tableOfContents, value));
    }

    /**
     * Shows the preference panel, if it's collapsed
     */
    public showPreferencePanel(): void {
        this.rootViewController.presenter.pressedShowPanel()
    }

    /**
     * Hides the preference panel, if it's expanded
     */
    public hidePreferencePanel(): void {
        this.rootViewController.presenter.pressedHidePanel()
    }


    /**
     * Removes the preference panel from the HTML document
     */
    public removePreferencePanel(): void {
        this.rootViewController.removeView();
    }


    // DELEGATE FUNCTIONS
    /**
     * Called from the CSSReader when the MediaDescriptors have been updated.
     * It tells the CodeParser to parse the code again.
     *
     * @param CSSReader
     */
    didUpdateMediaDescriptors(from: CSSReader): void {
        this.codeParser.parse();
    }

    /**
     * Called from the IUserPreferenceProfile when the profile has been updated.
     * It tells the CodeParser to parse the code again and reloads the ViewController.
     *
     * @param IUserPreferenceProfile
     */
    didUpdateProfile(from: IUserPreferenceProfile): void {
        this.codeParser.parse();
        this.rootViewController.presenter.reload();
    }

    /**
     * Called from the IUserPreferenceProfile when an error occurred until login to the openAPE Server
     * It tells ViewController to show an error Message.
     *
     * @param IUserPreferenceProfile
     */
    recievedLoginErrorMessage(message: string, from: IUserPreferenceProfile): void {
        this.rootViewController.presenter.showLoginErrorMessage(message);
    }

    /**
     * Called from the IUserPreferenceProfile when a Persona is selected.
     * It tells ViewController to show that a Persona is selected.
     *
     * @param IUserPreferenceProfile
     */
    didSelectPersona(persona: Persona, from: IUserPreferenceProfile): void {
        this.rootViewController.presenter.selectedPersona(persona);
    }
}
