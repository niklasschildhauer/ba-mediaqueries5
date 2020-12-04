import * as Model from './Model'

test('Common Term Util - containsCommonTermMediaFeature #1', () => {
    let result = Model.CommonTermUtil.containsCommonTermMediaFeature("(displaySkiplinks: true)")
    expect(result[0]).toBe(true);
    expect(result[1]).toBe(Model.CommonTerm.displaySkiplinks);
});

test('Common Term Util - containsCommonTermMediaFeature #2', () => {
    let result = Model.CommonTermUtil.containsCommonTermMediaFeature("(displaySkipnks: true)")
    expect(result[0]).toBe(false);
    expect(result[1]).toBe(null);
});

test('Common Term Util - containsCommonTermMediaFeature #3', () => {
    let result = Model.CommonTermUtil.containsCommonTermMediaFeature("(pictogramsEnabled: false)")
    expect(result[0]).toBe(true);
    expect(result[1]).toBe(Model.CommonTerm.pictogramsEnabled);
});

test('Common Term Util - containsCommonTermMediaFeature #4', () => {
    let result = Model.CommonTermUtil.containsCommonTermMediaFeature("not (pictogramsEnabled: true)")
    expect(result[0]).toBe(true);
    expect(result[1]).toBe(Model.CommonTerm.pictogramsEnabled);
});

test('Common Term Util - containsCommonTermMediaFeature #5', () => {
    let result = Model.CommonTermUtil.containsCommonTermMediaFeature('not (signLanguage: "fsl")')
    expect(result[0]).toBe(true);
    expect(result[1]).toBe(Model.CommonTerm.signLanguage);
});

test('Common Term Util - containsCommonTermMediaFeature #5', () => {
    let result = Model.CommonTermUtil.containsCommonTermMediaFeature('(audioDescriptionEnabled)')
    expect(result[0]).toBe(true);
    expect(result[1]).toBe(Model.CommonTerm.audioDescriptionEnabled);
});