// for time being reformatting to have at least one decimal as a work around UFix64 bug
export default (amount) => amount.match(/\.\d/) ? amount :       //has at least one decimal
    amount.match(/\.$/) ? `${amount}0`   :                       //ends with a dot (typically after deleting from the "end")
    `${amount}.0`                                                  //no dot