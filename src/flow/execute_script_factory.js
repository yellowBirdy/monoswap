import * as fcl from "@onflow/fcl";
import * as sdk from "@onflow/sdk";

import loadCode from "../utils/prepare_cadence_code";

export default async (url, match) => {
  const code = await loadCode(url, match);

  return function (params = []) {
    return fcl.send(
      [
        sdk.script`${code}`,
        fcl.params(params),      
      ],
      {
        node: "http://localhost:8080"
      }
    );
  };
};