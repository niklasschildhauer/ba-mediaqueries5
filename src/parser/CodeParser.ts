/**
 * @interface ICodeParser
 *
 * Defines Code Parser, which will be called when something has changed and
 * code needs to be parsed.
 */
export interface ICodeParser {
    parse(): void;
}

/**
 * @class CodeParser
 *
 * This class bundles all code parser. At the moment there are two: CSS Code parser and JS Code Parser
 */
export class CodeParser implements ICodeParser {
    private cssParser: ICodeParser
    private jsParser: ICodeParser


    constructor(jsVariableParser: ICodeParser, cssCodeParser: ICodeParser) {
        this.cssParser = cssCodeParser;
        this.jsParser = jsVariableParser;
    }
    /**
     * Is called when something changed and code needs to be parsed.
     */
    parse(): void {
        this.jsParser.parse();
        this.cssParser.parse();
    }

}
