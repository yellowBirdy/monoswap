const STATUS_CODE_MAP = {
    0: "Unknown",
    1:"Pending",
    2:"Finalized",
    3:"Executed",
    4:"Sealed",
    5:"Expired"
} 
export default code => STATUS_CODE_MAP[code]