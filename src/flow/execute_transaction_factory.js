import * as fcl from "@onflow/fcl"
import loadCode from "../utils/prepare_cadence_code"
import flowDataService from "./flowDataService"
import {statusToState} from "../utils"

export default async (url, match) => {

  const code = await loadCode(url, match);
  return function (args = []) {

    return fcl.send(
      [
        fcl.transaction(code),
        fcl.args(args),
        fcl.proposer(fcl.currentUser().authorization),
        fcl.payer(fcl.currentUser().authorization),
        fcl.authorizations([fcl.currentUser().authorization]),
        fcl.limit(200)
      ]
    ).then(txResponse => {
      return fcl.decode(txResponse)
    })
    .then(tx => {
      flowDataService.fireEvent("txStatus", [{id: tx, state: "Sent"}])
      return tx
    })
    .then(function (tx)  {
      const handler = (function (id) { 
        return function (txStatus)  {
          let {events, erroMessage, status, statusCode} = txStatus

          if (statusCode !== 0) flowDataService.fireEvent("error", [txStatus.errorMessage])
          let statusEventPayload = {
            id,
            error: !!erroMessage ? erroMessage: null,
            events: events.length > 0 ? events : null,
            state: statusCode === 0 ? statusToState(status) : "Error",
            status: statusCode
          }
          flowDataService.fireEvent("txStatus", [statusEventPayload])     
        }
      })(tx)

      fcl.tx(tx).subscribe(handler)
      return tx
    })
    .catch(err => {
      flowDataService.fireEvent("error", [err.message])
    });
  };
};