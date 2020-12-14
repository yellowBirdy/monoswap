import {ADDRESSES} from "../config"

const getAddress = tag => {
  switch (tag) {
    case "0xFUNGIBLETOKEN_ADDRESS":
      return ADDRESSES['FungibleToken'];
    case "0xBITROOT_ADDRESS":
      return ADDRESSES['Bitroot'];
    case "0xMONOSWAP_ADDRESS":
      return ADDRESSES['Monoswap'];
    case "0xFLOWTOKEN_ADDRESS":
        return ADDRESSES['FlowToken'];
  }
}

export default async (url, match) => {
    // match = {query: regexp, item1: replace1, ... itemN: replaceN}
    const codeFile = await fetch(url);
    const rawCode = await codeFile.text();
    //const addressedCode = rawCode;
    const addressedCode = rawCode.replace(
      /(0xFUNGIBLETOKEN_ADDRESS|0xBITROOT_ADDRESS|0xMONOSWAP_ADDRESS|0xFLOWTOKEN_ADDRESS)/g, 
      getAddress
    )
   
    if (!match) {
      return addressedCode;
    }
  
    const { query } = match;
    return addressedCode.replace(query, (item) => {
      return match[item];
    });
  };