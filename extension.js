// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const childProcess = require('child_process');
const os = require("os");
const { MessageChannel } = require('worker_threads');
const fs = require("fs");
const fsPromises = fs.promises; // é daqui que é criado um filehandler depos de abrir um documento de texto

const path = require("path");
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
async function correctClip(msg) {
	try {
		if (os.platform() == 'linux') {
			// Não está a funcionar para linux porque falta um display (Ver erro outra vez porque não ter que ser um display fisico acho)
			// childProcess.exec(`echo '${msg}' | /usr/bin/xclip -in`, (err, stdout, stderr) => {
			// 	if(err || stderr) console.error("Merda", err || stderr)

			// 	console.log(msg)
			// }); 

			// NOTA: Já que não dá para "mandar" para o clipboard vou escrever para o ficheiro atual 
			// Para ter acesso ao ficheiro atual basta o __filename.
			// Posição do cursor num ficheiro (https://stackoverflow.com/questions/65261663/vscode-how-to-get-position-of-cursor-in-the-document#answer-65261877)

			console.log("Current file", editor.document.fileName) // Current active file i Think
			let currFile = editor.document.filename;

			writeToFileInPos(currFile)

		} else if (os.platform().includes('win')) {
			// Funciona Top
			childProcess.spawn('clip').stdin.end(msg);
		}
	} catch (err) {
		console.error("Custom error Handler", err)
	}
}

function writeToFileInPos(path) {

	let editor = vscode.window.activeTextEditor;
	console.log(editor.selection.active)

	let bufferedMsg = new Buffer.from(msg, "utf-8"); // só new Buffer tá deceprecated, acho que afinal dá para usar só uma string (msg)

	// Vou ter que usar fileHnadler
	const filehandler = await fsPromises.open(currFile,) //'r+': Open file for reading and writing. An exception occurs if the file does not exist.

	/**
	* Ainda vou ter que calcular a a posição, Não sei bem como
	* mas acho que vou ter que de alguma maneira transformar a posição 
	* do cursor [x=line, y=column] em bytes... 
	* há uma função chamada seek() em C ou C++ (not sure) 
	* que acho que devolve o valor de bytes da posição em que encontra 
	* um certo valor.
	* O que eu quero é encontrar a posição do cursor, mas não a partir de 
	* ler o ficheiro linha a linha mas sim ir direto a uma certa posição e escrever ai
	* Isso significa que depois vou ter que alterar o ficheiro todo? - Acho que não, mas isso é o que a função write() faz.
	* 
	*/
	let pos;
	let writeMsgResult = filehandler.write(msg, );



	// Close the fileHandler, "free" the object, (or close the Thred) -> Não sei se isto é grande disparate xD
	filehandler.close();
}
module.exports = {
	activate,
	deactivate
}
