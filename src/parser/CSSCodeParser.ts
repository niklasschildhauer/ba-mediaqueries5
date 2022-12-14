import * as Profile from "../user/UserPreferenceProfile";
import {IReader} from "../reader/CSSReader";
import {CommonTerm, IMediaDescriptor} from "../model/Model";
import {ICodeParser} from "./CodeParser";

/**
 * @class CSSCodeParser
 *
 * Implements ICodeParser interface.
 * It is responsible to insert the correct CSS code. It contains the CSSReader
 * to get the current media descriptor and the UserProfile to get the current user preferences
 */
export class CSSCodeParser implements ICodeParser {
    private userProfile: Profile.IUserPreferenceProfile;
    private cssReader: IReader<IMediaDescriptor>;
    private styleId = "common-terms-media-queries";


    constructor(userPreferenceProfile: Profile.IUserPreferenceProfile, cssReader: IReader<IMediaDescriptor>) {
        this.cssReader = cssReader;
        this.userProfile = userPreferenceProfile;
    }

    /**
     * Inserts the CSS code into the page.
     * First the inserted CSS code is reset and then a new CSS code is created and inserted.
     */
    parse(): void {
        this.resetCSSCode();
        let cssCode = this.createCSSCode();
        this.parseCSSCode(cssCode);
    }

    /**
     * Creates the appropriate CSS code by evaluating user preferences and media descriptors.
     *
     * @returns string
     */
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

        let cssString = this.createCSSVariables() + cssStyle.join("\n");
        return cssString;

    }

    /**
     * Inserts the CSS code into the page.
     *
     * @param cssCode: string
     */
    private parseCSSCode(cssCode: string): void {
        const style = document.createElement('style');
        style.setAttribute("id", this.styleId);
        style.innerHTML = cssCode;
        document.head.appendChild(style);
    }

    /**
     * Resets the CSS code of the page
     */
    private resetCSSCode(): void {
        const style = document.getElementById(this.styleId);
        if(style != null){
            style.remove();
        }

    }

    /**
     * Creates CSS Variables
     *
     * @returns string
     */
    private createCSSVariables(): string {
        const variables = ["--audio-description-enabled: " + this.userProfile.getValueForMediaFeature(CommonTerm.audioDescriptionEnabled),
            "--captions-enabled: " + this.userProfile.getValueForMediaFeature(CommonTerm.captionsEnabled),
            "--self-voicing-enabled: " + this.userProfile.getValueForMediaFeature(CommonTerm.selfVoicingEnabled),
            "--session-timeout: " + this.userProfile.getValueForMediaFeature(CommonTerm.sessionTimeout),
            "--extended-session-timeout: " + this.userProfile.getValueForMediaFeature(CommonTerm.extendedSessionTimeout),
            "--sign-language: " + this.userProfile.getValueForMediaFeature(CommonTerm.signLanguage),
            "--sign-language-enabled: " + this.userProfile.getValueForMediaFeature(CommonTerm.signLanguageEnabled),
            "--table-of-contents: " + this.userProfile.getValueForMediaFeature(CommonTerm.tableOfContents),
            "--display-skiplinks: " + this.userProfile.getValueForMediaFeature(CommonTerm.displaySkiplinks),];

        let pseudoRootClass = ":root {\n"
        for (let i = 0; i < variables.length; i++) {
            pseudoRootClass = pseudoRootClass + "   " + variables[i] + ";\n"
        }
        return pseudoRootClass + "}\n\n"
    }
}
