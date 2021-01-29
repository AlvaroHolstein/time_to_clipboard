// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const childProcess = require('child_process');
const os = require("os");
const { MessageChannel } = require('worker_threads');
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log(`Running on ${os.platform()}`);

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json

	// a String dentro do registerCommand(string, ()) tem que ser a mesma em

	/** package.json
	 * "activationEvents": [
			"onCommand:time-to-clipboard.timeToClip"
		],
		"main": "./extension.js",
		"contributes": {
			"commands": [
				{
					"command": "time-to-clipboard.timeToClip",
					"title": "ttp"
				}
			]
		},
	 */
	let disposable = vscode.commands.registerCommand('time-to-clipboard.timeToClip', function () {
		// The code you place here will be executed every time your command is executed
		try {
			let date = new Date().toLocaleString().split(",")[1].split(" ");
			let separeted = date[1].split(":");
			let clipDate = separeted[0] + ":" + separeted[1] + date[2];
			correctClip(clipDate);
			// Display a message box to the user
			vscode.window.showInformationMessage(clipDate);
		} catch (err) {
			console.error("Mamas", err)
		}
	});

	context.subscriptions.push(disposable);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() { }

// Função para usar o clipboard consoante o sistema operativo
function correctClip(msg) {
	if (os.platform() == 'linux') {
		// Não está a funcionar para linux porque falta um display (Ver erro outra vez porque não ter que ser um display fisico acho)
		childProcess.exec(`echo '${msg}' | /usr/bin/xclip -in`, (err, stdout, stderr) => {
			if(err || stderr) console.error("Merda", err || stderr)

			console.log(msg)
		});
	} else if (os.platform().includes('win')) {
		// Funciona Top
		childProcess.spawn('clip').stdin.end(msg);
	}
}
module.exports = {
	activate,
	deactivate
}
