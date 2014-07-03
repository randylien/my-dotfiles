// Configs
S.cfga({
  "defaultToCurrentScreen" : true,
  "secondsBetweenRepeat" : 0.1,
  "checkDefaultsOnLoad" : true,
  "focusCheckWidthMax" : 3000,
  "orderScreensLeftToRight" : true
});

// Monitors
var firstMonitor = "0",
    secondMonitor = "1",
    thirdMonitor = "2";

// Operations
var lapChat = S.op("corner", {
  "screen" : secondMonitor,
  "direction" : "top-left",
  "width" : "screenSizeX/9",
  "height" : "screenSizeY"
});

var focusTerminal = S.op("focus", {
  "app": "Terminal"
});

var hideDictionary = S.op("hide", {
  "app": "Dictionary"
});

var moveToFirstMonitor = S.op("move", {
  "screen" : firstMonitor,
  "x" : "screenOriginX",
  "y" : "screenOriginY",
  "width" : "screenSizeX",
  "height" : "screenSizeY"
});

var halfScreen = S.op("move", {
  "x" : "screenOriginX",
  "y" : "screenOriginY",
  "width": "screenSizeX/2",
  "height": "screenSizeY"
});

var divideToOneSquare = S.op("corner", {
  "direction" : "top-right",
  "width" : "screenSizeX/2",
  "height" : "screenSizeY/2"
});

var lapMain = lapChat.dup({ "direction" : "top-right", "width" : "8*screenSizeX/9" });

var moveToFirstMonitor13Left = moveToFirstMonitor.dup({ "width" : "screenSizeX/3" }),
    moveToFirstMonitor13Middle = moveToFirstMonitor13Left.dup({ "x" : "screenOriginX+screenSizeX/3" }),
    moveToFirstMonitor13Right = moveToFirstMonitor13Left.dup({ "x" : "screenOriginX+(screenSizeX*2/3)" }),
    moveToFirstMonitor13LeftTop = moveToFirstMonitor13Left.dup({ "height" : "screenSizeY/2" }),
    moveToFirstMonitor13LeftBot = moveToFirstMonitor13LeftTop.dup({ "y" : "screenOriginY+screenSizeY/2" }),
    moveToFirstMonitor13MiddleTop = moveToFirstMonitor13Middle.dup({ "height" : "screenSizeY/2" }),
    moveToFirstMonitor13MiddleBot = moveToFirstMonitor13MiddleTop.dup({ "y" : "screenOriginY+screenSizeY/2" }),
    moveToFirstMonitor13RightTop = moveToFirstMonitor13Right.dup({ "height" : "screenSizeY/2" }),
    moveToFirstMonitor13RightBot = moveToFirstMonitor13RightTop.dup({ "y" : "screenOriginY+screenSizeY/2" });

var tboltRFull = S.op("move", {
  "screen" : thirdMonitor,
  "x" : "screenOriginX",
  "y" : "screenOriginY",
  "width" : "screenSizeX",
  "height" : "screenSizeY"
});
var tboltRLeft = tboltRFull.dup({ "width" : "screenSizeX/3" });
var tboltRMid = tboltRLeft.dup({ "x" : "screenOriginX+screenSizeX/3" });
var tboltRRight = tboltRLeft.dup({ "x" : "screenOriginX+(screenSizeX*2/3)" });
var tboltRLeftTop = tboltRLeft.dup({ "height" : "screenSizeY/2" });
var tboltRLeftBot = tboltRLeftTop.dup({ "y" : "screenOriginY+screenSizeY/2" });
var tboltRMidTop = tboltRMid.dup({ "height" : "screenSizeY/2" });
var tboltRMidBot = tboltRMidTop.dup({ "y" : "screenOriginY+screenSizeY/2" });
var tboltRRightTop = tboltRRight.dup({ "height" : "screenSizeY/2" });
var tboltRRightBot = tboltRRightTop.dup({ "y" : "screenOriginY+screenSizeY/2" });

// common layout hashes
var lapMainHash = {
  "operations" : [lapMain],
  "ignore-fail" : true,
  "repeat" : true
};
var lineHash = {
  "operations" : [lapChat, lapMain],
  "ignore-fail" : true,
  "repeat-last" : true
};

var iTermHash = {
  "operations" : [moveToFirstMonitor13MiddleTop, moveToFirstMonitor13MiddleBot, tboltRMidTop, tboltRMidBot, tboltRRightBot],
  "sort-title" : true,
  "repeat" : true
};
var genBrowserHash = function(regex) {
  return {
    "operations" : [function(windowObject) {
      var title = windowObject.title();
      if (title !== undefined && title.match(regex)) {
        windowObject.doOperation(moveToFirstMonitor13Left);
      } else {
        windowObject.doOperation(lapMain);
      }
    }],
    "ignore-fail" : true,
    "repeat" : true
  };
};

// 3 monitor layout
var threeMonitorLayout = S.lay("threeMonitor", {
  "iTerm" : iTermHash,
  "Google Chrome" : genBrowserHash(/^Developer\sTools\s-\s.+$/),
  "GitX" : {
    "operations" : [moveToFirstMonitor13LeftTop],
    "repeat" : true
  },
  "Firefox" : genBrowserHash(/^Firebug\s-\s.+$/),
  "Safari" : lapMainHash,
  "Spotify" : {
    "operations" : [tboltRRightTop],
    "repeat" : true
  }
});

// 1 monitor layout
var oneMonitorLayout = S.lay("oneMonitor", {
  "_after_" : {
    "operations": focusTerminal
  },
  "_before_": {
    "operations": hideDictionary
  },
  "Google Chrome" : {
    "operations" : [moveToFirstMonitor],
    "ignore-fail" : true,
    "repeat" : true
  },
  "Colloquy": {
    "operations": [divideToOneSquare.dup({"direction": "bottom-right", "screen" : secondMonitor})],
    "ignore-fail": true,
    "repeat": true
  },
  "Sublime Text": {
    "operations": [halfScreen.dup({"screen": secondMonitor})],
    "repeat": true
  },
  "Terminal": {
    "operations": [divideToOneSquare.dup({"direction": "top-right", "screen" : secondMonitor})],
    "ignore-fail": true,
    "repeat": true
  }
});

var twoMonitorLayout = oneMonitorLayout;

// Defaults
S.def(3, threeMonitorLayout);
S.def(2, twoMonitorLayout);
S.def(1, oneMonitorLayout);

// Layout Operations
var threeMonitor = S.op("layout", { "name" : threeMonitorLayout });
var twoMonitor = S.op("layout", { "name" : twoMonitorLayout });
var oneMonitor = S.op("layout", { "name" : oneMonitorLayout });
var universalLayout = function() {
  // Should probably make sure the resolutions match but w/e
  S.log("SCREEN COUNT: "+S.screenCount());
  if (S.screenCount() === 3) {
    threeMonitor.run();
  } else if (S.screenCount() === 2) {
    twoMonitor.run();
  } else if (S.screenCount() === 1) {
    oneMonitor.run();
  }
};

// Batch bind everything. Less typing.
S.bnda({
  // Layout Bindings
  "u:ctrl;alt;cmd" : universalLayout,

  // Resize Bindings
  // NOTE: some of these may *not* work if you have not removed the expose/spaces/mission control bindings
  "right:ctrl;cmd" : S.op("resize", { "width" : "+10%", "height" : "+0" }),
  "left:ctrl;cmd" : S.op("resize", { "width" : "-10%", "height" : "+0" }),
  "up:ctrl;cmd" : S.op("resize", { "width" : "+0", "height" : "-10%" }),
  "down:ctrl;cmd" : S.op("resize", { "width" : "+0", "height" : "+10%" }),
  // "right:alt;cmd;shift" : S.op("resize", { "width" : "-10%", "height" : "+0", "anchor" : "bottom-right" }),
  // "left:cmd;shift;alt" : S.op("resize", { "width" : "+10%", "height" : "+0", "anchor" : "bottom-right" }),
  // "up:alt;cmd;shift" : S.op("resize", { "width" : "+0", "height" : "+10%", "anchor" : "bottom-right" }),
  // "down:alt;cmd;shift" : S.op("resize", { "width" : "+0", "height" : "-10%", "anchor" : "bottom-right" }),

  // Push Bindings
  // NOTE: some of these may *not* work if you have not removed the expose/spaces/mission control bindings
  "r:alt;cmd" : S.op("push", { "direction" : "right", "style" : "bar-resize:screenSizeX/2" }),
  "l:alt;cmd" : S.op("push", { "direction" : "left", "style" : "bar-resize:screenSizeX/2" }),
  "t:alt;cmd" : S.op("push", { "direction" : "up", "style" : "bar-resize:screenSizeY/2" }),
  "b:alt;cmd" : S.op("push", { "direction" : "down", "style" : "bar-resize:screenSizeY/2" }),
  "m:alt,cmd" : S.op("push", { "direction" : "up", "style" : "bar-resize:screenSizeY" }),


  // Nudge Bindings
  // NOTE: some of these may *not* work if you have not removed the expose/spaces/mission control bindings
  "right:ctrl;alt" : S.op("nudge", { "x" : "+10%", "y" : "+0" }),
  "left:ctrl;alt" : S.op("nudge", { "x" : "-10%", "y" : "+0" }),
  "up:ctrl;alt" : S.op("nudge", { "x" : "+0", "y" : "-10%" }),
  "down:ctrl;alt" : S.op("nudge", { "x" : "+0", "y" : "+10%" }),

  // Throw Bindings
  // NOTE: some of these may *not* work if you have not removed the expose/spaces/mission control bindings
  "pad1:ctrl;alt" : S.op("throw", { "screen" : "2", "width" : "screenSizeX", "height" : "screenSizeY" }),
  "pad2:ctrl;alt" : S.op("throw", { "screen" : "1", "width" : "screenSizeX", "height" : "screenSizeY" }),
  "pad3:ctrl;alt" : S.op("throw", { "screen" : "0", "width" : "screenSizeX", "height" : "screenSizeY" }),
  "right:ctrl;alt;cmd" : S.op("throw", { "screen" : "right", "width" : "screenSizeX", "height" : "screenSizeY"}),
  "left:ctrl;alt;cmd" : S.op("throw", { "screen" : "left", "width" : "screenSizeX", "height" : "screenSizeY"}),
  "up:ctrl;alt;cmd" : S.op("throw", { "screen" : "up", "width" : "screenSizeX", "height" : "screenSizeY"}),
  "down:ctrl;alt;cmd" : S.op("throw", { "screen" : "down", "width" : "screenSizeX", "height" : "screenSizeY"}),

  // Focus Bindings
  // NOTE: some of these may *not* work if you have not removed the expose/spaces/mission control bindings
  // "l:cmd" : S.op("focus", { "direction" : "right" }),
  // "h:cmd" : S.op("focus", { "direction" : "left" }),
  // "k:cmd" : S.op("focus", { "direction" : "up" }),
  // "j:cmd" : S.op("focus", { "direction" : "down" }),
  // "k:cmd;alt" : S.op("focus", { "direction" : "behind" }),
  // "j:cmd;alt" : S.op("focus", { "direction" : "behind" }),
  // "right:cmd" : S.op("focus", { "direction" : "right" }),
  // "left:cmd" : S.op("focus", { "direction" : "left" }),
  // "up:cmd" : S.op("focus", { "direction" : "up" }),
  // "down:cmd" : S.op("focus", { "direction" : "down" }),
  // "up:cmd;alt" : S.op("focus", { "direction" : "behind" }),
  // "down:cmd;alt" : S.op("focus", { "direction" : "behind" }),

  // Window Hints
  "esc:cmd" : S.op("hint"),

  // Switch currently doesn't work well so I'm commenting it out until I fix it.
  //"tab:cmd" : S.op("switch"),

  // Grid
  "esc:ctrl" : S.op("grid")
});

// Test Cases
S.src(".slate.test", true);
S.src(".slate.test.js", true);

// Log that we're done configuring
S.log("[SLATE] -------------- Finished Loading Config --------------");
