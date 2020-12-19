import {useState, useEffect} from "react"

import {TOKEN_NAMES} from "../config"
import { getPrices} from '../flow/actions' 


export default (triggersOn = []) => {
    const [prices, setPrices] = useState([null, null])
    useEffect(()=>{        
        const updPrices = async ()=>{
            let latestPrices = await getPrices()
            setPrices([latestPrices[TOKEN_NAMES[1]], latestPrices[TOKEN_NAMES[0]]].map(Number))
        }
        updPrices()

    }, triggersOn)

    return prices
}