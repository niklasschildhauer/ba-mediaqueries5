import {IMediaFeature, IUserPreference} from "../model/Model";

export interface IUserProfile {
    userPreferences: IUserPreference[]
    doesMatch(mediaFeature: IMediaFeature): boolean
}

export interface  UserProfileDelegate {
    didUpdateProfile(): void
}


export class UserProfile implements IUserProfile {
    userPreferences: IUserPreference[];
    delegate: UserProfileDelegate;

    constructor(delegate: UserProfileDelegate) {
        this.userPreferences = [];
        this.setDefaultValues();
        this.delegate = delegate;
    }

    private setDefaultValues() {
        this.userPreferences = [];

    }

    doesMatch(mediaFeature: IMediaFeature): boolean {
        return false;
    }

}