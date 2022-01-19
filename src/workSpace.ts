import * as vscode from 'vscode';
import { TextDocument } from 'vscode';
import * as fs from 'fs-extra';
import * as path from 'path';

export var ModName = "";

export function setWorkSpace(){
    const xxx = vscode.workspace.name;
    if(vscode.workspace.workspaceFolders !== undefined) {
        const wf = vscode.workspace.workspaceFolders[0].uri.path.replace("/c:","C:").replace("/d:","D:").replace("/e:","E:");
        const files = fs.readdirSync(wf);
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

function cout(text: string)
{
    console.log(text);
}