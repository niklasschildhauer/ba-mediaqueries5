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

export interface ICoordinator<T> {
    rootViewController: IViewController<T>
}

export interface IScriptCoordinator {
    addCSSCode(code: string): void;
    setAudioDescriptionEnabledValue(value: string): void // noch nicht in Schaubild!
    setCaptionsEnabledValue(value: string): void // noch nicht in Schaubild!
    setSignLanguageValue(value: string): void // noch nicht in Schaubild!
    setSignLanguageEnabledValue(value: string): void // noch nicht in Schaubild!
    setPictogramsEnabledValue(value: string): void // noch nicht in Schaubild!
    setSelfVoicingEnabledValue(value: string): void // noch nicht in Schaubild!
    setSessionTimeoutValue(value: string): void // noch nicht in Schaubild!
    setDisplaySkiplinksValue(value: string): void // noch nicht in Schaubild!
}

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

    public addCSSCode(string: string) {
        this.cssReader.read(string);
        console.log(this.cssReader.get());
    }

    public setAudioDescriptionEnabledValue(value: string): void {
        this.userProfile.setUserPreference(new UserPreference(CommonTerm.audioDescriptionEnabled, value));
    }
    public setCaptionsEnabledValue(value: string): void{
        this.userProfile.setUserPreference(new UserPreference(CommonTerm.captionsEnabled, value));
    }
    public setSignLanguageValue(value: string): void {
        this.userProfile.setUserPreference(new UserPreference(CommonTerm.signLanguage, value));
    }
    public setSignLanguageEnabledValue(value: string): void {
        this.userProfile.setUserPreference(new UserPreference(CommonTerm.signLanguageEnabled, value));
    }
    public setPictogramsEnabledValue(value: string): void {
        this.userProfile.setUserPreference(new UserPreference(CommonTerm.pictogramsEnabled, value));
    }
    public setSelfVoicingEnabledValue(value: string): void {
        this.userProfile.setUserPreference(new UserPreference(CommonTerm.selfVoicingEnabled, value));
    }
    public setSessionTimeoutValue(value: string): void {
        this.userProfile.setUserPreference(new UserPreference(CommonTerm.sessionTimeout, value));
    }
    public setDisplaySkiplinksValue(value: string): void {
        this.userProfile.setUserPreference(new UserPreference(CommonTerm.displaySkiplinks, value));
    }

    private parseCode(): void {
        this.codeParser.parse();
    }

    // DELEGATE FUNCTIONS
    didUpdateMediaDescriptors(from: Reader.CSSReader): void {
        this.parseCode();
        console.log("update CSS Code!");
    }

    didUpdateProfile(from: User.IUserPreferenceProfile): void {
        this.parseCode();
        this.rootViewController.presenter.reload();
    }

    recievedLoginErrorMessage(message: string, from: User.IUserPreferenceProfile): void {
        this.rootViewController.presenter.showLoginErrorMessage(message);
    }

    didSelectPersona(persona: Model.Persona, from: User.IUserPreferenceProfile): void {
        this.rootViewController.presenter.selectedPersona(persona);
    }
}
