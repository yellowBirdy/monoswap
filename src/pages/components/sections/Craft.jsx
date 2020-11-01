import React, {useState} from "react"
import { Tab, Table, Button, Card } from "semantic-ui-react"

import {mintCombination} from "../../../flow/actions/"

const itemsAnte = [{
    "name": "Alpha-Omega NRG Cell",
    "category": "energy",
    "consumable": "T",
    "power_level": "8889",
    "rarity": "common",
}, {
    "name": "Alpha-Omega NRG Generator Template",
    "consumable": "F",
    "category": "energy",
    "power_level": "8889",
    "rarity": "common",
},{
    "name": "Green Lasecannon Construction Kit",
    "category": "weapon",
    "consumable": "T",
    "power_level": "9001",
    "rarity": "epic",
}]
const itemsPost = [{
        "name": "Alpha-Omega NRG Generator Template",
        "consumable": "F",
        "category": "energy",
        "power_level": "8889",
        "rarity": "common",
    },{
        "name": "Green Lasecannon Construction Kit",
        "category": "weapon",
        "consumable": "T",
        "power_level": "9001",
        "rarity": "epic",
    },{
        "name": "Alpha-Omega NRG Generator",
        "category": "energy",
        "consumable": "T",
        "power_level": ">9000",
        "rarity": "common",
}]

export default ({forms}) => {
    const [tokens, setTokens] = useState(itemsAnte)
    const [combination, setCombination] = useState(null)
    const [loot, setLoot] = useState([])
    const {Pane} = Tab

    const cb = () => {
        setTimeout(()=>{
            alert(`Crafting successful!
            received: ${forms[2].name}`) 
            setLoot([forms[2]])
            setTokens(itemsPost)
        }, 2000)
    }
    

    const onClick = (e)=>{
        e.preventDefault()
        mintCombination({ingredientIds:[4,1], cb})
    }
    return (
        <Pane>
            Produce better equipment and subprotudcs (cooperative crafting comming soon)!

            <Table celled>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell colSpan='2'>Inventory</Table.HeaderCell>
                    </Table.Row>
                    <Table.Row>
                        <Table.HeaderCell>Item</Table.HeaderCell>
                        <Table.HeaderCell>Category</Table.HeaderCell>
                        <Table.HeaderCell>Consumable</Table.HeaderCell>
                        <Table.HeaderCell>Power Level</Table.HeaderCell>
                        <Table.HeaderCell>Rarity</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                {tokens.map(token=> <Table.Row>
                    <Table.Cell>{token.name}</Table.Cell>
                    <Table.Cell>{token.category}</Table.Cell>
                    <Table.Cell>{token.consumable === "T"? "yes": "no"}</Table.Cell>
                    <Table.Cell>{token.power_level}</Table.Cell>
                    <Table.Cell>{token.rarity}</Table.Cell>
                </Table.Row>
                )}
                {/*<Table.Row>
                    <Table.Cell>Alpha-Omega NRG Generator Template</Table.Cell>
                    <Table.Cell>energy</Table.Cell>
                    <Table.Cell>not</Table.Cell>
                    <Table.Cell>common</Table.Cell>
                </Table.Row>
                <Table.Row>
                    <Table.Cell>Alpha-Omega NRG Cell</Table.Cell>
                    <Table.Cell>energy</Table.Cell>
                    <Table.Cell>yes</Table.Cell>
                    <Table.Cell>common</Table.Cell>
                </Table.Row>
                <Table.Row>
                    <Table.Cell>Green Lasecannon construction kit</Table.Cell>
                    <Table.Cell>weapon</Table.Cell>
                    <Table.Cell>yes</Table.Cell>
                    <Table.Cell>epic</Table.Cell>
                </Table.Row>*/}

                </Table.Body>
            </Table>
            <Table celled>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell colSpan='2'>Available for crafting</Table.HeaderCell>
                    </Table.Row>
                    <Table.Row>
                        <Table.HeaderCell>Item</Table.HeaderCell>
                        <Table.HeaderCell>Ingredients</Table.HeaderCell>
                        <Table.HeaderCell>Consuming</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                <Table.Row onClick={e=>setCombination("Alpha-Omega NRG Generator")}>
                    <Table.Cell>Alpha-Omega NRG Generator</Table.Cell>
                    <Table.Cell>Alpha-Omega NRG Generator Template, Alpha-Omega NRG Cell</Table.Cell>
                    <Table.Cell>Alpha-Omega NRG Cell</Table.Cell>
                </Table.Row>
        
        
                </Table.Body>
            </Table>
             <Button onClick={onClick}>Start crafting {combination || "nothing"}</Button>
            
            {loot.length? loot.map(piece=>
                <Card key={piece.id}
                    header={piece.name}
                    description={Object.entries(piece).map(([key,val])=><p key={val}><b>{`${key}:  `}</b>{val}</p>)}
                />)
                : null}
                
        </Pane> 
    )
}