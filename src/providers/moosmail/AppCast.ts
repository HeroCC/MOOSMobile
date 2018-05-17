import {MoosmailProvider} from "./moosmail";

export class AppCast {
  procName: string;
  nodeName: string;

  iterations: number;
  messages: string[];
  configWarnings: string[];

  runWarnings: string[] = [];
  events: string[];

  /**
   * This will turn a string into an AppCast object based on the steps found in MOOS Core's AppCast::string2AppCast(str)
   * @param {string} appcastString The string you want to turn into an AppCast object
   * @return {AppCast} The newly created AppCast object
   */
  static stringToAppCast(appcastString: string): AppCast {
    let osep: string = "!@#";
    let isep: string = "!@";

    let ac: AppCast = new AppCast;

    let appcastMap = MoosmailProvider.parseString(appcastString, osep);
    ac.procName = appcastMap.get("proc");
    ac.iterations = Number(appcastMap.get("iter"));
    ac.nodeName = appcastMap.get("node");
    if (appcastMap.has("messages")) ac.messages = appcastMap.get("messages").split(isep);
    if (appcastMap.has("config_warnings")) ac.configWarnings = appcastMap.get("config_warnings").split(isep);
    if (appcastMap.has("events")) ac.events = appcastMap.get("events").split(isep);
    if (appcastMap.has("run_warnings")) ac.runWarnings = appcastMap.get("run_warnings").split(isep);
    if (appcastMap.has("run_warning_total") && Number(appcastMap.get("run_warning_total")) != ac.runWarnings.length)
      console.warn("The number of run warnings reported doesn't match the number we have, there may be discrepancies");

    return ac;
  }
}
