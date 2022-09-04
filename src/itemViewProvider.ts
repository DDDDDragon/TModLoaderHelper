import * as vscode from 'vscode';
import * as path from 'path';
import { stat } from 'fs';
import { join } from 'path';
import * as workspace from './workSpace';

const ITEM_MAP = new Map<string, string>([
])

export class ItemNode extends vscode.TreeItem {
    constructor(
        public path: string,
        public findIndex: string,
        public readonly label: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
        public child: ItemNode[] = []
    ){
        super(label, collapsibleState);
    }

    command = {
        title: this.label,
        command: 'itemClick',
        tootip: this.label,
        arguments: [
            this.findIndex + "#$%" + this.path
        ]
    }

}

export class ItemViewProvider implements vscode.TreeDataProvider<ItemNode>{
    getTreeItem(element: ItemNode): vscode.TreeItem | Thenable<vscode.TreeItem> {
        return element;
    }
    getChildren(element?: ItemNode): vscode.ProviderResult<ItemNode[]> {
        if(element == undefined) return workspace.ItemsData;
        else return element.child;
    }
    
    private _onDidChangeTreeData: vscode.EventEmitter<ItemNode | undefined | null | void> = new vscode.EventEmitter<ItemNode | undefined | null | void>();
    readonly onDidChangeTreeData: vscode.Event<ItemNode | undefined | null | void> = this._onDidChangeTreeData.event;
  
    refresh(): void {
      this._onDidChangeTreeData.fire();
    }

    public static initItemView(): ItemViewProvider
    {
        const itemViewProvider = new ItemViewProvider();
    
        vscode.window.registerTreeDataProvider('itemView-item', itemViewProvider);
        //vscode.window.createTreeView('itemView-item', {
            //treeDataProvider: new ItemViewProvider()
        //})
        return itemViewProvider;
    }

    public updateItemView()
    {
        workspace.updateView();
        this.refresh();
    }
    public updateData()
    {
        while(workspace.ItemsDataUpdate.length > 0) workspace.ItemsDataUpdate.pop();
        var path = vscode.window.activeTextEditor?.document.uri.fsPath.replace("c:", "C:").replace("d:", "D:").replace("e:", "E:") as string;
    }
}