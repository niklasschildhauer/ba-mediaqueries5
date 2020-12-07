import * as View from '../view/UserPreferenceViewController';
import * as Reader from '../reader/CSSReader';
import * as Model  from "../model/Model";
import * as User from "../user/UserPreferenceProfile";
import * as Parser from "../parser/CSSCodeParser";
import * as Network from "../network/NetworkAPI";
import {JSVariableParser} from "../parser/VariableParser";

export class ScriptCoordinator implements View.UserPreferenceViewDelegate, Reader.CSSReaderDelegate, User.UserProfileDelegate, Network.NetworkAPIDelegate{
    private UserPreferenceViewController: View.IUserPreferenceViewController;
    private CSSReader: Reader.IReader<Model.IMediaDescriptor>;
    private UserProfile: User.IUserPreferenceProfile;
    private CodeParser: Parser.IParser;
    private NetworkAPI: Network.INetworkAPI;
    private JSVariableParser: Parser.IParser;

    public constructor() {
        console.log("Hello World");
        console.log("-----------");
        this.CSSReader = new Reader.CSSReader(this);
        this.NetworkAPI = new Network.NetworkAPI(this);
        this.UserProfile = new User.UserPreferenceProfile(this, this.NetworkAPI);
        this.UserPreferenceViewController = new View.UserPreferenceViewController(this, this.UserProfile);
        this.CodeParser = new Parser.CSSCodeParser(this.UserProfile, this.CSSReader);
        this.JSVariableParser = new JSVariableParser(this.UserProfile);
    }

    public addCSSCode(string: string) {
        this.CSSReader.read(string);
        console.log(this.CSSReader.get());
    }

    // DELEGATE FUNCTIONS
    setUserPreferences(string: string, from: View.IUserPreferenceViewController): void {
        console.log(string);
    }

    didUpdateMediaDescriptors(from: Reader.CSSReader): void {
        this.CodeParser.parse();
        console.log("update CSS Code!");
    }

    didUpdateProfile(): void {
        this.CodeParser.parse();
    }
}
