import { loadavg } from 'os';
import { strArr } from './data';
export const NamesData: strArr = {};

async function Load() {
    const Names = await import('./Data')
    let data = Names.Data;
    for(let nameE in data)
    {
        NamesData[nameE] = data[nameE];
    }
}

Load()