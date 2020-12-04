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