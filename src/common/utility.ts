export function removeWhitespaceFrom(string: string): string {
    return string.replace(/\s/g, '');
}

export function removeSubstringFrom(string: string, substring: string): string {
    return string.replace(substring, '');
}

export function removeUnimportantCharactersFrom(string: string): string {
    let result = removeWhitespaceFrom(string);
    result = removeSubstringFrom(result, '\"');
    result = removeSubstringFrom(result, '\'');
    result = removeSubstringFrom(result, '"');
    result = removeSubstringFrom(result, "'");

    return result;
}

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

export function enumKeys<O extends object, K extends keyof O = keyof O>(obj: O): K[] {
    return Object.keys(obj).filter(k => Number.isNaN(+k)) as K[];
}