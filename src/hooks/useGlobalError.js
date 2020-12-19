import {useState, useEffect} from "react"
import flowDataService from "../flow/flowDataService"


export default () => {
    const [err, setErr] = useState(null)
    const clearErr = ()=>setErr(null)
    useEffect(()=>{
        flowDataService.subscribe("error", err=>setErr("Flow Error: "+err))
    },[])
    useEffect(()=>{
        setTimeout(clearErr, 10000)
    },[err])

    return [err, setErr, clearErr]
}