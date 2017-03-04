var hbjs = require("handbrake-js");

var async = require("async");

var percent = 1;
var encodingOptions = {/*
    input: "test.mkv",
    output:  "helloWorld.mp4",
    quality: 5,
    //"subtitle-lang-list": "eng"
    subtitle: 1,
    "subtitle-burned": ""*/
};

const fs = require('fs');
var path = require('path');

const testFolder = process.argv[2] == undefined ? './':process.argv[2];
start_Burn();

function start_Burn(){
  var videofiles = [];
  fs.readdir(testFolder, (err, files) => {

    //console.log(testFolder);
    files.forEach(file => {
      console.log(file);

      if(path.extname(file) === ".mkv"){

        encodingOptions = {

            //"queue-import-file": "queue file.hbq"
            input: testFolder+"\\"+file,
            output: testFolder+"\\Burned "+path.parse(file).name+".mp4",
            quality: 7,
            aencoder: "mp3",
            //"subtitle-lang-list": "eng"
            subtitle: "1",
            "subtitle-burned": ""
        };
        console.log(testFolder);
        videofiles.push(encodingOptions);

      }
    });

    var count = 0;
    async.timesSeries(videofiles.length,
      function(n,callback){
        console.log(n);
        burn_Video(videofiles[n]);
      },
      function(err, files) {
        console.log("err");
    });
  })
}

function burn_Video(options){

  hbjs.spawn(options)
      .on("begin",function(){
          console.log('beginning '+options.input)
      })
      .on("error", function(err){
          // invalid user input, no video found etc
          console.log(err)
      })
      .on("progress", function(progress){
        if(percent !== Math.trunc(progress.percentComplete)){
          percent = Math.trunc(progress.percentComplete);
          console.log(
              "Percent complete: %s, ETA: %s",
              percent,
              progress.eta
          );
        }
      })
      .on("end", function (complete) {
          console.log('finished.');
      })
      .on("complete", function (complete) {
        console.log("completed.");
        return 0;
      })

}
