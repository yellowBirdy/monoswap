import * as fcl from "@onflow/fcl";
import * as sdk from "@onflow/sdk";
import * as types from "@onflow/types";
import loadCode from "../utils/prepare_cadence_code";

export default async (url, match) => {
  const user = fcl.currentUser();
  const { authorization } = user;
  const code = await loadCode(url, match);

  return fcl.send(
    [
      sdk.transaction`
          transaction {
            prepare(acct: AuthAccount) {
              acct.setCode("${(p) => p.code}".decodeHex())
            }
          }
        `,
      fcl.params([
        fcl.param(Buffer.from(code, "utf8").toString("hex"), types.Identity, "code"),
      ]),
      fcl.proposer(authorization),
      fcl.payer(authorization),
      fcl.authorizations([authorization]),
      fcl.limit(300)
    ],
    {
      node: "http://localhost:8080"
    }
  );
};