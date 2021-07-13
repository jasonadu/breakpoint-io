"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const fs_1 = require("fs");
const BreakpointIO_1 = require("../objects/BreakpointIO");
function breakpoint_export(context) {
    let breakpoints = vscode.debug.breakpoints;
    if (breakpoints.length > 0) {
        vscode.window.showInformationMessage(`Found ${breakpoints.length} - writing to a file now`);
        let workspace_path = vscode.workspace.workspaceFolders[0].uri.fsPath;
        let workspace_uri_path = vscode.workspace.workspaceFolders[0].uri.path
            .length;
        try {
            let breakpoints_array = Array();
            breakpoints.forEach(element => {
                if (element !== undefined || element !== null) {
                    let point = element;
                    let loc_path = point.location.uri.path;
                    // do not split string for java denpendency
                    if (!javaDependencyCheck(loc_path)) {
                        loc_path = `${loc_path.substring(workspace_uri_path)}`;
                    }
                    // let newPath = `${loc_path.substring(workspace_uri_path)}`;
                    // let range = point.location.range._start;
                    let range = point.location.range;
                    let newElement = new BreakpointIO_1.BreakpointIO(loc_path, range, point.enabled, point.condition, point.hitCondition, point.logMessage);
                    breakpoints_array.push(newElement);
                }
            });
            let breakpoints_json = JSON.stringify(breakpoints_array, null, 2);
            fs_1.writeFileSync(`${workspace_path}//.vscode//breakpoints.json`, breakpoints_json, { encoding: "utf8" });
        }
        catch (err) {
            console.log(err);
        }
    }
    else {
        vscode.window.showErrorMessage("No breakpoints found. If this is your first time attempting to export, please try again");
    }
}
/**
 * check for java dependency, whether path contains string that like class in jar file.
 * @param {String} loc_path 
 * @returns 
 */
function javaDependencyCheck(loc_path) {
    if (loc_path.indexOf('.jar') > -1 || loc_path.indexOf('.class') > -1 ) {
        return true;
    }
    return false;
}
exports.breakpoint_export = breakpoint_export;
//# sourceMappingURL=export.js.map