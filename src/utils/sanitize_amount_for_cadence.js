// for time being reformatting to have at least one decimal as a work around UFix64 bug
export default (amount) => { 
    if (!amount || amount === ".") return "0.0"    // empty or just a dot
    if (amount.match(/^\./)) return `0${amount}`   // starts with dot

    return     amount.match(/\.\d/) ? amount :                  //has at least one decimal
    amount.match(/\.$/) ? `${amount}0`   :                      //ends with a dot (typically after deleting from the "end")
                         `${amount}.0`                          //no dot
}