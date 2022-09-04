import * as vscode from 'vscode';
import * as fs from 'fs-extra';
import * as os from 'os';
import * as winreg from 'winreg';
import * as child from 'child_process'
import { TMLUIEditor } from './ui';
import { HttpClient } from "typed-rest-client/HttpClient";
import { ItemViewProvider } from './itemViewProvider';
import * as hover from './hover';
import { strArr } from './data';
import * as dictronary from './LoadItemNames';
import * as workspace from './workSpace';
import * as changeVersion from './changeVersion';
import path = require('path');
import { IHttpClient, IHttpClientResponse } from 'typed-rest-client/Interfaces';

export function initMod()
{
    const source = vscode.workspace.getConfiguration().get('tmodloaderhelper.ModSourcesPath') as string;
    if(source == "")
    {
        const result = vscode.workspace.getConfiguration().get('tmodloaderhelper.TModLoaderPath') as string;
        if(result == "") 
        {
            vscode.window.showInformationMessage('请在设置页面输入TModLoader的路径!\nPlease enter TModLoader path in config page!');
            vscode.commands.executeCommand( 'workbench.action.openSettings', 'TModLoaderHelper' );
            return;
        }
        var isExist = fs.existsSync(result);
        if(isExist)
        {
            var stats = fs.statSync(result);
            if(stats.isDirectory())
            {
                var files = fs.readdirSync(result);
                if(files.includes("ModSources")) 
                {
                    vscode.workspace.getConfiguration().update('tmodloaderhelper.ModSourcesPath', path.join(result, "ModSources"));
                }
                else
                {
                    vscode.window.showInformationMessage('TModLoader路径下不存在ModSources文件夹!\nTModLoader path doesn\'t include ModSources folder!');
                    vscode.commands.executeCommand( 'workbench.action.openSettings', 'TModLoaderHelper');
                    return;
                }
            }
            else
            {
                vscode.window.showInformationMessage('TModLoader路径输入错误!\nTModLoader path is wrong!');
                vscode.commands.executeCommand( 'workbench.action.openSettings', 'TModLoaderHelper');
                return;
            }
        }
    }
    else
    {
        vscode.window.showInformationMessage('是否创建新mod?\nDo you want to create a new mod?', "是 Yes", "否 No")
        .then(createNewMod).then(undefined, console.error);
        downloadNET();
    }
}
export async function downloadNET() 
{
    const client = new HttpClient("clientTest");
    var files = fs.readdirSync("C:\\Program Files\\dotnet\\sdk");
    if(files.filter((value: string) => value[0] == "6").length == 0)
    {
        if(os.arch() == "x64")
        {
            const res = await client.get("https://download.visualstudio.microsoft.com/download/pr/9a1d2e89-d785-4493-aaf3-73864627a1ea/245bdfaa9c46b87acfb2afbd10ecb0d0/dotnet-sdk-6.0.400-win-x64.exe")
            const filePath = "C:\\Users\\ASUS\\Downloads\\NET6·0.exe";
            const file: NodeJS.WritableStream = fs.createWriteStream(filePath);
            fs.createFileSync(filePath);
            res.message.pipe(file);
            vscode.window.showInformationMessage("开始下载NET6·0\nStart to download NET6·0");
            res.message.addListener("end", () => {
                vscode.window.showInformationMessage("NET6.0下载完毕\nSuccessfully download.  C:\\Users\\ASUS\\Downloads\\NET6·0.exe");
            });
        }
        if(os.arch() == "x86")
        {
            const res = await client.get("https://download.visualstudio.microsoft.com/download/pr/a0e80246-00b9-4677-a524-c343c1f2943c/5bd095f31e0dd114627276514a182ca7/dotnet-sdk-6.0.400-win-x86.exe")
            const filePath = "C:\\Users\\ASUS\\Downloads\\NET6·0.exe";
            const file: NodeJS.WritableStream = fs.createWriteStream(filePath);
            fs.createFileSync(filePath);
            res.message.pipe(file);
            vscode.window.showInformationMessage("开始下载NET6·0\nStart to download NET6·0");
            res.message.addListener("end", () => {
                console.log("NET6.0下载完毕\nSuccessfully download.  C:\\Users\\ASUS\\Downloads\\NET6·0.exe");
            });
        }
    }
files.filter((value: string) => value[0] == "6").length == 0
}
export async function createNewMod(value: string | undefined)
{
    const source = vscode.workspace.getConfiguration().get('tmodloaderhelper.ModSourcesPath') as string;
    const result = vscode.workspace.getConfiguration().get('tmodloaderhelper.TModLoaderPath') as string;
    if(source == "" || result == "")
    {

        return;
    }
    if(value != undefined)
    {
        if(value == "是 Yes")
        {
            var modName: string = "FirstMod";
            var authorName: string = "GoodAuthor";
            var displayName: string = "FirstMod";
            await vscode.window.showInputBox({
                title: "输入你的mod名称  input your mod name",
                value: "FirstMod",
                ignoreFocusOut: true
            }).then((value: string | undefined) => {
                if(value != undefined)
                {
                    modName = value;
                }
            }).then(undefined, console.error);
            await vscode.window.showInputBox({
                title: "输入你的mod显示名称  input your mod display name",
                value: "FirstMod",
                ignoreFocusOut: true
            }).then((value: string | undefined) => {
                if(value != undefined)
                {
                    displayName = value;
                }
            }).then(undefined, console.error);
            await vscode.window.showInputBox({
                title: "输入作者名称  input author name",
                value: "GoodAuthor",
                ignoreFocusOut: true
            }).then((value: string | undefined) => {
                if(value != undefined)
                {
                    authorName = value;
                }
            }).then(undefined, console.error);
            vscode.window.showInformationMessage('正在创建新Mod...\nCreating new mod...');
            var modSourcesPath = vscode.workspace.getConfiguration().get('tmodloaderhelper.ModSourcesPath') as string;
            var modPath = path.join(modSourcesPath, modName);
            if(!fs.existsSync(modPath)) 
            {
                fs.mkdirSync(modPath);
                fs.appendFileSync(path.join(modPath, "build.txt"), "displayName = " + displayName + "\n", {});
                fs.appendFileSync(path.join(modPath, "build.txt"), "author = " + authorName + "\n");
                fs.appendFileSync(path.join(modPath, "build.txt"), "version = 0.1");
                fs.appendFileSync(path.join(modPath, "description.txt"), displayName + " is a pretty cool mod, it does...this. Modify this file with a description of your mod");
                fs.appendFileSync(path.join(modPath, modName + ".cs"), "using Terraria.ModLoader;\n\n");
                fs.appendFileSync(path.join(modPath, modName + ".cs"), "namespace " + modName + "\n");
                fs.appendFileSync(path.join(modPath, modName + ".cs"), "{\n");
                fs.appendFileSync(path.join(modPath, modName + ".cs"), "    public class " + modName + " : Mod\n");
                fs.appendFileSync(path.join(modPath, modName + ".cs"), "    {\n");
                fs.appendFileSync(path.join(modPath, modName + ".cs"), "    }\n");
                fs.appendFileSync(path.join(modPath, modName + ".cs"), "}");
                fs.appendFileSync(path.join(modPath, modName + ".csproj"), "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n");
                fs.appendFileSync(path.join(modPath, modName + ".csproj"), "<Project Sdk=\"Microsoft.NET.Sdk\">\n");
                fs.appendFileSync(path.join(modPath, modName + ".csproj"), "  <Import Project=\"..\\tModLoader.targets\" />\n");
                fs.appendFileSync(path.join(modPath, modName + ".csproj"), "  <PropertyGroup>\n");
                fs.appendFileSync(path.join(modPath, modName + ".csproj"), "    <AssemblyName>ab</AssemblyName>\n");
                fs.appendFileSync(path.join(modPath, modName + ".csproj"), "    <TargetFramework>net6.0</TargetFramework>\n");
                fs.appendFileSync(path.join(modPath, modName + ".csproj"), "    <PlatformTarget>AnyCPU</PlatformTarget>\n");
                fs.appendFileSync(path.join(modPath, modName + ".csproj"), "    <LangVersion>latest</LangVersion>\n");
                fs.appendFileSync(path.join(modPath, modName + ".csproj"), "  </PropertyGroup>\n");
                fs.appendFileSync(path.join(modPath, modName + ".csproj"), "  <ItemGroup>\n");
                fs.appendFileSync(path.join(modPath, modName + ".csproj"), "    <PackageReference Include=\"tModLoader.CodeAssist\" Version=\"0.1.*\" />\n");
                fs.appendFileSync(path.join(modPath, modName + ".csproj"), "  </ItemGroup>\n");
                fs.appendFileSync(path.join(modPath, modName + ".csproj"), "</Project>");
                fs.mkdirSync(path.join(modPath, "Properties"));
                fs.appendFileSync(path.join(modPath, "Properties", "launchSettings.json"), "{\n");
                fs.appendFileSync(path.join(modPath, "Properties", "launchSettings.json"), "  \"profiles\": {\n");
                fs.appendFileSync(path.join(modPath, "Properties", "launchSettings.json"), "    \"Terraria\": {\n");
                fs.appendFileSync(path.join(modPath, "Properties", "launchSettings.json"), "      \"commandName\": \"Executable\",\n");
                fs.appendFileSync(path.join(modPath, "Properties", "launchSettings.json"), "      \"executablePath\": \"dotnet\",\n");
                fs.appendFileSync(path.join(modPath, "Properties", "launchSettings.json"), "      \"commandLineArgs\": \"$(tMLPath)\",\n");
                fs.appendFileSync(path.join(modPath, "Properties", "launchSettings.json"), "      \"workingDirectory\": \"$(tMLSteamPath)\"\n");
                fs.appendFileSync(path.join(modPath, "Properties", "launchSettings.json"), "    },\n");
                fs.appendFileSync(path.join(modPath, "Properties", "launchSettings.json"), "    \"TerrariaServer\": {\n");
                fs.appendFileSync(path.join(modPath, "Properties", "launchSettings.json"), "      \"commandName\": \"Executable\",\n");
                fs.appendFileSync(path.join(modPath, "Properties", "launchSettings.json"), "      \"executablePath\": \"dotnet\",\n");
                fs.appendFileSync(path.join(modPath, "Properties", "launchSettings.json"), "      \"commandLineArgs\": \"$(tMLServerPath)\",\n");
                fs.appendFileSync(path.join(modPath, "Properties", "launchSettings.json"), "      \"workingDirectory\": \"$(tMLSteamPath)\"\n");
                fs.appendFileSync(path.join(modPath, "Properties", "launchSettings.json"), "    }\n");
                fs.appendFileSync(path.join(modPath, "Properties", "launchSettings.json"), "  }\n");
                fs.appendFileSync(path.join(modPath, "Properties", "launchSettings.json"), "}");
                vscode.window.showInformationMessage('创建完毕.\nSuccessfully create.');
                vscode.window.showInformationMessage('是否打开新mod?\nDo you want to open the new mod?', "是 Yes", "否 No")
                .then((value: string | undefined) =>{
                    if(value != undefined)
                    {
                        if(value == "是 Yes")
                        {
                            let uri = vscode.Uri.file(modPath);
                            console.log(uri.path);
                            vscode.commands.executeCommand('vscode.openFolder', uri);
                        }
                    }
                }).then(undefined, console.error);;
            }
            else
            {
                vscode.window.showInformationMessage('已经存在这个名称的mod...\nAlready exist a mod with this name...');
                createNewMod("是 Yes");
            }
        }
        else 
        {
            return;
        }
    }
}
function func(result: string){
    return;
}