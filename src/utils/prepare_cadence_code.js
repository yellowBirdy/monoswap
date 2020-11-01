import {NFTStandardAddress, NFTAddress} from "../config"

const contractAddresses =   {
  "0xNFTStandardAddress": NFTStandardAddress,
  "0xNFTAddress": NFTAddress
}

export default async (url, match) => {
    // match = {query: regexp, item1: replace1, ... itemN: replaceN}
    const codeFile = await fetch(url);
    const rawCode = await codeFile.text();
    const addressedCode = rawCode.replace(
      /(0xNFTStandardAddress|0xNFTAddress)/g, 
      item => contractAddresses[item]
    )
  
    if (!match) {
      return addressedCode;
    }
  
    const { query } = match;
    return addressedCode.replace(query, (item) => {
      return match[item];
    });
  };