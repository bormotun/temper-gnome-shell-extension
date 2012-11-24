/* Thanx a lot for Juan Carlos Perez! 
 * Dear customer, Please see dir pcsensor-1.0.1 for source and license
*/


const Mainloop = imports.mainloop;
const Lang = imports.lang;
const St = imports.gi.St;
const Main = imports.ui.main;
const Tweener = imports.ui.tweener;
const GLib = imports.gi.GLib;
const Gio = imports.gi.Gio;
const PanelMenu = imports.ui.panelMenu;


let text, button;

function _hideValues() {
    Main.uiGroup.remove_actor(text);
    text = null;
}


function _getValue(cmd){
    let [res, out, err, status] = GLib.spawn_command_line_sync("cat /var/log/temper");
    return String(out);
}

function _showValues(button){
    let outStr=_getValue().trim();
    let label =    new St.Label({ style_class: 'panel-label',text:outStr}); 
    button.set_child(label);
    Mainloop.timeout_add_seconds(60, Lang.bind(this, function() {this._showValues(button);}));
}


function init() {
      button = new St.Bin({ style_class: 'panel-button',
                          reactive: true,
                          can_focus: true,
                          x_fill: true,
                          y_fill: false,
                          track_hover: true });
      
      _showValues(button);
}


function enable() {
    Main.panel._centerBox.add_actor(button, 0);
}

function disable() {
    Main.panel._centerBox.remove_actor(button);
}
