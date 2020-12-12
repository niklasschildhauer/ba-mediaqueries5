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
