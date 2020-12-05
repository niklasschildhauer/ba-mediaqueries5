import {
    UserPreferenceViewController,
    UserPreferenceViewDelegate
} from "./UserPreferenceViewController";
import * as View from "./UserPreferenceViewController";

test('running',async () => {
    class DelegateClass implements  UserPreferenceViewDelegate {
        setUserPreferences(string: string, from: View.IUserPreferenceViewController): void {
            console.log(string);
        }
    }

    let viewController = new UserPreferenceViewController(new DelegateClass());
});