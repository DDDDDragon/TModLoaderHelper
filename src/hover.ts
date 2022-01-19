import * as vscode from 'vscode';
import * as fs from 'fs-extra';
import * as path from 'path';
import { Range } from 'vscode';

export function pushHover(hoverText: string, hoverTarget: string, context: vscode.ExtensionContext)
{
    context.subscriptions.push(vscode.languages.registerHoverProvider("csharp", {
        provideHover(document, position, token)
        {
            const word = document.getText(document.getWordRangeAtPosition(position));
            if(hoverTarget == word) return new vscode.Hover(hoverText);
            //if(new RegExp(`^${hoverTarget}`).test(word))
            //{
                //return new vscode.Hover(hoverText);
            //}
        }
    }));
}

export function activate(context: vscode.ExtensionContext) 
{
}