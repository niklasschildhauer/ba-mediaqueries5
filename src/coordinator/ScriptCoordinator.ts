import * as View from '../view/UserPreferenceViewController';
import * as Reader from '../reader/CSSReader'
import * as Model  from "../model/Model";
import * as User from "../user/UserPreferenceProfile"
import {IMediaDescriptor} from "../model/Model";

export class ScriptCoordinator implements View.UserPreferenceViewDelegate, Reader.CSSReaderDelegate, User.UserProfileDelegate{
    private UserPreferenceViewController: View.IUserPreferenceViewController;
    private CSSReader: Reader.IReader<Model.IMediaDescriptor>;
    private UserProfile: User.IUserPreferenceProfile;

    public constructor() {
        console.log("Hello World");
        console.log("-----------");
        this.UserPreferenceViewController = new View.UserPreferenceViewController(this);
        this.CSSReader = new Reader.CSSReader(this);
        this.UserProfile = new User.UserPreferenceProfile(this);
    }

    public addCSSCode(string: string) {
        this.CSSReader.read(string);
        console.log(this.CSSReader.get());
    }

    // DELEGATE FUNCTIONS
    setUserPreferences(string: string, from: View.IUserPreferenceViewController): void {
        console.log(string);
    }

    didResetMediaDescriptors(from: Reader.CSSReader): void {
        console.log("reset CSS Code!");
        throw new Error("Reset CSS Code");
    }

    didUpdateProfile(): void {
        console.log("Update Profile!");
        throw new Error("Update Profile");
    }

}
