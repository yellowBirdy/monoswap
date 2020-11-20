import {useState, useEffect} from "react"
import * as fcl from "@onflow/fcl"

export default () => {
    const [currentUser, setCurrentUser] = useState(null)
    useEffect(()=>{
        fcl.currentUser()
            .subscribe(user=>setCurrentUser({...user}))
    },[])

    return currentUser
}