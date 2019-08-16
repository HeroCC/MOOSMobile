import {MoosmailService} from './moosmail.service';

export class AppCast {
  procName: string;
  nodeName: string;
  timestamp: number;

  iterations: number;
  messages: string[] = [];
  configWarnings: string[] = [];

  numberRunWarnings: number;
  runWarnings: string[] = [];
  events: string[] = [];

  /**
   * This will turn a string into an AppCast object based on the steps found in MOOS Core's AppCast::string2AppCast(str)
   * @param appcastString The string you want to turn into an AppCast object
   * @return The newly created AppCast object
   */
  static stringToAppCast(appcastString: string): AppCast {
    let osep: string = "!@#";
    let isep: string = "!@";

    let ac: AppCast = new AppCast;

    let appcastMap = MoosmailService.parseString(appcastString, osep);
    ac.timestamp = Date.now();
    ac.procName = appcastMap.get("proc");
    ac.iterations = Number(appcastMap.get("iter"));
    ac.nodeName = appcastMap.get("node");
    if (appcastMap.has("messages")) ac.messages = appcastMap.get("messages").split(isep);
    if (appcastMap.has("config_warnings")) ac.configWarnings = appcastMap.get("config_warnings").split(isep);
    if (appcastMap.has("events")) ac.events = appcastMap.get("events").split(isep);
    if (appcastMap.has("run_warnings")) ac.runWarnings = appcastMap.get("run_warnings").split(isep);
    if (appcastMap.has("run_warning_total")) ac.numberRunWarnings = Number(appcastMap.get("run_warning_total"));

    return ac;
  }
}
