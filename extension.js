const Mainloop = imports.mainloop;
const Lang = imports.lang;
const St = imports.gi.St;
const Main = imports.ui.main;
const Tweener = imports.ui.tweener;
const GLib = imports.gi.GLib;
const Gio = imports.gi.Gio;


let text, button,infoText;

function _hideValues() {
    Main.uiGroup.remove_actor(text);
    text = null;
}


function _getValue(cmd){
    let [res, pid, in_fd, out_fd, err_fd] = GLib.spawn_async_with_pipes(null, cmd, null, GLib.SpawnFlags.SEARCH_PATH, null);
    out_reader = new Gio.DataInputStream({ base_stream: new Gio.UnixInputStream({fd: out_fd}) });
    let [out, size] = out_reader.read_line(null); 
    return String(out)+"\u00B0\C";
}

function _showValues(){
    let outStr="inner: "+_getValue( ["pcsensor_inner","-c"])+"\r\nouther-a: "+_getValue( ["pcsensor_outher_a","-c"])+"\r\nouther-b: "+_getValue( ["pcsensor_outher_b","-c"]);
   
    Main.uiGroup.remove_actor(infoText);
    
    if (!text) {
        text = new St.Label({ style_class: 'helloworld-label', text:outStr});
        Main.uiGroup.add_actor(text);
    }

    text.opacity = 255;

    let monitor = Main.layoutManager.primaryMonitor;

    text.set_position(Math.floor(monitor.width / 2 - text.width / 2),
                      Math.floor(monitor.height / 2 - text.height / 2));

    Tweener.addTween(text,
                     { opacity: 255,
                       time: 10,
                       transition: 'easeOutCubic',
                       onComplete: _hideValues });
}

function _showInfoText(){
    if(!infoText){
        infoText = new St.Label({ style_class: 'helloworld-label', text:"Loading..."});
    }
    
    Main.uiGroup.add_actor(infoText);

    infoText.opacity = 255;

    let monitor = Main.layoutManager.primaryMonitor;

    infoText.set_position(Math.floor(monitor.width / 2 - infoText.width / 2),
                      Math.floor(monitor.height / 2 - infoText.height / 2));

    Tweener.addTween(infoText,
                     { opacity: 255,
                       time: 20,
                       transition: 'easeOutQuad',
                       onComplete: function(){
			 Main.uiGroup.remove_actor(infoText);
		      }});
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
      button.connect('button-press-event', _showInfoText); 
      button.connect('button-release-event', _showValues); 
}


function enable() {
    Main.panel._centerBox.add_actor(button, 0);
}

function disable() {
    Main.panel._centerBox.remove_actor(button);
}
