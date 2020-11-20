import {useState, useEffect} from "react"

import {TOKEN_NAMES, LP_TOKEN_NAME} from "../config"
import { getAccBalances } from "../flow/actions"
import { useCurrentUser } from "."

export default (triggersOn = []) => {
    const currentUser = useCurrentUser()
    triggersOn.push(currentUser)

    const [balances, setBalances] = useState([null, null, null])

    useEffect( ()=>{
        if (!currentUser || !currentUser.addr) return
        const updBalances = async () => {
            let balancesObj = await getAccBalances({address: currentUser.addr}) 
            //balanes state is an array of tradable token balances which is used by the swap
            //but it also has balances available as fields on the 
            const balances = [balancesObj[TOKEN_NAMES[0]], balancesObj[TOKEN_NAMES[1]]]
            setBalances(Object.assign(balances, balancesObj))
        }
        updBalances()
    }, triggersOn)
    

    return balances
}