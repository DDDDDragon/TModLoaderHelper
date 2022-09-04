import * as vscode from 'vscode';
import { TextDocument } from 'vscode';
import * as fs from 'fs-extra';
import * as path from 'path';
import { strArr } from './data';
import * as data from './data';
import { ItemNode } from './itemViewProvider';
import { stat } from 'fs';

export var ModName = "";

export var ItemsData: ItemNode[] = [];
export var ItemsDataUpdate: ItemNode[] = [];

export function updateView()
{
    ItemsData = ItemsDataUpdate;
}
export function setWorkSpace(){
    const xxx = vscode.workspace.name;
    if(vscode.workspace.workspaceFolders !== undefined) {
        const wf = vscode.workspace.workspaceFolders[0].uri.path.replace("/c:","C:").replace("/d:","D:").replace("/e:","E:");
        const files = fs.readdirSync(wf);
        getFiles(wf);
        for (let fileName of files)
        {
            const filePath = path.join(wf,fileName);
            if(fileName == "build.txt")
            {
                const text = fs.readFileSync(filePath, "utf-8");
                let str = "displayName";
                let index = text.indexOf(str);
                let ind2 = index;
                while(text[index] != "\n") index++;
                var modName: string = text.substring(ind2, index).replace(str, "").replace("=", "").replace(/ /g,"");
                ModName = modName;
            }
        }
    }
}
function getFiles(folderPath: string)
{
    var files = fs.readdirSync(folderPath);
    for(let fileName of files)
    {
        var filePath = path.join(folderPath, fileName).replace(/\\/g,"/");
        var stats = fs.statSync(filePath);
        var isDir = stats.isDirectory();
        var iscsFile = stats.isFile() && fileName.includes(".cs");
        if(isDir)
        {
            getFiles(filePath);
        }
        if(iscsFile) 
        {
            var text = fs.readFileSync(filePath, "utf-8").replace(/\t/g, "    ");
            var strItem = /public class (.*):.*ModItem/;
            if(text.match(strItem))
            {
                var name = (text.match(strItem) as RegExpMatchArray)[1];
                var findIndex = (text.match(strItem) as RegExpMatchArray)[0];
                var strItem2: RegExp =  new RegExp(`public class ${name}.*:.*ModItem\\s*?\\{([\\s\\S]*?)\\n    \\}`);
                var textItem = (text.match(strItem2) as RegExpMatchArray)[0];
                var IsItemDefault = /public override void SetDefaults\(\).*?\s*?.*?\{\s*?([\s\S]*?)\}/;
                var IsItemStaticDefault = /public override void SetStaticDefaults\(\).*?\s*?.*?\{\s*?([\s\S]*?)\}/;
                var itemDefault = "";
                var itemStaticDefault = "";
                if(textItem.match(IsItemDefault)) itemDefault = (textItem.match(IsItemDefault) as RegExpMatchArray)[1];
                if(textItem.match(IsItemStaticDefault)) itemStaticDefault = (textItem.match(IsItemStaticDefault) as RegExpMatchArray)[1];
                const result = vscode.workspace.getConfiguration().get('tmodloaderhelper.itemTranslationSetting') as string;
                switch(result)
                {
                    case "中文":
                        var trans = ChineseTrans(itemDefault, itemStaticDefault);
                        itemDefault = trans[0];
                        itemStaticDefault = trans[1];
                        if(trans[2] != "") name = trans[2];
                        break;
                    case "English":
                        break;
                }
                var def = (itemDefault + itemStaticDefault).split("\n");
                var child: ItemNode[] = [];
                if(def.length > 0)
                {
                    for(var a of def)
                    {
                        var node = new ItemNode("", "", a, vscode.TreeItemCollapsibleState.None);
                        child.push(node);
                    }
                }
                //cout(itemStaticDefault as string)
                var IN = new ItemNode(filePath, findIndex, name, vscode.TreeItemCollapsibleState.Collapsed, child);
                ItemsData.push(IN);
                ItemsDataUpdate.push(IN);
            }
        }
    }
}
function ChineseTrans(itemDefaults: string, itemStaticDefaults: string): string[]
{        
    var dadad = /DisplayName\.AddTranslation\(GameCulture\.Chinese,.*?"(.*?)"\)/;
    var name = "";
    if(itemStaticDefaults.match(dadad)) name = (itemStaticDefaults.match(dadad) as RegExpMatchArray)[1];
    var val = /item\.value.*?=.*?([0-9]*?);/
    var value = "";
    if(itemDefaults.match(val)) value = getValue((itemDefaults.match(val) as RegExpMatchArray)[1]);
    var defaults = itemDefaults
    .replace("item.width","物品贴图宽度")
    .replace("item.height","物品贴图高度")
    .replace("item.damage","物品伤害")
    .replace("item.useAnimation","物品单击一次消耗的帧数")
    .replace("item.useTime","物品使用一次消耗的帧数")
    .replace("base.SetDefaults()","")
    .replace(/item\.value.*?=.*?([0-9]*?);/, "价值: " + value)
    .replace(/item.CloneDefaults\(ItemID\.(.*?)\)/, "复制属性: $1")
    .replace(/\s/g,"").replace(/=/g,": ").replace(/;/g,"\n")
    defaults = ChineseSet(defaults)
    var staticDefaults = itemStaticDefaults
    .replace("base.SetStaticDefaults()","")
    .replace(/DisplayName\.SetDefault\((.*?)\)/, "内部名称: $1").replace(/\"/g,"")
    .replace(/DisplayName\.AddTranslation\(GameCulture\.Chinese,.*?"(.*?)"\)/,"中文译名: $1")
    .replace(/\s/g,"").replace(/=/g,": ").replace(/;/g,"\n")
    var Trans: string[] = [defaults, staticDefaults, name];
    return Trans;
}
function getValue(value: string): string
{
    var valueSum = Number.parseInt(value);
    var str = "";
    var BNum = 0, GNum = 0, SNum = 0, CNum = 0;
    if (valueSum >= 1000000)
    {
        BNum = Math.floor(valueSum / 1000000);
        valueSum %= 1000000;
    }
    if (valueSum >= 10000)
    {
        GNum = Math.floor(valueSum / 10000);
        valueSum %= 10000;
    }
    if (valueSum >= 100)
    {
        SNum = Math.floor(valueSum / 100);
        valueSum %= 100;
    }
    CNum = valueSum;
    if(BNum != 0) str += BNum.toString() + "铂金币";
    if(GNum != 0) str += GNum.toString() + "金币";
    if(SNum != 0) str += SNum.toString() + "银币";
    if(CNum != 0) str += CNum.toString() + "铜币";
    return str;
}
function ChineseSet(text: string): string
{
    return text
    .replace("item.useStyle: 1","使用方式: 挥动");
}
function cout(text: string)
{
    console.log(text);
}