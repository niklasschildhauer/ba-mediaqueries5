import * as Factory from './Factory'
import * as Model from './Model'
import {CommonTerm} from './Model'

test('Media Feature Factory - createMediaFeatureFrom #1', () => {
    let factoryModel = Factory.MediaFeatureFactory.createMediaFeatureFrom("(displaySkiplinks: true)");
    let model = new Model.MediaFeature(CommonTerm.displaySkiplinks, false, "true")
    expect(factoryModel.mediaFeature).toBe(model.mediaFeature);
    expect(factoryModel.negated).toBe(model.negated);
    expect(factoryModel.value).toBe(model.value);
});

test('Media Feature Factory - createMediaFeatureFrom #2', () => {
    expect(function() {
        Factory.MediaFeatureFactory.createMediaFeatureFrom("(picto: true)");
    }).toThrow(new Error('There is no matching common term.'));
});

test('Media Feature Factory - createMediaFeatureFrom #3', () => {
    let factoryModel = Factory.MediaFeatureFactory.createMediaFeatureFrom('(signLanguage: "dgs")');
    let model = new Model.MediaFeature(CommonTerm.signLanguage, false, "dgs")
    expect(factoryModel.mediaFeature).toBe(model.mediaFeature);
    expect(factoryModel.negated).toBe(model.negated);
    expect(factoryModel.value).toBe(model.value);
});

test('Media Feature Factory - createMediaFeatureFrom #3.1', () => {
    let factoryModel = Factory.MediaFeatureFactory.createMediaFeatureFrom('(signLanguage: dgs)');
    let model = new Model.MediaFeature(CommonTerm.signLanguage, false, "dgs")
    expect(factoryModel.mediaFeature).toBe(model.mediaFeature);
    expect(factoryModel.negated).toBe(model.negated);
    expect(factoryModel.value).toBe(model.value);
});

test('Media Feature Factory - createMediaFeatureFrom #3.2', () => {
    let factoryModel = Factory.MediaFeatureFactory.createMediaFeatureFrom("(signLanguage: 'dgs')");
    let model = new Model.MediaFeature(CommonTerm.signLanguage, false, "dgs")
    expect(factoryModel.mediaFeature).toBe(model.mediaFeature);
    expect(factoryModel.negated).toBe(model.negated);
    expect(factoryModel.value).toBe(model.value);
});

test('Media Feature Factory - createMediaFeatureFrom #4', () => {
    let factoryModel = Factory.MediaFeatureFactory.createMediaFeatureFrom('not (signLanguageEnabled: false)');
    let model = new Model.MediaFeature(CommonTerm.signLanguage, true, "false")
    expect(factoryModel.mediaFeature).toBe(model.mediaFeature);
    expect(factoryModel.negated).toBe(model.negated);
    expect(factoryModel.value).toBe(model.value);
});

