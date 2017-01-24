/**
 * Created by py on 1/19/17.
 */
var readlineSync = require('readline-sync');

var exit = false;


var fsStorage = [];
var root = {id      : 0,
            name    : 'root',
            type    : 'directory',
            children : []
};

fsStorage.push(root);

var currentFolderId = 0;
var lastId = 0;

var menu = [
    'Print current folder',
    'Change current folder',
    'Create file or folder',
    'Delete file or folder',
    'Open file',
    'Quit Program'
];


main();

function main() {
    while(!exit)
        showMenu();
}

function showMenu() {


    var choise = readlineSync.keyInSelect(menu,'Please make your choise : ');

    switch(choise) {
        case 0 :
            printCurrentFolder();
            break;
        case 1 :
            changeCurrentFolder();
            break;
        case 2 :
            createFile();
            break;
        case 3 :
            deleteFile();
            break;
        case 4 :
            openFile();
            break;
        case 5 :
            quitProgram();
            break;
        default :
            break;
    }
}

function childId(folder,index) {
    return folder.children[index].id;
}

function childName(folder,index) {
    return folder.children[index].name;
}

function childType(folder,index) {
    return folder.children[index].type;
}

function childContent(folder,index) {
    return folder.children[index].content;
}

function addChild(folder,content) {

    folder.children.push(content);
}

function deleteChild(folder,index){
    folder.children.splice(index,1);
}

function findFolderInArray(array) {
    for(var i in array) {
        if(array[i].id == currentFolderId) {
            return array[i];
        } else {
            var resultFromChild = findFolderInArray(array[i].children);
            if(resultFromChild ) return resultFromChild;
        }
    }
}

function haveChildWithId(array, id) {
    for(var i in array) {
        if (array[i].id == id) return true;
    }
    return false;
}


function findFatherRecursevly(array) {
    for(var i in array) {
        if(haveChildWithId(array[i].children,currentFolderId)) {
            return array[i];
        } else {
            var resultFromChild = findFatherRecursevly(array[i].children);
            if(resultFromChild != 0) return resultFromChild;
        }
    }
    return 0;
}


function findCurrentFolder(){
    return findFolderInArray(fsStorage);
}

function findFather() {
    return findFatherRecursevly(fsStorage);

}


function printCurrentFolder() {
    var currentFolder = findCurrentFolder();

    console.log(currentFolder.name);

    for(var i in currentFolder.children) {
        if(childType(currentFolder,i) == 'directory') console.log("\t", childName(currentFolder,i), "\\");
    }

    for(var i in currentFolder.children) {
        if(childType(currentFolder,i) == 'file') console.log("\t", childName(currentFolder,i));
    }
}


function deleteFile() {
    var fileName = readlineSync.question("Insert file/folder name :");

    var currentFolder = findCurrentFolder();

    for(var i in currentFolder.children) {
        if(childName(currentFolder,i) == fileName) {
            deleteChild(currentFolder,i);
            console.log(fileName," deleted successfully");
            return;
        }
    }
    console.log("Error! No such file or directory");
}


function createFile() {
    var fileName = readlineSync.question("Insert file/folder name :");

    var currentFolder = findCurrentFolder();

    for(var i in currentFolder.children) {
        if(childName(currentFolder,i) == fileName) {
            console.log("Error! File or folder with this name already existh in this folder");
            return;
        }
    }

    var content = readlineSync.question("Insert content ( if empty create folder) :");

    var newFile = { id : ++lastId, name : fileName };
    if(content == '') {
        newFile.children = [];
        newFile.type = "directory";
    } else {
        newFile.content = content;
        newFile.type = "file";
    }

    addChild(currentFolder,newFile);

    console.log(currentFolder.name);
    console.log("\t",newFile.name);

}


function changeCurrentFolder() {
    var folderName = readlineSync.question("Insert folder name or [..]  :");

    var found = false;

    if(folderName == '..') {
        if(currentFolderId == 0) {
            console.log("Error! You in the root");
            return;
        }

        currentFolderId = findFather().id;
        found = true;
    } else {
        var currentFolder = findCurrentFolder();
        for(var i in currentFolder.children) {
            if(childName(currentFolder,i) == folderName) {
                if (childType(currentFolder,i) == 'directory') {
                    currentFolderId = childId(currentFolder,i);
                    found = true;
                } else {
                    console.log("Error! ", folderName, " is file name");
                    return;
                }
            }
        }
    }

    if(!found) console.log("Error! No such directory");
    printCurrentFolder();
}


function openFile() {
    var fileName = readlineSync.question("Insert file name :");

    if(fileName == '') {
        console.log("Error! File name can not be empty.");
        return;
    }

    var currentFolder = findCurrentFolder();

    for(var i in currentFolder.children ) {
        if(childName(currentFolder,i) == fileName ) {
            if (childType(currentFolder,i) == 'file') {
                console.log("** ", childContent(currentFolder,i), " **");
                return;
            } else {
                console.log("Error! ", folderName, " is folder name");
            }
        }

    }
    console.log("Error! No such file in current directory");
}


function quitProgram() {
    do {
        var choice = readlineSync.question("Are you sure ? [y/n] :");
    } while(choice != 'y' && choice != 'n');

    if(choice == 'y') {
        exit = true;
        console.log("Have a good day!");
    }
}


