/**
 * Helper method
 *
 * @param  string: string
 * @returns the string without whitespaces
 */

export function removeWhitespaceFrom(string: string): string {
    return string.replace(/\s/g, '');
}

/**
 * Helper method
 *
 * @param string: string
 * @param substring: string
 * @returns the string without the substring
 */
export function removeSubstringFrom(string: string, substring: string): string {
    return string.replace(substring, '');
}

/**
 * Helper method
 *
 * @param  text: string
 * @returns the text without unimportant Characters like \" and \ and " and '
 */
export function removeUnimportantCharactersFrom(string: string): string {
    let result = removeWhitespaceFrom(string);
    result = removeSubstringFrom(result, '\"');
    result = removeSubstringFrom(result, '\'');
    result = removeSubstringFrom(result, '"');
    result = removeSubstringFrom(result, "'");

    return result;
}

/**
 * Helper method
 *
 * @param  text: string
 * @param  firstBracket: string
 * @param  lastBracket: string
 * @returns the text in between the brackets
 */
export function getTextBetweenBrackets(text: string, firstBracket: string, lastBracket: string) : string {
    let string = text.slice(text.indexOf(firstBracket) + 1) ; // delete first bracket

    let openBracketsCount = 1;
    for (var i = 0; i < string.length; i++) {
        if (string.charAt(i) === firstBracket) {
            openBracketsCount = openBracketsCount + 1;
        }
        if (string.charAt(i) === lastBracket) {
            openBracketsCount = openBracketsCount - 1;
        }
        if(openBracketsCount === 0) {
            return string.slice(0, i);
        }
    }
    return string
}

/**
 * Helper method
 *
 * @param  object enum
 * @returns the keys of an enum
 */
export function enumKeys<O extends object, K extends keyof O = keyof O>(obj: O): K[] {
    return Object.keys(obj).filter(k => Number.isNaN(+k)) as K[];
}