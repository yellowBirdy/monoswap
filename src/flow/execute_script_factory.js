import * as fcl from "@onflow/fcl";
import loadCode from "../utils/prepare_cadence_code";
import flowDataService from "./flowDataService"

export default async (url, match) => {
  const code = await loadCode(url, match);
  return function (args = []) {
    return fcl.send(
      [
        fcl.script(code),
        fcl.args(args)     
      ]
    )
    .then(txResponse => {
      return fcl.decode(txResponse)
    })
    .catch(err => {
      flowDataService.fireEvent("error", [err.message])
    });
  };
};