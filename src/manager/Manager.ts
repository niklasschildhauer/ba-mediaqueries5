import * as View from '../view/UserPreferenceViewController';

export class ManagerSingelton implements View.UserPreferenceViewDelegate{
    private UserPreferenceViewController: View.IUserPreferenceViewController;

    public constructor() {
        // this.UserPreferenceViewController = new View.UserPreferenceViewController(this);
    }

    setUserPreferences(string: string): void {
        console.log(string);
    }


}

export function test(): void {
    console.log("test124");

}
