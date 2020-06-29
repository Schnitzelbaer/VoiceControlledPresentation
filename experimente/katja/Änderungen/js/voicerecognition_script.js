var slidesInfos = [];

var result = [];

var indexNumbers = [];

var refIndexCycle = 0;



// Füllen des Arrays & Bilderkennung
$(document).ready(function() {

  var $slideDivs = $('#impress > div');
  slidesInfos = $slideDivs.map(function(i, el) {

    var htmlInput = $(el).find("p").parent().html();

    if (htmlInput == undefined) {
      console.log('this p is undefined');
    } else {

      var splitResult = htmlInput.split(/\r?\n|\r/);

      var regex = /(<([^>]+)>)/ig;
      for (x = 0; x < splitResult.length; x++) {
        splitResult[x] = splitResult[x].replace(regex, "").trim();
      }

      splitResult = splitResult.filter(item => item);
    }

    var imgUrl = $(el).find("img").attr("src");
    var imgFilename;
    if (imgUrl) {
      imgFilename = imgUrl.substring(imgUrl.lastIndexOf('/')+1);
    }
    return {
      refIndex: i,
      paragraphs: splitResult,
      imgSource: imgFilename
    }
  });

  slidesInfos = slidesInfos.toArray();
  console.log("slidesInfos = ", slidesInfos);

  // Initialize the Image Classifier method with MobileNet
  var classifier = ml5.imageClassifier('MobileNet', modelLoaded);

  // When the model is loaded
  function modelLoaded() {
    console.log('Model Loaded!');
  }


  $('#impress').children('div').each(function(index, element) {
    var pixelSource = this.getElementsByTagName('img')[0];
    if (pixelSource) {
      var imgUrl = pixelSource.src;
      var imgFilename = imgUrl.substring(imgUrl.lastIndexOf('/')+1);
      console.log("imgFilename:", imgFilename);
      classifier.predict(pixelSource, function(err, results) {
        var filteredResults = _.filter(results, function(o) { return o.confidence > 0.3});
        var slidesWithThatImg = _.find(slidesInfos, function(o) { return o.imgSource === imgFilename; });
        slidesWithThatImg['classifier'] = filteredResults;
      });
    }
  });

  impress().init();
  // documentreadyfunction end
});

// Audiovisualization

window.onload = function () {
    "use strict";
    var paths = document.getElementsByTagName('path');
    var visualizer = document.getElementById('visualizer');
    var mask = visualizer.getElementById('mask');
    var h = document.getElementsByTagName('h1')[0];
    var path;
    var report = 0;

    var soundAllowed = function (stream) {
        //Audio stops listening in FF without // window.persistAudioStream = stream;
        //https://bugzilla.mozilla.org/show_bug.cgi?id=965483
        //https://support.mozilla.org/en-US/questions/984179
        window.persistAudioStream = stream;
        h.innerHTML = "Thanks";
        h.setAttribute('style', 'opacity: 0;');
        var audioContent = new AudioContext();
        var audioStream = audioContent.createMediaStreamSource( stream );
        var analyser = audioContent.createAnalyser();
        audioStream.connect(analyser);
        analyser.fftSize = 1024;

        var frequencyArray = new Uint8Array(analyser.frequencyBinCount);
        visualizer.setAttribute('viewBox', '0 0 255 255');

				//Through the frequencyArray has a length longer than 255, there seems to be no
        //significant data after this point. Not worth visualizing.
        for (var i = 0 ; i < 255; i++) {
            path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('stroke-dasharray', '4,1');
            mask.appendChild(path);
        }
        var doDraw = function () {
            requestAnimationFrame(doDraw);
            analyser.getByteFrequencyData(frequencyArray);
          	var adjustedLength;
            for (var i = 0 ; i < 255; i++) {
              	adjustedLength = Math.floor(frequencyArray[i]) - (Math.floor(frequencyArray[i]) % 5);
                paths[i].setAttribute('d', 'M '+ (i) +',255 l 0,-' + adjustedLength);
            }
        }
        doDraw();
    }

    var soundNotAllowed = function (error) {
        h.innerHTML = "You must allow your microphone.";
        console.log(error);
    }
    navigator.getUserMedia({audio:true}, soundAllowed, soundNotAllowed);
};





// Artyom Magic
var artyom = new Artyom();
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
  // Artyom Magic end
});



// Versuch unser Array zu reproduzieren
var slidesInfosTest = [{
    imgSource: "images/ballon.jpg",
    paragraphs: ['Voice User Interfaces', 'PRESENTATION'],
    refIndex: 0,
  },
  {
    imgSource: undefined,
    paragraphs: ["Name some Ideas"],
    refIndex: 1,
  }
]


// Test-Array von Fuse.js-Website
var list = [{
    title: "Old Man's War",
    refIndex: 0,
    author: {
      name: 'John Scalzi',
      tags: [{
        value: 'American'
      }]
    }
  },
  {
    title: 'The Lock Artist',
    refIndex: 1,
    author: {
      name: 'Steve Hamilton',
      tags: [{
        value: 'English'
      }]
    }
  }
]

// Keywords Definition
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
    indexes: ["next slide", "next slide please", "next please", "next"],
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
  // Fuse Search
  navigateToSearch = {
    smart: true,
    indexes: ["search for *"],
    action: function(i, wildcard) {
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


      var options = {
        includeScore: true,
        keys: ['paragraphs']
      }

      var fuse = new Fuse(slidesInfos, options);

      var result = fuse.search(recognizedSearch);
      console.log(result);

    }
  },

  // navigateToNextResult = {
  //   indexes: ["next result"],
  //   action: function(){
  //
  //     if(refIndexCycle < indexNumbers.length-1) {
  //       refIndexCycle++;
  //
  //       var api = impress();
  //       api.init();
  //       api.goto(indexNumbers[refIndexCycle]);
  //     } else {
  //       refIndexCycle = 0;
  //
  //       var api = impress();
  //       api.init();
  //       api.goto(indexNumbers[refIndexCycle]);
  //     }
  //
  //     document.getElementsByClassName("SearchTerm")[0].innerHTML = searchTerm + " " + (refIndexCycle+1) + "/" + indexNumbers.length;
  //   }
  // },
  //
  // navigateToPreviousResult = {
  //   indexes: ["previous result"],
  //   action: function(){
  //
  //     if(refIndexCycle <= indexNumbers.length-1 && refIndexCycle > 0) {
  //       refIndexCycle--;
  //
  //       var api = impress();
  //       api.init();
  //       api.goto(indexNumbers[refIndexCycle]);
  //     } else {
  //       refIndexCycle = indexNumbers.length-1;
  //
  //       var api = impress();
  //       api.init();
  //       api.goto(indexNumbers[refIndexCycle]);
  //     }
  //
  //     document.getElementsByClassName("SearchTerm")[0].innerHTML = searchTerm + " " + (refIndexCycle+1) + "/" + indexNumbers.length;
  //   }
  // },
  //
  // exitResult = {
  //   indexes: ["that's it", "stop search", "select slide", "select result"],
  //   action: function(){
  //
  //     document.getElementById("SearchIndex").style.display = "none";
  //
  //     // Clear Variables from previous searches
  //     refIndexCycle = 0;
  //     indexNumbers.length = 0;
  //   }
  // }

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

artyom.addCommands(myGroup);
