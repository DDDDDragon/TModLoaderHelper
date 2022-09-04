import * as fs from 'fs-extra';
import * as vscode from 'vscode';
import * as path from 'path';

export interface RegExpArr {
    [index: number]: RegExp;
    length: number;
    index: number;
    GetIndex(Reg: RegExp): number;
    Add(Reg: RegExp): void;
    [Symbol.iterator](): IteratorInterface;
}
export interface IteratorInterface {
    next: () => {
        value: RegExp
        done: boolean
        index: number
    }
}
function createIterator(array: RegExpArr): IteratorInterface {
    let index = 0;
    let length = array.length;
    return {
        next: function () {
            return index < length ? {value: array[index++], done: false, index: index} : {value: new RegExp(``), done: true, index: index};
        }
    }
}
export function compareRegExp(Object1: RegExp, Object2: RegExp): boolean
{
    return Object1 == Object2;
}
export const RegExps1·3: RegExpArr = {
    Add: function (Reg: RegExp): void {
        this[this.length] = Reg;
        this.length++;
    },
    length: 0,
    index: 0,
    [Symbol.iterator](): IteratorInterface {
        return createIterator(this);
    },
    GetIndex: function (Reg: RegExp): number {
        if(Object.keys(this).find(k => compareRegExp(this[+k], Reg)) != undefined)
        {
            return Number(Object.keys(this).find(k => compareRegExp(this[+k], Reg)));
        }
        return -1;
    }
};

export const RegExps1·4: RegExpArr = {
    Add: function (Reg: RegExp): void {
        this[this.index] = Reg;
        this.index++;
    },
    index: 0,
    length: 0,
    [Symbol.iterator](): IteratorInterface {
        return createIterator(this);
    },
    GetIndex: function (Reg: RegExp): number {
        if(Object.keys(this).find(k => compareRegExp(this[+k], Reg)) != undefined)
        {
            return Number(Object.keys(this).find(k => compareRegExp(this[+k], Reg)));
        }
        return -1;
    }
};
export function ChangeVersion() 
{
    if(vscode.workspace.workspaceFolders !== undefined) 
    {
        const wf = vscode.workspace.workspaceFolders[0].uri.path.replace("/c:","C:").replace("/d:","D:").replace("/e:","E:");
        const files = fs.readdirSync(wf);
        for(let fileName of files)
        {
            var filePath = path.join(wf, fileName).replace(/\\/g,"/");
            console.log(filePath);
            var stats = fs.statSync(filePath);
            var isDir = stats.isDirectory();
            var iscsFile = stats.isFile() && fileName.includes(".cs");
            if(isDir) SetFiles(filePath);
            else if(iscsFile)
            {
                var text = fs.readFileSync(filePath, "utf-8").replace(/\t/g, "    ");
                for(let regExp of RegExps1·3)
                {
                    var index: number;
                    if(RegExps1·3.GetIndex(regExp) != -1) 
                    {
                        index = RegExps1·3.GetIndex(regExp);
                        let regExp2: RegExp = RegExps1·4[index]; 
                        var $ = regExp.exec(text);
                        if(regExp2 != undefined) 
                        {
                            var source = regExp2.source;
                            if($ != null) 
                            {
                                if(index == 3) text = "using Terraria.Audio;\n" + text;
                                for(let i: number = 0; i < 10; i++) source = source.replace('$' + i, $[i]);
                            }
                            text = text.replace(regExp, source);
                            
                        }	
                    }
                }
                fs.writeFileSync(filePath, text);
            }
        }
        console.log("OK");
	}
}
function SetFiles(folderPath: string)
{
    var files = fs.readdirSync(folderPath);
    for(let fileName of files)
    {
        var filePath = path.join(folderPath, fileName).replace(/\\/g,"/");
        console.log(filePath);
        var stats = fs.statSync(filePath);
        var isDir = stats.isDirectory();
        var iscsFile = stats.isFile() && fileName.includes(".cs");
        if(isDir) SetFiles(filePath);
        else if(iscsFile)
        {
            var text = fs.readFileSync(filePath, "utf-8").replace(/\t/g, "    ");
                for(let regExp of RegExps1·3)
                {
                    var index: number;
                    if(RegExps1·3.GetIndex(regExp) != -1) 
                    {
                        index = RegExps1·3.GetIndex(regExp);
                        let regExp2: RegExp = RegExps1·4[index]; 
                        var $ = regExp.exec(text);
                        if(regExp2 != undefined) 
                        {
                            var source = regExp2.source;
                            if($ != null) 
                            {
                                if(index == 3) text = "using Terraria.Audio;\n" + text;
                                for(let i: number = 0; i < 10; i++) source = source.replace('$' + i, $[i]);
                            }
                            text = text.replace(regExp, source);
                            
                        }	
                    }
                }
            fs.writeFileSync(filePath, text);
        }
    }
}
async function Load1·3() {
    var re0: RegExp = new RegExp(`item\.`,"g"); RegExps1·3.Add(re0);
    var re0: RegExp = new RegExp(`ModRecipe`,"g"); RegExps1·3.Add(re0);
    var re0: RegExp = new RegExp(`meleeDamage`,"g"); RegExps1·3.Add(re0);
    var re0: RegExp = new RegExp(`Main.itemTexture\\\[([^\\\]]*)\\\]`,"g"); RegExps1·3.Add(re0);
    var re0: RegExp = new RegExp(`ModContent\\\.GetTexture\\\(([^)]+\).`,"g"); RegExps1·3.Add(re0);
    var re0: RegExp = new RegExp(`Terraria\.World\.Generation`,"g"); RegExps1·3.Add(re0);
    var re0: RegExp = new RegExp(`Main\.PlaySound`,"g"); RegExps1·3.Add(re0);
    var re0: RegExp = new RegExp(`Main\.font\(\\w+\)`,"g"); RegExps1·3.Add(re0);
    var re0: RegExp = new RegExp(`Main\.itemLockoutTime`,"g"); RegExps1·3.Add(re0);
    var re0: RegExp = new RegExp(`Main\.dresserX`,"g"); RegExps1·3.Add(re0);
    var re0: RegExp = new RegExp(`Main\.dresserY`,"g"); RegExps1·3.Add(re0);
    var re0: RegExp = new RegExp(`Main\.quickBG`,"g"); RegExps1·3.Add(re0);
    var re0: RegExp = new RegExp(`Main\.SmartCursorEnabled`,"g"); RegExps1·3.Add(re0);
    var re0: RegExp = new RegExp(`Main\.tileValue`,"g"); RegExps1·3.Add(re0);
    var re0: RegExp = new RegExp(`Main\.worldRate`,"g"); RegExps1·3.Add(re0);
    var re0: RegExp = new RegExp(`NPCID\.Sets\.TechnicallyABoss`,"g"); RegExps1·3.Add(re0);
    var re0: RegExp = new RegExp(`ProjectileID\.Sets\.Homing`,"g"); RegExps1·3.Add(re0);
    var re0: RegExp = new RegExp(`Lighting\.lightMode`,"g"); RegExps1·3.Add(re0);
    var re0: RegExp = new RegExp(`Localization\.GameCulture\.`,"g"); RegExps1·3.Add(re0);
    var re0: RegExp = new RegExp(`GameCulture\.(.*),`,"g"); RegExps1·3.Add(re0);
    var re0: RegExp = new RegExp(`Main\.maxInventory`,"g"); RegExps1·3.Add(re0);
    var re0: RegExp = new RegExp(`ID\.ItemUseStyleID\.SwingThrow`,"g"); RegExps1·3.Add(re0);
    var re0: RegExp = new RegExp(`ID\.ItemUseStyleID\.EatingUsing`,"g"); RegExps1·3.Add(re0);
    var re0: RegExp = new RegExp(`ID\.ItemUseStyleID\.Stabbing`,"g"); RegExps1·3.Add(re0);
    var re0: RegExp = new RegExp(`ID\.ItemUseStyleID\.HoldingUp`,"g"); RegExps1·3.Add(re0);
    var re0: RegExp = new RegExp(`ID\.ItemUseStyleID\.HoldingOut`,"g"); RegExps1·3.Add(re0);
}
async function Load1·4() {
    var re0: RegExp = new RegExp(`Item\.`,"g"); RegExps1·4.Add(re0);
    var re0: RegExp = new RegExp(`Recipe`,"g"); RegExps1·4.Add(re0);
    var re0: RegExp = new RegExp(`GetDamage<MeleeDamageClass>().Base`,"g"); RegExps1·4.Add(re0);
    var re0: RegExp = new RegExp(`GameContent.TextureAssets.Item[$1].Value`,"g"); RegExps1·4.Add(re0);
    var re0: RegExp = new RegExp(`ModContent.Request<Texture2D>($1).Value`,"g"); RegExps1·4.Add(re0);
    var re0: RegExp = new RegExp(`Terraria.WorldBuilding`,"g"); RegExps1·4.Add(re0);
    var re0: RegExp = new RegExp(`SoundEngine.PlaySound`,"g"); RegExps1·4.Add(re0);
    var re0: RegExp = new RegExp(`GameContent.FontAssets.$1.Value`,"g"); RegExps1·4.Add(re0);
    var re0: RegExp = new RegExp(`Main.timeItemSlotCannotBeReusedFor`,"g"); RegExps1·4.Add(re0);
    var re0: RegExp = new RegExp(`Main.interactedDresserTopLeftX`,"g"); RegExps1·4.Add(re0);
    var re0: RegExp = new RegExp(`Main.interactedDresserTopLeftY`,"g"); RegExps1·4.Add(re0);
    var re0: RegExp = new RegExp(`Main.instantBGTransitionCounter`,"g"); RegExps1·4.Add(re0);
    var re0: RegExp = new RegExp(`Main.SmartCursorIsUsed`,"g"); RegExps1·4.Add(re0);
    var re0: RegExp = new RegExp(`Main.tileOreFinderPriority`,"g"); RegExps1·4.Add(re0);
    var re0: RegExp = new RegExp(`Main.desiredWorldTilesUpdateRate`,"g"); RegExps1·4.Add(re0);
    var re0: RegExp = new RegExp(`NPCID.Sets.ShouldBeCountedAsBoss`,"g"); RegExps1·4.Add(re0);
    var re0: RegExp = new RegExp(`ProjectileID.Sets.CultistIsResistantTo`,"g"); RegExps1·4.Add(re0);
    var re0: RegExp = new RegExp(`Graphics.Light.LegacyLighting.Mode`,"g"); RegExps1·4.Add(re0);
    var re0: RegExp = new RegExp(`Localization.GameCulture.CultureName.`,"g"); RegExps1·4.Add(re0);
    var re0: RegExp = new RegExp(`GameCulture.FromCultureName(GameCulture.CultureName.$1),`,"g"); RegExps1·4.Add(re0);
    var re0: RegExp = new RegExp(`Main.InventorySlotsTotal`,"g"); RegExps1·4.Add(re0);
    var re0: RegExp = new RegExp(`ID.ItemUseStyleID.Swing`,"g"); RegExps1·4.Add(re0);
    var re0: RegExp = new RegExp(`ID.ItemUseStyleID.EatFood`,"g"); RegExps1·4.Add(re0);
    var re0: RegExp = new RegExp(`ID.ItemUseStyleID.Thrust`,"g"); RegExps1·4.Add(re0);
    var re0: RegExp = new RegExp(`ID.ItemUseStyleID.HoldUp`,"g"); RegExps1·4.Add(re0);
    var re0: RegExp = new RegExp(`ID.ItemUseStyleID.Shoot`,"g"); RegExps1·4.Add(re0);
}
Load1·3();
Load1·4();