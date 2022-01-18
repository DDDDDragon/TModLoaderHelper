import * as vscode from 'vscode';
import * as fs from 'fs-extra';
import * as path from 'path';

export class TMLUIEditor implements vscode.CustomTextEditorProvider
{
	private static readonly viewType = 'tmodloaderhelper.ui';

	constructor(
		private readonly context: vscode.ExtensionContext
	) { }

	public static register(context: vscode.ExtensionContext): vscode.Disposable {
		const provider = new TMLUIEditor(context);
		const providerRegistration = vscode.window.registerCustomEditorProvider(TMLUIEditor.viewType, provider);
		return providerRegistration;
	}

	public async resolveCustomTextEditor(
		document: vscode.TextDocument, 
		webviewPanel: vscode.WebviewPanel, 
		token: vscode.CancellationToken
	): Promise<void> {
			webviewPanel.webview.options = {
				enableScripts : true,
			};
			webviewPanel.webview.html = this.getHtmlForWebview(webviewPanel.webview);
			function updateWebview(){
				webviewPanel.webview.postMessage({
					type: 'update',
					text: document.getText(),
				});
			}
			const changeDocumentSubscription = vscode.workspace.onDidChangeTextDocument(e => {
				if (e.document.uri.toString() === document.uri.toString()) {
					updateWebview();
				}
			});
	
			// Make sure we get rid of the listener when our editor is closed.
			webviewPanel.onDidDispose(() => {
				changeDocumentSubscription.dispose();
			});
	
			// Receive message from the webview.
	
			updateWebview();
	}
    private getHtmlForWebview(webview: vscode.Webview): string{
        return `
        <html lang="en">
    <head>
        <meta charset="UTF-8">
        <!--
        Use a content security policy to only allow loading images from https or from our extension directory,
        and only allow scripts that have a specific nonce.
        -->
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>可视化UI设计</title>
    </head>
    <body>
        <div class="notes">
            <div class="add-button">
                <center>
                <button style="background-color: rgb(14,99,156);">
                    <div style="color:rgb(255,255,255)">
                        你丫瞅什么呢？这不显然没开发完吗
                    </div>
                </button>
                </center>
            </div>
                <div style="background-color: rgb(255,255,255);width: 100px;height: 700px;float: left;">

                </div>
                <div style="background-color: rgb(51,51,51);width: 500px;height: 700px;float: left;">
                    <div style="color:rgb(255,255,255);text-align: center;"> 
                        sss<br/>sss
                    </div>
                </div>
        </div>   
    </body>
</html>`;
    }
}
