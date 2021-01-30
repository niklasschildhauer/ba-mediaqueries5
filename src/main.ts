import * as Coordinator from './coordinator/ScriptCoordinator'

/**
 * Creates the Script coordinator and makes is accessible via the JS window.
 */

const coordinator: Coordinator.IScriptCoordinator = new Coordinator.ScriptCoordinator();
(window as any).userPreferenceSettings = coordinator;



