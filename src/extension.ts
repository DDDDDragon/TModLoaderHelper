// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { TMLUIEditor } from './ui';
import * as hover from './hover';
import { strArr } from './data';
import * as dictronary from './LoadItemNames';
import * as workspace from './workSpace';
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "tmodloaderhelper" is now active!');
	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('tmodloaderhelper.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from TModLoaderHelper!');
	});
	context.subscriptions.push(disposable);
	context.subscriptions.push(TMLUIEditor.register(context));
	  // 注册hover提供器
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
	//hover.activate(context);
}
function GetStringFromDic(hoverTarget: string): string {
	let dic = dictronary.NamesData;
	return dic[hoverTarget];
}
// this method is called when your extension is deactivated
export function deactivate() {}