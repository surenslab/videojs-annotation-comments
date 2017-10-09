// Setup player and plugin
(function(){
    var annotations = [
        {
            id: 1,
            range: {
                start: 15,
                end: 32
            },
            shape: {
                x1: 23.47,
                y1: 9.88,
                x2: 60.83,
                y2: 44.2,
            },
            comments: [
                {
                    id: 1,
                    meta: {
                        datetime: "2017-03-28T19:17:32.238Z",
                        user_id: 1,
                        user_name: "John Smith"
                    },
                    body: "Demo comment."
                }
            ]
        }
    ];
    var player = videojs('the_video');
    player.annotationComments({
        annotationsObjects: annotations,
        bindArrowKeys: true,
        meta: {
            user_id: 1,
            user_name: "John Smith"
        }
    });
})();

// Intercept VAC logs and port them to console UI
(function(){
    window.VAC_DEBUG = true;
    var $console = $(".console"),
        consoleLog = console.log;
    console.log = function (msg) {
        if (msg === "::VAC::") {
            var output = "";
            for(var i = 0; i <= arguments.length; i++) {
                output = output + " " + JSON.stringify(arguments[i]);
            };

            // Remove extra quotes and any undefined
            output = output.replace(/\"/g, "").trim();
            output = output.replace("undefined", "");
            output = ">> " + output;

            var $p = $("<p/>").text(output);
            $console.append($p);
            $console.scrollTop($console[0].scrollHeight)
        }
        consoleLog.apply(console, arguments);
    };
})();

$(".clear-console-btn").on("click", function() {
    $(".console").empty();
});
