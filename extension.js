const Mainloop = imports.mainloop;
const Lang = imports.lang;
const St = imports.gi.St;
const Main = imports.ui.main;
const Tweener = imports.ui.tweener;
const GLib = imports.gi.GLib;
const Gio = imports.gi.Gio;


let text, button;

function _hideHello() {
    Main.uiGroup.remove_actor(text);
    text = null;
}

function _showHello() {

    refr();
   
   
    let [res, pid, in_fd, out_fd, err_fd] = GLib.spawn_async_with_pipes(null, ["date"], null, GLib.SpawnFlags.SEARCH_PATH, null);
    out_reader = new Gio.DataInputStream({ base_stream: new Gio.UnixInputStream({fd: out_fd}) });
   
    let [out, size] = out_reader.read_line(null);  
   
   if (!text) {
        text = new St.Label({ style_class: 'helloworld-label', text:String(out)});
        Main.uiGroup.add_actor(text);
    }

    text.opacity = 255;

    let monitor = Main.layoutManager.primaryMonitor;

    text.set_position(Math.floor(monitor.width / 2 - text.width / 2),
                      Math.floor(monitor.height / 2 - text.height / 2));

    Tweener.addTween(text,
                     { opacity: 0,
                       time: 2,
                       transition: 'easeOutQuad',
                       onComplete: _hideHello });
}


function refr(){
   
    let [res, pid, in_fd, out_fd, err_fd] = 
        GLib.spawn_async_with_pipes(null, ["date"], null, GLib.SpawnFlags.SEARCH_PATH, null);
    out_reader = new Gio.DataInputStream({ base_stream: new Gio.UnixInputStream({fd: out_fd}) });
   
    let [out, size] = out_reader.read_line(null);  
    
    let label =    new St.Label({ style_class: 'panel-label',
                          text:String(out)});	
	

    

    
    
   // let icon = new St.Icon({ icon_name: 'system-run',
   //                          icon_type: St.IconType.SYMBOLIC,
   //                          style_class: 'system-status-icon' });

  //  button.set_child(icon);
    button.set_child(label);
    
    Mainloop.timeout_add_seconds(10, Lang.bind(this, function() {
                this.refr();
            }));

}

function init() {
      button = new St.Bin({ style_class: 'panel-button',
                          reactive: true,
                          can_focus: true,
                          x_fill: true,
                          y_fill: false,
                          track_hover: true });
          button.connect('button-press-event', _showHello); 
      refr();

}


function enable() {
    Main.panel._centerBox.add_actor(button, 0);
}

function disable() {
    Main.panel._centerBox.remove_actor(button);
}
