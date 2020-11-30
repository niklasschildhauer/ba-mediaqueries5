// import { Manager } from "./manager/Manager";
//
// window.onload = () => {
//     let manager = new Manager();
// }

import * as Manager from './manager/Manager';
import * as View from './view/UserPreferenceViewController'

console.log("Test");

let manager: Manager.ManagerSingelton = new Manager.ManagerSingelton();
console.log("Hallo");
