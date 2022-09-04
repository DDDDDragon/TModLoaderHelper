// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as fs from 'fs-extra';
import { TMLUIEditor } from './ui';
import { ItemViewProvider } from './itemViewProvider';
import * as hover from './hover';
import { strArr } from './data';
import * as dictronary from './LoadItemNames';
import * as workspace from './workSpace';
import * as changeVersion from './changeVersion'
import { move } from 'fs-extra';
import { off } from 'process';
import * as init from './Init'

export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "tmodloaderhelper" is now active!');
	let disposable = vscode.commands.registerCommand('tmodloaderhelper.helloWorld', () => {
		vscode.window.showInformationMessage('Hello World from TModLoaderHelper!');
	});
	init.downloadNET();
	//let dd = vscode.commands.registerCommand('tmodloaderhelper.1·3=>1·4', () => {
	//	changeVersion.ChangeVersion();
	//});
	context.subscriptions.push(disposable);
	//context.subscriptions.push(dd);
	context.subscriptions.push(TMLUIEditor.register(context));
	context.subscriptions.push(vscode.languages.registerHoverProvider("csharp", {provideHover: (doc: vscode.TextDocument, pos: vscode.Position) => {
			const word = doc.getText(doc.getWordRangeAtPosition(pos));
			let hoverText = GetStringFromDic(word);
			return new vscode.Hover(hoverText);
		}
	}))
	workspace.setWorkSpace();
	const bar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
	context.subscriptions.push(bar)
	bar.show();
	bar.text = "ModName: " + workspace.ModName;

	var ivp: ItemViewProvider = ItemViewProvider.initItemView();
	context.subscriptions.push(vscode.commands.registerCommand('tmodloaderhelper.Init', init.initMod));

	context.subscriptions.push(vscode.commands.registerCommand('tmodloaderhelper.createmod', () => {
		init.createNewMod("是 Yes");
	}));

	context.subscriptions.push(vscode.commands.registerCommand('tmodloaderhelper.refresh', ivp.refresh));


	context.subscriptions.push(vscode.commands.registerCommand('itemClick', (description) => {
		var findIndex: string = (description as string).split("#$%")[0];
		var path: string = (description as string).split("#$%")[1];
		if(path != "")
		{
			vscode.workspace.openTextDocument(vscode.Uri.file(path))
			.then(doc =>{
				var text = doc.getText();
				if(text.match(findIndex) != null)
				{
					var offset = new RegExp(findIndex).exec(text)?.index as number;
					var pos = doc.positionAt(offset);
					var pos2 = doc.positionAt(offset + findIndex.length);
					const options = {
						selection: new vscode.Range(pos, pos2),
						preview: true
					};
					vscode.window.showTextDocument(doc, options)
				}
			}, err => {
				console.log(`打开 ${path} 文件错误, ${err}`);
			}).then(undefined, err => {
				console.log(`打开 ${path} 文件错误, ${err}`);
			})
		}
		
	}));
}
function GetStringFromDic(hoverTarget: string): string {
	let dic = dictronary.NamesData;
	return dic[hoverTarget];
}
export function deactivate() {}
