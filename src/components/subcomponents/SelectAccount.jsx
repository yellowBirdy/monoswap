import React from "react"

export default ({onChange, value}) => 
    <select onChange={onChange} value={value}>
        <option value=""></option>
        <option value="0x179b6b1cb6755e31">Contract Acc</option>
        <option value="0xf3fcd2c1a78f5eee">Some Guy or Gal</option>
    </select>
