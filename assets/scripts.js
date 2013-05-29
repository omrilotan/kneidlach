(function () {
    // use feature detect to branch this handler
    if (typeof window.addEventListener === "function") {
        addListener = function (ele, evt, func) {
            if (typeof evt === "string") {
                ele.addEventListener(evt, func);
            } else {
                for (var i = 0, loops = evt.length; i < loops; i++) {
                    ele.addEventListener(evt[i], func);
                }
            }
            return ele;
        };
        removeListener = function (ele, evt, func) {
            if (typeof evt === "string") {
                ele.removeEventListener("on" + evt, func);
            } else {
                for (var i = 0, loops = evt.length; i < loops; i++) {
                    ele.removeEventListener("on" + evt[i], func);
                }
            }
            return ele;
        };
    } else if (typeof document.attachEvent === "function") {
        addListener = function (ele, evt, func) {
            if (typeof evt === "string") {
                ele.attachEvent("on" + evt, func);
            } else {
                for (var i = 0, loops = evt.length; i < loops; i++) {
                    ele.attachEvent("on" + evt[i], func);
                }
            }
            return ele;
        };
        removeListener = function (ele, evt, func) {
            if (typeof evt === "string") {
                ele.detachEvent(evt, func);
            } else {
                for (var i = 0, loops = evt.length; i < loops; i++) {
                    ele.detachEvent(evt[i], func);
                }
            }
            return ele;
        };
    } else {
        addListener = function (ele, evt, func) {
            if (typeof evt === "string") {
                ele["on" + evt] = func;
            } else {
                for (var i = 0, loops = evt.length; i < loops; i++) {
                    ele["on" + evt[i]] = func;
                }
            }
            return ele;
        };
        removeListener = function (ele, evt, func) {
            if (typeof evt === "string") {
                ele["on" + evt] = null;
            } else {
                for (var i = 0, loops = evt.length; i < loops; i++) {
                    ele["on" + evt[i]] = null;
                }
            }
            return ele;
        };
    }
})();
// open links in a new tab
var convertAHref = function (element) {
    element = element || document;
    var a = element.getElementsByTagName("a"),
        i = a.length;
    while (i--){
        (function (ele) {
            addListener(ele, "click", function (evt) {
                evt = evt || window.event;
                window.open(ele.href, "external_link");
                evt.returnValue = false;
                evt.cancelBubble = true;
                evt.preventDefault();
                evt.stopPropagation();
                return false;
            });
        })(a[i]);
    }
};
convertAHref(document);
// facebook image album
var facebookAlbum = function (element, options) {
    var defaults = {
            "albumID": 175687492568808,
            "limit": 100,
            "callback": "facebookAlbumInit",
            "overlayClassName": "FBImageOverlay",
            "previewClassName": "FBpreview"
        },
        element = typeof element === "string" ? document.querySelector(element) : element,
        script = document.createElement("script"),
        fragment = document.createDocumentFragment(),
        image,
        a,
        style = document.createElement("style"),
        overlay = document.createElement("div"),
        enlarge;
    for (var key in options) {
        defaults[key] = options[key];
    }
    script.src = "https://graph.facebook.com/"+defaults.albumID+"/photos?limit="+defaults.limit+"&callback="+defaults.callback;
    document.body.appendChild(script);
    
    style.innerHTML = "."+defaults.previewClassName+"{vertical-align:top;cursor:pointer;}" +
                      "."+defaults.overlayClassName+" h3{background:rgba(255,255,255,.7);}" +
                      "."+defaults.overlayClassName+" img{max-height:90%;border:3px solid white;box-shadow:0 0 10px black;}" +
                      "."+defaults.overlayClassName+"{display:none;position:fixed;top:0;left:0;width:100%;height:100%;text-align:center;background:rgba(0,0,0,.7);}";
    document.head.appendChild(style);
    style = null;
    
    overlay.className = defaults.overlayClassName;
    addListener(overlay, "click", function () {
        overlay.style.display = "none";
        overlay.innerHTML = "";
    });
    document.body.appendChild(overlay);
    
    enlarge = function (data) {
        var title = document.createElement("h3"),
            name = data.name ? data.name : data.from.name,
            node = document.createTextNode(name),
            img = document.createElement("img");                    
        title.appendChild(node);
        overlay.appendChild(title);
        img.className = defaults.imageClassName;
        img.src = data.source;
        overlay.style.display = "block";
        overlay.appendChild(img);
    };
    
    window[defaults.callback] = function (result) {
        if (result.error) {
            console.log(result.error.message)
            return;
        }
        var i = result.data.length;
        while (i--) {
            (function (num) {
                image = document.createElement("img");
                a = document.createElement("a");
                image.src = result.data[num].picture;
                image.className = defaults.previewClassName;
                addListener(a, "click", function () {
                    enlarge(result.data[num]);
                });
                //a.href = result.data[num].link;
                a.appendChild(image);
                fragment.appendChild(a);
                a = null;
                image = null;
            })(i);
        }
        element.appendChild(fragment);
        fragment = null;
        element.style.textAlign = "center";
    };
};
facebookAlbum("#FBalbum", {
    "albumID": 175687492568808,
    "callback": "facebookAlbumInit"
});