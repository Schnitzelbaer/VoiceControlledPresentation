var slidesInfos = [];

$(document).ready(function() {

  var $slideDivs = $('#impress > div');
    slidesInfos = $slideDivs.map(function(i, el) {

      var htmlInput = $(el).find("p").parent().html();

      if (htmlInput == undefined) {
          console.log('this is undefined');
        } else {

      var splitResult = htmlInput.split(/\r?\n|\r/);

      var regex = /(<([^>]+)>)/ig;
      for(x = 0; x < splitResult.length; x++) {
        splitResult[x] = splitResult[x].replace(regex, "").trim();
      }

      splitResult = splitResult.filter(item => item);
    }

      return {
        paragraphs: splitResult,
        imgSource: $(el).find("img").attr("src")
      }
    });

    console.log(slidesInfos);
    console.log(Object.keys(slidesInfos));

    // Initialize the Image Classifier method with MobileNet
    const classifier = ml5.imageClassifier('MobileNet', modelLoaded);

    // When the model is loaded
    function modelLoaded() {
      console.log('Model Loaded!');
    }


    $('#impress').children('div').each(function(index, element) {
        var pixelSource;
        pixelSource = this.getElementsByTagName('img')[0];

        if (pixelSource == undefined) {
          console.log('this is undefined');
        } else {
        classifier.predict(this.getElementsByTagName('img')[0], function(err, results) {
          // var names = items.map(function(item) {
          //   return item['name'];
          // });
          console.log(results);
        });
      }

    });


    impress().init();
// documentreadyfunction end
});


// Show Hide commands Index
function showHidecommandsIndex() {
  var x = document.getElementById("CommandsIndex");
  if (x.style.display === "none") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }
}

const artyom = new Artyom();
console.log("hello its working");

function startRec() {
  var elem = document.getElementById("call2action");
  elem.value = 'listening!';
  elem.style.color = 'red';

  startContinuousArtyom();
  artyom.say("I'm listening!");
  $(".status").fadeTo("slow", 1);


}

artyom.ArtyomVoicesIdentifiers["en-US"].unshift('Google US English', 'Alex');

function startContinuousArtyom() {
  artyom.fatality(); // use this to stop any of

  setTimeout(function() { // if you use artyom.fatality , wait 250 ms to initialize again.
    artyom.initialize({
      lang: "en-GB", // A lot of languages are supported. Read the docs !
      continuous: true, // Artyom will listen forever
      listen: true, // Start recognizing
      debug: true, // Show everything in the console
      speed: 1, // talk normally
      // name: "Tom" // Analogy to "Alexa" it it is enabled > you can only give commands when you start with Anna
    }).then(function() {
      console.log("Ready to work !");
    });
  }, 250);

}

var userInput;
var recognizedVoiceInput;
var recognizedWildcard;
var wildcardString;
var recognizedSearch;

artyom.redirectRecognizedTextOutput(function(recognized, isFinal) {
  if (isFinal) {
    console.log("Final recognized text: " + recognized);
    $(".currentResult").html("Recognized: " + recognized);


    // abziehen des hotkeys
    recognizedVoiceInput = recognized;

    recognizedWildcard = recognized.replace('go to the', '')
    recognizedWildcard = recognizedWildcard.trim();

    recognizedSearch = recognized.replace('search for', '')
    recognizedSearch = recognizedSearch.trim();

    recognizedContent = recognized.replace('please write down', '')
    recognizedContent = recognizedContent.trim();

    recognizedDelete = recognized.replace('delete', '')
    recognizedDelete = recognizedDelete.trim();

  } else {
    console.log(recognized);

  }
});


var myGroup = [
  stopListening = {
    indexes: ["stop listening"],
    action: function() {
      $(".intro").html("You entered: " + recognizedVoiceInput);
      artyom.dontObey();
      // Try to execute the say hi command, nothing will happen
      // but in 10 seconds, the command recognition will be available again
      setTimeout(function() {
      artyom.obey();
        // execute the say hi command and then it will work !
      }, 10000);
    }
  },

  stopTalking = {
    indexes: ["stop talking", "please stop talking", "shut up", "be quiet"],
    action: function() {
    artyom.shutUp();
    }
  },

  tellMeSomething = {
    indexes: ["tell me something"],
    action: function() {
      artyom.say("Voice user interfaces have been added to automobiles, home automation systems, computer operating systems, home appliances like washing machines and microwave ovens, but not yet in presentations.");
    }
  },

  backHome = {
    indexes: ["back to start", "start from the beginning"],
    action: function() {
      $(".intro").html("You entered: " + recognizedVoiceInput);
      var api = impress();
      api.init();
      api.goto(0);
    }
  },

  nextSlide = {
    indexes: ["next slide", "next slide please", "next please"],
    action: function() {
      $(".intro").html("You entered: " + recognizedVoiceInput);
      var api = impress();
      api.init();
      api.next();
    }
  },

  previousSlide = {
    indexes: ["go back", "previous slide", "last slide", "back to the last", "one back", "last slide please"],
    action: function() {
      $(".intro").html("You entered: " + recognizedVoiceInput);
      var api = impress();
      api.init();
      api.prev();
    }
  },

  readContent = {
    indexes: ["read the quote", "read to me"],
    action: function() {
      $(".intro").html("You entered: " + recognizedVoiceInput);
      var quoteWritten = document.getElementById("questionQuote").textContent;
      artyom.say(quoteWritten);
      console.log("this is the text: " + quoteWritten);
    }
  },


  navigateToSearch = {
    smart:true,
    indexes: ["search for *"],
    action: function(i, wildcard){
            // Speak alterable value
            $(".intro").html("You entered: " + recognizedVoiceInput);
            console.log("this ist the FuseSearch: " + recognizedSearch);

            var div = document.getElementsByTagName('div'),
            p = document.createElement("p");
            p.innerHTML = 'I am p Tag';
            div[0].append(p);

            // Clear Variables from previous searches
            refIndexCycle = 0;
            indexNumbers.length = 0;


            const options = {
            includeScore: true,
            keys: ['0.paragraphs']
            }

            const fuse = new Fuse(slidesInfos, options);

            const result = fuse.search(recognizedSearch);
            console.log(result);

            searchTerm = recognizedSearch;
            document.getElementById("SearchIndex").style.display = "block";
            document.getElementsByClassName("SearchTerm")[0].innerHTML = searchTerm + " " + (refIndexCycle+1) + "/" + result.length;


            for (var index = 0; index < result.length; index++) {
              indexNumbers.push(result[index].refIndex);
            }

            console.log(indexNumbers);

            console.log(result[0].refIndex);

            var api = impress();
            api.init();
            api.goto(result[0].refIndex);
    }
  },

  navigateToNextResult = {
    indexes: ["next result"],
    action: function(){

      if(refIndexCycle < indexNumbers.length-1) {
        refIndexCycle++;

        var api = impress();
        api.init();
        api.goto(indexNumbers[refIndexCycle]);
      } else {
        refIndexCycle = 0;

        var api = impress();
        api.init();
        api.goto(indexNumbers[refIndexCycle]);
      }

      document.getElementsByClassName("SearchTerm")[0].innerHTML = searchTerm + " " + (refIndexCycle+1) + "/" + indexNumbers.length;
    }
  },

  navigateToPreviousResult = {
    indexes: ["previous result"],
    action: function(){

      if(refIndexCycle <= indexNumbers.length-1 && refIndexCycle > 0) {
        refIndexCycle--;

        var api = impress();
        api.init();
        api.goto(indexNumbers[refIndexCycle]);
      } else {
        refIndexCycle = indexNumbers.length-1;

        var api = impress();
        api.init();
        api.goto(indexNumbers[refIndexCycle]);
      }

      document.getElementsByClassName("SearchTerm")[0].innerHTML = searchTerm + " " + (refIndexCycle+1) + "/" + indexNumbers.length;
    }
  },

  navigateToNextResult = {
    indexes: ["that's it", "stop search", "select slide", "select result"],
    action: function(){

      document.getElementById("SearchIndex").style.display = "none";

      // Clear Variables from previous searches
      refIndexCycle = 0;
      indexNumbers.length = 0;
    }
  },

  navigateToDestinations = {
    smart:true,
    indexes: ["go to the *"],
    action: function(i, wildcard){
            console.log("this ist the Input" + recognizedWildcard);
            var calledDestination = document.getElementById(recognizedWildcard);
            var api = impress();
            api.init();
            api.goto( calledDestination );
    }
  },


  addBulletpoints = {
    smart:true,
    indexes: ["please write down *"],
    action: function(i, wildcard){
            var node = document.createElement("LI");
            var textnode = document.createTextNode(String(recognizedContent));
            node.appendChild(textnode);
            node.id = String(recognizedContent);
            document.getElementById("Ideas").appendChild(node);
    }
  },

  deleteBulletpoints = {
    smart:true,
    indexes: ["delete *"],
    action: function(i, wildcard){
            document.getElementById(recognizedDelete).remove();
    }
  }
];

const result = [];

const indexNumbers = [];

var refIndexCycle = 0;

artyom.addCommands(myGroup);


// Soundvisualisierung
window.onload = function() {
  "use strict";
  var paths = document.getElementsByTagName('path');
  var visualizer = document.getElementById('visualizer');
  var mask = visualizer.getElementById('mask');
  var h = document.getElementsByTagName('h1')[0];
  var hSub = document.getElementsByTagName('h1')[1];
  var AudioContext;
  var audioContent;
  var start = false;
  var permission = false;
  var path;
  var seconds = 0;
  var loud_volume_threshold = 30;

  var soundAllowed = function(stream) {
    permission = true;
    var audioStream = audioContent.createMediaStreamSource(stream);
    var analyser = audioContent.createAnalyser();
    var fftSize = 1024;

    analyser.fftSize = fftSize;
    audioStream.connect(analyser);

    var bufferLength = analyser.frequencyBinCount;
    var frequencyArray = new Uint8Array(bufferLength);

    visualizer.setAttribute('viewBox', '0 0 255 255');

    for (var i = 0; i < 255; i++) {
      path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('stroke-dasharray', '4,1');
      mask.appendChild(path);
    }
    var doDraw = function() {
      requestAnimationFrame(doDraw);
      if (start) {
        analyser.getByteFrequencyData(frequencyArray);
        var adjustedLength;
        for (var i = 0; i < 255; i++) {
          adjustedLength = Math.floor(frequencyArray[i]) - (Math.floor(frequencyArray[i]) % 5);
          paths[i].setAttribute('d', 'M ' + (i) + ',255 l 0,-' + adjustedLength);
        }
      } else {
        for (var i = 0; i < 255; i++) {
          paths[i].setAttribute('d', 'M ' + (i) + ',255 l 0,-' + 0);
        }
      }
    }


    doDraw();
  }

  var soundNotAllowed = function(error) {
    h.innerHTML = "You must allow your microphone.";
    console.log(error);
  }


  document.getElementById('button').onclick = function() {
    if (start) {
      start = false;
      this.innerHTML = "Start Listen";
      this.className = "green-button";
    } else {
      if (!permission) {
        navigator.mediaDevices.getUserMedia({
            audio: true
          })
          .then(soundAllowed)
          .catch(soundNotAllowed);

        AudioContext = window.AudioContext || window.webkitAudioContext;
        audioContent = new AudioContext();
      }
      start = true;
      this.innerHTML = "Stop Listen";
      this.className = "red-button";
    }
  };
};
