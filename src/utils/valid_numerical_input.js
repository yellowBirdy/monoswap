// for time being reformatting to have at least one decimal as a work around UFix64 bug
export default (amount) => amount !== "." && Number.isNaN(Number(amount)) ? false : true   // if emtpy 