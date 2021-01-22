import * as Coordinator from './coordinator/ScriptCoordinator'


const coordinator: Coordinator.IScriptCoordinator = new Coordinator.ScriptCoordinator();
(window as any).userPreferenceSettings = coordinator;



