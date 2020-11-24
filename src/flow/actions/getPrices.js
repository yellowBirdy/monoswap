
import get_prices from "../cadence/scripts/get_prices.cdc";
import execute_script_factory from "../execute_script_factory"



export default async () => {
    const do_get_prices = await execute_script_factory(get_prices)
    return await do_get_prices()
}   