import * as Profile from "../user/UserPreferenceProfile";
import {IReader} from "../reader/CSSReader";
import {IMediaDescriptor} from "../model/Model";

export interface ICodeParser {
    parse(): void;
}

export class CodeParser implements ICodeParser {
    private userProfile: Profile.IUserPreferenceProfile;
    private cssReader: IReader<IMediaDescriptor>;
    private styleId = "common-terms-media-queries";


    constructor(userPreferenceProfile: Profile.IUserPreferenceProfile, cssReader: IReader<IMediaDescriptor>) {
        this.cssReader = cssReader;
        this.userProfile = userPreferenceProfile;
    }

    parse(): void {
        this.resetCSSCode();
        let cssCode = this.createCSSCode();
        this.parseCSSCode(cssCode);
    }

    private createCSSCode(): string {
        let cssStyle: string[] = []
        let mediaDescriptors = this.cssReader.get()
        for (let i = 0; i < mediaDescriptors.length; i++) {
            let mediaDescriptor = mediaDescriptors[i]
            if(this.userProfile.doesMediaQueryMatch(mediaDescriptor.mediaQuery)) {
                let cssCode = mediaDescriptor.body
                if(mediaDescriptor.mediaQuery.supportedMediaQuery !== null) {
                    cssCode = "@media " + mediaDescriptor.mediaQuery.supportedMediaQuery + " {\n" + cssCode + "\n}";
                }
                cssStyle.push(cssCode);
            }
        }
        return cssStyle.join("\n");

    }

    private parseCSSCode(cssCode: string): void {
        const style = document.createElement('style');
        style.setAttribute("id", this.styleId);
        style.innerHTML = cssCode;
        document.head.appendChild(style);
    }

    private resetCSSCode(): void {
        const style = document.getElementById(this.styleId);
        if(style != null){
            style.remove();
        }
    }
}