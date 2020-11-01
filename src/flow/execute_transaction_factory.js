import * as fcl from "@onflow/fcl";
import * as sdk from "@onflow/sdk";
import loadCode from "../utils/prepare_cadence_code";

export default async (url, match) => {
  const user = fcl.currentUser();
  const { authorization } = user;
  const code = await loadCode(url, match);

  return function (args = []) {
    return fcl.send(
      [
        sdk.transaction`${code}`,
        fcl.args(args),
        fcl.proposer(authorization),
        fcl.payer(authorization),
        fcl.authorizations([authorization]),
        fcl.limit(200)
      ],
      {
        node: "http://localhost:8080"
      }
    );
  };
};