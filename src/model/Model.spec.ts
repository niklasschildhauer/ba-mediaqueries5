import * as Model from './Model'

test('Common Term Util - containsCommonTermMediaFeature #1', () => {
    let result = Model.CommonTermUtil.containsCommonTermMediaFeature("(display-skiplinks: true)")
    expect(result[0]).toBe(true);
    expect(result[1]).toBe(Model.CommonTerm.displaySkiplinks);
});

test('Common Term Util - containsCommonTermMediaFeature #2', () => {
    let result = Model.CommonTermUtil.containsCommonTermMediaFeature("(display-skipnks: true)")
    expect(result[0]).toBe(false);
    expect(result[1]).toBe(null);
});

test('Common Term Util - containsCommonTermMediaFeature #3', () => {
    let result = Model.CommonTermUtil.containsCommonTermMediaFeature("(pictograms-enabled: false)")
    expect(result[0]).toBe(true);
    expect(result[1]).toBe(Model.CommonTerm.pictogramsEnabled);
});

test('Common Term Util - containsCommonTermMediaFeature #4', () => {
    let result = Model.CommonTermUtil.containsCommonTermMediaFeature("not (pictograms-enabled: true)")
    expect(result[0]).toBe(true);
    expect(result[1]).toBe(Model.CommonTerm.pictogramsEnabled);
});

test('Common Term Util - containsCommonTermMediaFeature #5', () => {
    let result = Model.CommonTermUtil.containsCommonTermMediaFeature('not (sign-language: "fsl")')
    expect(result[0]).toBe(true);
    expect(result[1]).toBe(Model.CommonTerm.signLanguage);
});

test('Common Term Util - containsCommonTermMediaFeature #5', () => {
    let result = Model.CommonTermUtil.containsCommonTermMediaFeature('(audio-description-enabled)')
    expect(result[0]).toBe(true);
    expect(result[1]).toBe(Model.CommonTerm.audioDescriptionEnabled);
});