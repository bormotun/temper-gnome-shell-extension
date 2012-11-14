const Mainloop = imports.mainloop;
const Lang = imports.lang;
const St = imports.gi.St;
const Main = imports.ui.main;
const Tweener = imports.ui.tweener;
const GLib = imports.gi.GLib;
const Gio = imports.gi.Gio;


let text, button;

function _hideValues() {
    Main.uiGroup.remove_actor(text);
    text = null;
}


function _getValue(cmd){
    let [res, out, err, status] = GLib.spawn_command_line_sync("cat /var/log/temper");
    return String(out);
}

function _showValues(){
    let outStr=_getValue().trim();
    
    if (!text) {
        text = new St.Label({ style_class: 'helloworld-label', text:outStr});
        Main.uiGroup.add_actor(text);
    }

    text.opacity = 255;

    let monitor = Main.layoutManager.primaryMonitor;

    text.set_position(Math.floor(monitor.width / 2 - text.width / 2),
                      Math.floor(monitor.height / 2 - text.height / 2));

    Tweener.addTween(text,
                     { opacity: 0,
                       time: 10,
                       transition: 'easeOutCubic',
                       onComplete: _hideValues });
}


function init() {
      button = new St.Bin({ style_class: 'panel-button',
                          reactive: true,
                          can_focus: true,
                          x_fill: true,
                          y_fill: false,
                          track_hover: true });
      let icon = new St.Icon({ icon_name: 'system-run',
                             style_class: 'system-status-icon' });

      button.set_child(icon);
      button.connect('button-release-event', _showValues); 
}


function enable() {
    Main.panel._centerBox.add_actor(button, 0);
}

function disable() {
    Main.panel._centerBox.remove_actor(button);
}
