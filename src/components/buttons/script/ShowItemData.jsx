import React, {useState} from "react"     

import {getItemData} from "../../../flow/actions"


export default () => {
    const [formId, setFormId] = useState(0)
    const [formData, setFormData] = useState({})

    const getData =  () => getItemData({formId})

    return <div>
        <button onClick={async () => setFormData(await getData())}>Show Form Data</button>
        <label> 
            Form Id
            <input type="text" value={formId} onChange={e=>{
                setFormData({})
                setFormId(e.target.value)
                }} ></input>
        </label>
            <p>Form# {formId} posseses following fields: {JSON.stringify(formData, null, 4)} </p>
    </div>
}