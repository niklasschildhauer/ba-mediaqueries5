// import { Manager } from "./coordinator/Manager";
//
// window.onload = () => {
//     let coordinator = new Manager();
// }

import * as Coordinator from './coordinator/ScriptCoordinator';
import * as CSSReader from './reader/CSSReader';
import * as View from './view/UserPreferenceViewController'

console.log("Test");

let manager: Coordinator.ScriptCoordinator = new Coordinator.ScriptCoordinator();
console.log("Hallo");

let reader: CSSReader.CSSReader = new CSSReader.CSSReader()

