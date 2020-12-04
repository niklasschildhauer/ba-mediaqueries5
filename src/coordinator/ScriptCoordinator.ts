import * as View from '../view/UserPreferenceViewController';
import * as Reader from '../reader/CSSReader'
import * as Model  from "../model/Model";

export class ScriptCoordinator implements View.UserPreferenceViewDelegate{
    private UserPreferenceViewController: View.IUserPreferenceViewController;
    private CSSReader: Reader.IReader<Model.IMediaDescriptor>

    public constructor() {
        console.log("Hello World");
        console.log("-----------");
        this.UserPreferenceViewController = new View.UserPreferenceViewController(this);
        this.CSSReader = new Reader.CSSReader();
    }

    setUserPreferences(string: string, from: View.IUserPreferenceViewController): void {
        console.log(string);
    }

    public addCSSCode(string: string) {
        this.CSSReader.read(string);
        console.log(this.CSSReader.get());
    }

}
