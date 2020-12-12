import * as View from '../view/UserPreferenceViewController';
import * as Reader from '../reader/CSSReader';
import * as Model  from "../model/Model";
import * as User from "../user/UserPreferenceProfile";
import * as Parser from "../parser/CSSCodeParser";
import * as Network from "../network/NetworkAPI";
import {JSVariableParser} from "../parser/JSVariableParser";
import {
    IUserPreferencePresenter,
    IViewController, UserPreferenceViewController,
} from "../view/UserPreferenceViewController";
import {CodeParser, ICodeParser} from "../parser/CodeParser";
import {CSSCodeParser} from "../parser/CSSCodeParser";
import {IUserPreferenceProfile, UserPreferenceProfile} from "../user/UserPreferenceProfile";
import {NetworkAPI} from "../network/NetworkAPI";

export interface ICoordinator<T> {
    rootViewController: IViewController<T>
}

export interface IScriptCoordinator {
    addCSSCode(string: string): void;
}

export class ScriptCoordinator implements ICoordinator<IUserPreferencePresenter>, IScriptCoordinator, Reader.CSSReaderDelegate, User.UserPreferenceProfileDelegate{
    private cssReader: Reader.IReader<Model.IMediaDescriptor>;
    private userProfile: User.IUserPreferenceProfile;
    private codeParser: ICodeParser;
    rootViewController: View.IViewController<View.IUserPreferencePresenter>;


    public constructor() {
        console.log("Hello World");
        console.log("-----------");

        this.cssReader = new Reader.CSSReader(this);
        this.userProfile = this.createUserProfile();
        this.rootViewController = new UserPreferenceViewController(this.userProfile);
        this.codeParser = this.createCodeParser();
    }

    private createUserProfile(): IUserPreferenceProfile {
        let network = new NetworkAPI();
        return new UserPreferenceProfile(this, network);
    }

    private createCodeParser(): ICodeParser {
        let jsParser = new JSVariableParser(this.userProfile);
        let cssParser = new CSSCodeParser(this.userProfile, this.cssReader);
        return new CodeParser(jsParser, cssParser);
    }

    public addCSSCode(string: string) {
        this.cssReader.read(string);
        console.log(this.cssReader.get());
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
