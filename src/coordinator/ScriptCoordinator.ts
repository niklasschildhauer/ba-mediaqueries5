import * as View from '../view/UserPreferenceViewController';
import {
    IUserPreferencePresenter,
    IViewController,
    UserPreferenceViewController
} from '../view/UserPreferenceViewController';
import * as Reader from '../reader/CSSReader';
import * as Model from "../model/Model";
import {CommonTerm, UserPreference} from "../model/Model";
import * as User from "../user/UserPreferenceProfile";
import {IUserPreferenceProfile, UserPreferenceProfile} from "../user/UserPreferenceProfile";
import {JSVariableParser} from "../parser/JSVariableParser";
import {CodeParser, ICodeParser} from "../parser/CodeParser";
import {CSSCodeParser} from "../parser/CSSCodeParser";
import {NetworkAPI} from "../network/NetworkAPI";

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
 * It defines all methods which the web author can use to configure the program.
 */
export interface IScriptCoordinator {
    addCSSCode(code: string): void;
    setAudioDescriptionEnabledValue(value: string): void // noch nicht in Schaubild!
    setCaptionsEnabledValue(value: string): void // noch nicht in Schaubild!
    setTableOfContentsValue(value: string): void // noch nicht in Schaubild!
    setSignLanguageValue(value: string): void // noch nicht in Schaubild!
    setSignLanguageEnabledValue(value: string): void // noch nicht in Schaubild!
    setPictogramsEnabledValue(value: string): void // noch nicht in Schaubild!
    setSelfVoicingEnabledValue(value: string): void // noch nicht in Schaubild!
    setSessionTimeoutValue(value: string): void // noch nicht in Schaubild!
    setDisplaySkiplinksValue(value: string): void // noch nicht in Schaubild!
}

/**
 * @class ScriptCoordinator
 *
 * This Coordinator implements several delegate methods.
 * If something changes, it will be coordinated here.
 */
export class ScriptCoordinator implements ICoordinator<IUserPreferencePresenter>, IScriptCoordinator, Reader.CSSReaderDelegate, User.UserPreferenceProfileDelegate{
    private cssReader: Reader.IReader<Model.IMediaDescriptor>;
    private userProfile: IUserPreferenceProfile; // noch nicht im Schaubild
    private codeParser: ICodeParser;
    rootViewController: View.IViewController<View.IUserPreferencePresenter>;


    public constructor() {
        console.log("Hello World");
        console.log("-----------");

        this.cssReader = new Reader.CSSReader(this);
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
     * Can be called when the web author wants to add CSS code himself instead
     * of letting CSSReader read it automatically.
     */
    public addCSSCode(string: string) {
        this.cssReader.read(string);
        console.log(this.cssReader.get());
    }
    /**
     * Changes the AudioDescriptionEnabled Value
     *
     * @param value
     */
    public setAudioDescriptionEnabledValue(value: string): void {
        this.userProfile.setUserPreference(new UserPreference(CommonTerm.audioDescriptionEnabled, value));
    }
    /**
     * Changes the CaptionsEnabled Value
     *
     * @param value
     */
    public setCaptionsEnabledValue(value: string): void{
        this.userProfile.setUserPreference(new UserPreference(CommonTerm.captionsEnabled, value));
    }
    /**
     * Changes the SignLanguage Value
     *
     * @param value
     */
    public setSignLanguageValue(value: string): void {
        this.userProfile.setUserPreference(new UserPreference(CommonTerm.signLanguage, value));
    }
    /**
     * Changes the SignLanguageEnabled Value
     *
     * @param value
     */
    public setSignLanguageEnabledValue(value: string): void {
        this.userProfile.setUserPreference(new UserPreference(CommonTerm.signLanguageEnabled, value));
    }
    /**
     * Changes the PictogramsEnabled Value
     *
     * @param value
     */
    public setPictogramsEnabledValue(value: string): void {
        this.userProfile.setUserPreference(new UserPreference(CommonTerm.pictogramsEnabled, value));
    }
    /**
     * Changes the SelfVoicingEnabled Value
     *
     * @param value
     */
    public setSelfVoicingEnabledValue(value: string): void {
        this.userProfile.setUserPreference(new UserPreference(CommonTerm.selfVoicingEnabled, value));
    }
    /**
     * Changes the SessionTimeout Value
     *
     * @param value
     */
    public setSessionTimeoutValue(value: string): void {
        this.userProfile.setUserPreference(new UserPreference(CommonTerm.sessionTimeout, value));
    }
    /**
     * Changes the DisplaySkiplinks Value
     *
     * @param value
     */
    public setDisplaySkiplinksValue(value: string): void {
        this.userProfile.setUserPreference(new UserPreference(CommonTerm.displaySkiplinks, value));
    }
    /**
     * Changes the TableOfContents Value
     *
     * @param value
     */
    public setTableOfContentsValue(value: string): void {
        this.userProfile.setUserPreference(new UserPreference(CommonTerm.tableOfContents, value));
    }


    // DELEGATE FUNCTIONS
    /**
     * Called from the CSSReader when the MediaDescriptors have been updated.
     * It tells the CodeParser to parse the code again.
     *
     * @param CSSReader
     */
    didUpdateMediaDescriptors(from: Reader.CSSReader): void {
        this.codeParser.parse();
        console.log("update CSS Code!");
    }

    /**
     * Called from the IUserPreferenceProfile when the Profile has been updated.
     * It tells the CodeParser to parse the code again and the ViewController to reload
     *
     * @param IUserPreferenceProfile
     */
    didUpdateProfile(from: User.IUserPreferenceProfile): void {
        this.codeParser.parse();
        this.rootViewController.presenter.reload();
    }

    /**
     * Called from the IUserPreferenceProfile when the an error occurred until login to the openAPE Server
     * It tells ViewController to show an error Message.
     *
     * @param IUserPreferenceProfile
     */
    recievedLoginErrorMessage(message: string, from: User.IUserPreferenceProfile): void {
        this.rootViewController.presenter.showLoginErrorMessage(message);
    }

    /**
     * Called from the IUserPreferenceProfile when the an Persona is selected
     * It tells ViewController to show that a Persona is selected.
     *
     * @param IUserPreferenceProfile
     */
    didSelectPersona(persona: Model.Persona, from: User.IUserPreferenceProfile): void {
        this.rootViewController.presenter.selectedPersona(persona);
    }
}
