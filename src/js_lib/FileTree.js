"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.File = exports.Directory = exports.FileTree = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
class FileTree {
    constructor(trail) {
        this.trail = trail;
        this.rootDir = new Directory(null, trail);
    }
    getCurrentPath() {
        return this.getCurrentElement().getPath();
    }
    getRootDir() {
        return this.rootDir;
    }
    setRootDir(trail) {
        this.rootDir = new Directory(null, trail);
    }
    getCurrentElement() {
        let focusedElement = this.getFocusedElement();
        if (typeof focusedElement === 'undefined') {
            focusedElement = this.findElement(this.trail);
            focusedElement.setFocus(true);
        }
        return focusedElement;
    }
    removeFocus() {
        const allElements = this.getAllElements();
        // delete focus information
        allElements.forEach(element => {
            element.setFocus(false);
        });
    }
    setTrail(trail) {
        if (fs_1.default.existsSync(trail)) {
            const fileStat = fs_1.default.statSync(trail);
            if (fileStat.isDirectory()) {
                this.removeFocus();
                this.setRootDir(trail);
                this.trail = trail;
                this.rootDir.expand();
                this.rootDir.setFocus(true);
            }
            else if (fileStat.isFile()) {
                const parent = path_1.default.dirname(trail);
                this.removeFocus();
                this.setRootDir(trail);
                this.trail = trail;
                this.rootDir.expand();
                const element = this.findElement(trail.trim());
                element.setFocus(true);
            }
        }
    }
    /**
     *Handling click event
     *
     * @param {string} trail
     * @memberof FileTree
     */
    clicked(trail) {
        const clickedElement = this.findElement(trail.trim());
        this.removeFocus();
        if (typeof clickedElement !== 'undefined') {
            clickedElement.setFocus(true);
            if (clickedElement instanceof Directory) {
                const clickedDirectory = clickedElement;
                if (clickedDirectory.isExpanded) {
                    clickedDirectory.unExpand();
                }
                else {
                    clickedDirectory.expand();
                }
            }
            else if (clickedElement instanceof File) {
                const clickedFile = clickedElement;
            }
            else {
                //
            }
        }
    }
    keyPressed(keyCode) {
        const currentElement = this.getCurrentElement();
        const parent = currentElement.getParent();
        switch (keyCode) {
            case 37: //left
                if (currentElement instanceof Directory) {
                    if (currentElement.isExpanded) {
                        currentElement.unExpand();
                    }
                }
                break;
            case 39: //right
                if (currentElement instanceof Directory) {
                    if (!currentElement.isExpanded) {
                        currentElement.expand();
                        if (currentElement.isRoot) {
                            if (currentElement.subDirectories.length > 0) {
                                currentElement.setFocus(false);
                                currentElement.subDirectories[0].setFocus(true);
                            }
                            else if (currentElement.files.length > 0) {
                                currentElement.setFocus(false);
                                currentElement.files[0].setFocus(true);
                            }
                        }
                    }
                }
                break;
            case 38: //up
                if (parent != null) {
                    parent.moveFocusUp();
                }
                break;
            case 40: //down
                if (parent != null) {
                    parent.moveFocusDown();
                }
                break;
        }
    }
    /**
     *This operation finds the element with the certain trail.
     *
     * @private
     * @param {string} trail
     * @returns {DirElement}
     * @memberof FileTree
     */
    findElement(trail) {
        const allElements = new Map();
        this.treeWalkder(this.rootDir, allElements, (element) => {
            return (trail === element.getPath());
        });
        return allElements.get(trail);
    }
    getAllElements() {
        const allElements = new Map();
        this.treeWalkder(this.rootDir, allElements, (element) => {
            return true;
        });
        return Array.from(allElements.values());
    }
    getFocusedElement() {
        const allElements = new Map();
        this.treeWalkder(this.rootDir, allElements, (element) => {
            return element.getFocus();
        });
        return Array.from(allElements.values())[0];
    }
    /**
     * Walked recursively through the tree and test func(). If func() return true, the elemnt
     * is stored then into the reuslt map.
     *
     * @private
     * @param {Directory} element
     * @param {Map<string, DirElement>} result
     * @param {(element: DirElement) => boolean} func
     * @memberof FileTree
     */
    treeWalkder(element, result, func) {
        element.getSubDirectories().forEach(directory => {
            this.treeWalkder(directory, result, func);
        });
        if (func(element)) {
            result.set(element.getPath(), element);
        }
        element.getFiles().forEach(file => {
            if (func(file)) {
                result.set(file.getPath(), file);
            }
        });
    }
}
exports.FileTree = FileTree;
/**
 *
 * Base element for Directory and File
 * @class DirElement
 */
class DirElement {
    constructor(parent, name) {
        this.parent = parent;
        this.name = name;
        this.focus = false;
    }
    getPath() {
        let trail = this.name;
        if (null != this.parent) {
            trail = path_1.default.join(this.parent.getPath(), this.name);
        }
        return trail;
    }
    getName() {
        return this.name;
    }
    getFocus() {
        return this.focus;
    }
    setFocus(focus) {
        this.focus = focus;
    }
    getParent() {
        return this.parent;
    }
}
class Directory extends DirElement {
    constructor(parent, name) {
        super(parent, name);
        if (null == parent) {
            this.isRoot = true;
        }
        else {
            this.isRoot = false;
        }
        this.isExpanded = false;
        this.isLocked = false;
        this.subDirectories = [];
        this.files = [];
    }
    /**
     * This operation build up the directory element by reading in the file system
     * and populating the subDirectories- und file-collections
     *
     * @memberof Directory
     */
    buildUp() {
        try {
            const trailStart = this.getPath();
            const dirContent = fs_1.default.readdirSync(trailStart, { withFileTypes: true });
            dirContent.forEach(dirEnt => {
                if (dirEnt.isDirectory()) {
                    this.subDirectories.push(new Directory(this, dirEnt.name));
                }
                else if (dirEnt.isFile()) {
                    this.files.push(new File(this, dirEnt.name));
                }
            });
        }
        catch (e) {
            this.isLocked = true;
            console.log("Dir is locked: " + this.getPath);
        }
    }
    /**
     *Remove all content of the directory node
     *
     * @memberof Directory
     */
    unExpand() {
        this.isExpanded = false;
        this.isLocked = false;
        this.subDirectories = [];
        this.files = [];
    }
    /**
     * Operation expands the directory node
     *
     * @memberof Directory
     */
    expand() {
        this.buildUp();
        if ((this.subDirectories.length > 0) || this.files.length) {
            this.isExpanded = true;
        }
    }
    getSubDirectories() {
        return this.subDirectories;
    }
    getFiles() {
        return this.files;
    }
    getFocusedElement() {
        let focusedElement = null;
        this.subDirectories.forEach(dir => {
            if (dir.getFocus()) {
                focusedElement = dir;
            }
        });
        if (null == focusedElement) {
            this.files.forEach(file => {
                if (file.getFocus()) {
                    focusedElement = file;
                }
            });
        }
        return focusedElement;
    }
    /**
     * Moves the focus upwards. In case the focus reached the most upper element,
     * the operation returns false, otherwise true
     *
     * @returns {boolean}
     * @memberof Directory
     */
    moveFocusUp() {
        let successfull = false;
        const focusedElement = this.getFocusedElement();
        let indexDir = this.subDirectories.indexOf(focusedElement);
        let indexFile = this.files.indexOf(focusedElement);
        if ((indexDir == 0 && this.subDirectories.length > 0 && !focusedElement.isRoot) || //
            ((indexFile == 0) && (this.files.length > 0) && (this.subDirectories.length == 0))) {
            // We reached the first element
            const parent = focusedElement.parent;
            focusedElement.setFocus(false);
            parent.setFocus(true);
            successfull = true;
        }
        else if (indexFile > 0) {
            // We are in the file section
            focusedElement.setFocus(false);
            this.files[--indexFile].setFocus(true);
            successfull = true;
        }
        else if (indexFile == 0) {
            // We are in the middle
            focusedElement.setFocus(false);
            this.subDirectories[this.subDirectories.length - 1].setFocus(true);
            successfull = true;
        }
        else if (indexDir > 0) {
            focusedElement.setFocus(false);
            this.subDirectories[--indexDir].setFocus(true);
            successfull = true;
        }
        return successfull;
    }
    /**
    * Moves the focus downwards. In case the focus reached the last element,
    * the operation returns false, otherwise true
    *
    * @returns {boolean}
    * @memberof Directory
    */
    moveFocusDown() {
        let successfull = false;
        const focusedElement = this.getFocusedElement();
        if ((focusedElement instanceof Directory) && focusedElement.isExpanded) {
            successfull = this.moveDownServiceChildDir(focusedElement);
        }
        else {
            let indexDir = this.subDirectories.indexOf(focusedElement);
            let indexFile = this.files.indexOf(focusedElement);
            if (indexDir > -1 && indexDir < (this.subDirectories.length - 1)) {
                // We are in the directory section
                focusedElement.setFocus(false);
                this.subDirectories[++indexDir].setFocus(true);
                successfull = true;
            }
            else if (indexDir == (this.subDirectories.length - 1) && (this.subDirectories.length > 0) && (this.files.length > 0)) {
                // We are in the middle
                focusedElement.setFocus(false);
                this.files[0].setFocus(true);
                successfull = true;
            }
            else if (indexFile > -1 && indexFile < (this.files.length - 1)) {
                // We are in the file section
                focusedElement.setFocus(false);
                this.files[++indexFile].setFocus(true);
                successfull = true;
            }
        }
        return successfull;
    }
    /**
     * This operation sets the focus on the first child of the expanded directory
     *
     * @private
     * @param {Directory} dir
     * @returns {boolean}
     * @memberof Directory
     */
    moveDownServiceChildDir(dir) {
        let successfull = false;
        const subDir = dir.getSubDirectories();
        const subFiles = dir.getFiles();
        if (subDir.length > 0) {
            dir.setFocus(false);
            subDir[0].setFocus(true);
            successfull = true;
        }
        else if (subFiles.length > 0) {
            dir.setFocus(false);
            subFiles[0].setFocus(true);
            successfull = true;
        }
        return successfull;
    }
}
exports.Directory = Directory;
class File extends DirElement {
    constructor(parent, name) {
        super(parent, name);
    }
}
exports.File = File;
//# sourceMappingURL=FileTree.js.map