import * as Profile from "../user/UserPreferenceProfile";
import {IReader} from "../reader/CSSReader";
import {CommonTerm, IMediaDescriptor} from "../model/Model";
import {CSSCodeParser} from "./CSSCodeParser";
import {IUserPreferenceProfile} from "../user/UserPreferenceProfile";
import {JSVariableParser} from "./JSVariableParser";


export interface ICodeParser {
    parse(): void;
}

export class CodeParser implements ICodeParser {
    private cssParser: ICodeParser
    private jsParser: ICodeParser


    constructor(jsVariableParser: ICodeParser, cssCodeParser: ICodeParser) {
        this.cssParser = cssCodeParser;
        this.jsParser = jsVariableParser;
    }

    parse(): void {
        this.jsParser.parse();
        this.cssParser.parse();
    }

}
