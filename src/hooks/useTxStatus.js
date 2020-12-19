import {useState, useEffect} from "react"
import flowDataService from "../flow/flowDataService"


export default () => {
    const [status, setStatus] = useState({
        id: null,
        error: null,
        events: null,
        state: null
    })
    useEffect(()=>{
        flowDataService.subscribe("txStatus", setStatus)
    },[])

    return [status, setStatus]
}