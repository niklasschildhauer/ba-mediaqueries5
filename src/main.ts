import * as Coordinator from './coordinator/ScriptCoordinator'


let manager: Coordinator.ScriptCoordinator = new Coordinator.ScriptCoordinator();


(window as any).MyNamespace = 23;
