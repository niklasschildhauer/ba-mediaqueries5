export interface IUserPreferenceViewController {
    refreshView(): void;
}

export interface UserPreferenceViewDelegate {
    setUserPreferences(string: string, from: IUserPreferenceViewController): void
}

export class UserPreferenceViewController implements IUserPreferenceViewController {
    delegate: UserPreferenceViewDelegate;

    public constructor(delegate: UserPreferenceViewDelegate) {
        this.delegate = delegate;
        this.refreshView();
    }

    refreshView(): void {
        console.log("refreshView");
        this.delegate.setUserPreferences("Hallo über das Delegate", this);
    }
}