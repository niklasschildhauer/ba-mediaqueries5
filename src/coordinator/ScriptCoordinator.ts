import * as View from '../view/UserPreferenceViewController';
import * as Reader from '../reader/CSSReader';
import * as Model  from "../model/Model";
import * as User from "../user/UserPreferenceProfile";
import * as Parser from "../parser/CodeParser";
export class ScriptCoordinator implements View.UserPreferenceViewDelegate, Reader.CSSReaderDelegate, User.UserProfileDelegate{
    private UserPreferenceViewController: View.IUserPreferenceViewController;
    private CSSReader: Reader.IReader<Model.IMediaDescriptor>;
    private UserProfile: User.IUserPreferenceProfile;
    private CodeParser: Parser.ICodeParser;

    public constructor() {
        console.log("Hello World");
        console.log("-----------");
        this.UserPreferenceViewController = new View.UserPreferenceViewController(this);
        this.CSSReader = new Reader.CSSReader(this);
        this.UserProfile = new User.UserPreferenceProfile(this);
        this.CodeParser = new Parser.CodeParser(this.UserProfile, this.CSSReader);
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
        console.log("Update Profile!");
        throw new Error("Update Profile");
    }

}
