import React from 'react'
import {Input} from "../styled"
import {install} from "../../flow/actions"

export default () => <Input type="submit" bordered onClick={install} value="Install Bitroot and LP vaults"></Input>  
