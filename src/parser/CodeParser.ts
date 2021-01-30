/**
 * @interface ICodeParser
 *
 * Defines code parser class, which will be called to parse the code.
 */
export interface ICodeParser {
    parse(): void;
}

/**
 * @class CodeParser
 *
 * Implements ICodeParser interface.
 * This class bundles all code parser. At the moment there are two: CSS code parser and JS code parser
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
