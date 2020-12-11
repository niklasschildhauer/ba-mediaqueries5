import * as View from '../view/UserPreferenceViewController';
import * as Reader from '../reader/CSSReader';
import * as Model  from "../model/Model";
import * as User from "../user/UserPreferenceProfile";
import * as Parser from "../parser/CSSCodeParser";
import * as Network from "../network/NetworkAPI";
import {JSVariableParser} from "../parser/JSVariableParser";

export class ScriptCoordinator implements View.UserPreferenceViewDelegate, Reader.CSSReaderDelegate, User.UserProfileDelegate, Network.NetworkAPIDelegate{
    private userPreferenceViewController: View.IUserPreferenceViewController;
    private cssReader: Reader.IReader<Model.IMediaDescriptor>;
    private userProfile: User.IUserPreferenceProfile;
    private cssCodeParser: Parser.IParser;
    private jsVariableParser: Parser.IParser;

    public constructor() {
        console.log("Hello World");
        console.log("-----------");
        let networkAPI = new Network.NetworkAPI(this);

        this.cssReader = new Reader.CSSReader(this);
        this.userProfile = new User.UserPreferenceProfile(this, networkAPI);
        this.userPreferenceViewController = new View.UserPreferenceViewController(this, this.userProfile);
        this.cssCodeParser = new Parser.CSSCodeParser(this.userProfile, this.cssReader);
        this.jsVariableParser = new JSVariableParser(this.userProfile);
    }

    public addCSSCode(string: string) {
        this.cssReader.read(string);
        console.log(this.cssReader.get());
    }

    private parseCode(): void {
        this.cssCodeParser.parse();
        this.jsVariableParser.parse();
    }

    // DELEGATE FUNCTIONS
    didUpdateMediaDescriptors(from: Reader.CSSReader): void {
        this.parseCode();
        console.log("update CSS Code!");
    }

    didUpdateProfile(from: User.IUserPreferenceProfile): void {
        this.parseCode();
        this.userPreferenceViewController.refreshView();

    }

    recievedLoginErrorMessage(message: string, from: User.IUserPreferenceProfile): void {
        this.userPreferenceViewController.showLoginErrorMessage(message);
    }
}
