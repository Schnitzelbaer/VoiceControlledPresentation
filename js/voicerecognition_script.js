var slidesInfos = [];

var result = [];

var indexNumbers = [];

var refIndexCycle = 0;

var customScaleValue = 0.7;



$(document).ready(function() {

  // creates an array of slides and lets the image recognition run over them
  var $slideDivs = $('#impress > div');
  slidesInfos = $slideDivs.map(function(i, el) {

    var htmlInput = $(el).find("p").parent().html();
    var id = $(el).attr('id');

    if (htmlInput == undefined) {
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
      imgFilename = imgUrl.substring(imgUrl.lastIndexOf('/') + 1);
    }
    return {
      refIndex: i,
      id: id,
      refSlideDiv: $(el),
      paragraphs: splitResult,
      imgSource: imgFilename
    }
  });

  slidesInfos = slidesInfos.toArray();

  // initialize the image classifier method with MobileNet
  var classifier = ml5.imageClassifier('MobileNet', modelLoaded);

  // prints "Model Loaded" when the model is loaded
  function modelLoaded() {
    console.log('Model Loaded!');
  }

  $('#impress').children('div').each(function(index, element) {
    var pixelSource = this.getElementsByTagName('img')[0];
    if (pixelSource) {
      var imgUrl = pixelSource.src;
      var imgFilename = imgUrl.substring(imgUrl.lastIndexOf('/') + 1);
      classifier.predict(pixelSource, function(err, results) {
        var filteredResults = _.filter(results, function(o) {
          return o.confidence > 0.3
        });
        var slidesWithThatImg = _.find(slidesInfos, function(o) {
          return o.imgSource === imgFilename;
        });
        slidesWithThatImg['classifier'] = filteredResults;
      });
    }
  });
  impress().init();
});


//fullscreen event makes navigation bar appear or disappear
document.addEventListener("fullscreenchange", function(event) {
  if (document.fullscreenElement) {
    removeMenuBar();
  } else {
    showMenuBar();
    customScaleValue = 0.7;
  }
});

//button event makes side bar appear
function openNav() {
  document.getElementById("mySidenav").style.width = "0px";
  document.getElementById("call2action2").style.visibility = "hidden";
  document.getElementById("call2action3").style.visibility = "visible";
}

//button event makes side bar disappear
function closeNav() {
  document.getElementById("mySidenav").style.width = "220px";
  document.getElementById("call2action2").style.visibility = "visible";
  document.getElementById("call2action3").style.visibility = "hidden";
}

//moves the camera to the overview
function gotoOverview() {
  var api = impress();
  api.init();
  api.goto(12);
}

// artyom is resposible for the voice commands and speech synthesis
var artyom = new Artyom();

function startRec() {
  var elem = document.getElementById("call2action");
  elem.value = 'listening!';
  openFullscreen();

  customScaleValue = 1.0;

  startContinuousArtyom();
  $(".status").fadeTo("slow", 1);

  //voice input visualizer
  "use strict";
  var paths = document.getElementsByTagName('path');
  var visualizer = document.getElementById('visualizer');
  var mask = visualizer.getElementById('mask');
  var path;
  var report = 0;

  var soundAllowed = function(stream) {

    window.persistAudioStream = stream;
    var audioContent = new AudioContext();
    var audioStream = audioContent.createMediaStreamSource(stream);
    var analyser = audioContent.createAnalyser();
    audioStream.connect(analyser);
    analyser.fftSize = 1024;

    var frequencyArray = new Uint8Array(analyser.frequencyBinCount);
    visualizer.setAttribute('viewBox', '0 0 255 255');

    //Through the frequencyArray has a length longer than 255, there seems to be no
    //significant data after this point. Not worth visualizing.
    for (var i = 0; i < 255; i++) {
      path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('stroke-dasharray', '4,1');
      mask.appendChild(path);
    }
    var doDraw = function() {
      requestAnimationFrame(doDraw);
      analyser.getByteFrequencyData(frequencyArray);
      var adjustedLength;
      for (var i = 0; i < 255; i++) {
        adjustedLength = Math.floor(frequencyArray[i]) - (Math.floor(frequencyArray[i]) % 5);
        paths[i].setAttribute('d', 'M ' + (i) + ',255 l 0,-' + adjustedLength);
      }
    }
    doDraw();
  }

  var soundNotAllowed = function(error) {
    console.log(error);
  }
  navigator.getUserMedia({
    audio: true
  }, soundAllowed, soundNotAllowed);

}


artyom.ArtyomVoicesIdentifiers["en-US"].unshift('Google US English', 'Alex');

function startContinuousArtyom() {
  artyom.fatality(); // use this to stop any of

  setTimeout(function() { // if you use artyom.fatality , wait 250 ms to initialize again.
    artyom.initialize({
      lang: "en-GB", // language
      continuous: true, // Artyom will listen forever
      listen: true, // start recognizing
      debug: true, // show everything in the console
      speed: 1, // talk normally
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
var searchTerm;

// checks whether the speaker has finished
artyom.redirectRecognizedTextOutput(function(recognized, isFinal) {
  if (isFinal) {
    console.log("Final recognized text: " + recognized);
    $(".currentResult").html(recognized);

    // removing the hotkeys
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


// definition of all the commands
var myGroup = [
  stopListening = {
    indexes: ["stop listening"],
    action: function() {
      artyom.dontObey();
      // Try to execute the say hi command, nothing will happen
      // but in 10 seconds, the command recognition will be available again
      setTimeout(function() {
        artyom.obey();
        // execute the say hi command and then it will work !
      }, 10000);
    }
  },

  // tell the speech assistant to stop talking
  stopTalking = {
    indexes: ["stop talking", "please stop talking", "shut up", "be quiet"],
    action: function() {
      artyom.shutUp();
    }
  },

  // ask the speech assistant to say something
  tellMeSomething = {
    indexes: ["tell me something"],
    action: function() {
      artyom.say("Voice user interfaces have been added to automobiles, home automation systems, computer operating systems, home appliances like washing machines and microwave ovens, but not yet in presentations.");
    }
  },

  // command to go to the start
  firstslide = {
    indexes: ["first slide", "bring me to the start", "start from the beginning"],
    action: function() {
      var api = impress();
      api.init();
      api.goto(0);
    }
  },

  // command to go to the end
  lastslide = {
    indexes: ["last slide", "bring me to the end", "thank you"],
    action: function() {
      var api = impress();
      api.init();
      api.goto(11);
    }
  },

  // command to go to the next slide
  nextSlide = {
    indexes: ["next slide", "next slide please", "next please", "start with a question", "conversation design",
      "interaction", "definition", "controlled", "recognition", "hidden markov model"],
    action: function() {
      var api = impress();
      api.init();
      api.next();
    }
  },

  // command to go to the previous slide
  previousSlide = {
    indexes: ["go back", "previous slide", "last slide", "back to the last", "one back", "last slide please"],
    action: function() {
      var api = impress();
      api.init();
      api.prev();
    }
  },

  // command to read the quote
  readContent = {
    indexes: ["read the quote", "read to me", "google"],
    action: function() {
      var quoteWritten = document.getElementById("questionQuote").textContent;
      artyom.say(quoteWritten);
      console.log("this is the text: " + quoteWritten);
    }
  },

  // command to search a term on all the slides
  navigateToSearch = {
    smart: true,
    indexes: ["search for *"],
    action: function(i, wildcard) {

      // Speak alterable value
      console.log("this ist the FuseSearch: " + recognizedSearch);

      // Clear variables from previous searches
      refIndexCycle = 0;
      indexNumbers.length = 0;

      var options = {
        includeScore: true,
        includeMatches: true,
        ignoreLocation: true,
        keys: ['paragraphs', 'classifier.label']
      }

      var fuse = new Fuse(slidesInfos, options);

      var result = fuse.search(recognizedSearch);
      console.log(result);

      // picks out all search results with a search-score lower than 0.3
      var filteredResults = _.filter(result, function(r) {
        return r.score < 0.3;
      });

      console.log("filteredResults = ", filteredResults);

      // fills variable "indexNumbers" with all the refIndex-numbers from all filteredResults
      for (var index = 0; index < filteredResults.length; index++) {
        indexNumbers.push(filteredResults[index].item.refIndex);
      }

      console.log("indexNumbers = ", indexNumbers);

      $("#impress").find("span").contents().unwrap();

      // Highlighting the current search-term
      filteredResults.forEach(function(r) {
        console.log("actual ID = ", "#" + r.item.id)
        var idString = "#" + r.item.id;
        new HR(idString, {
          highlight: [recognizedSearch],
          backgroundColor: "#3FF9A0"
        }).hr();
      });

      // jumps to the first search result
      if (indexNumbers.length > 0) {
        searchTerm = recognizedSearch;
         document.getElementById("SearchTerm").innerHTML = searchTerm + " " + (refIndexCycle + 1) + "/" + indexNumbers.length;

        var api = impress();
        api.init();
        api.goto(indexNumbers[0]);
      } else {
         document.getElementById("SearchTerm").innerHTML = "Sorry, no Search Results found :(";
        artyom.say("Sorry, no Search Results found");
      }

      // shows search bar after search-input
       document.getElementById("SearchTerm").style.visibility = "visible";

    }
  },

  // command to navigate to the next search result
  navigateToNextResult = {
    indexes: ["next result"],
    action: function() {

      if (indexNumbers.length > 0) {
        if (refIndexCycle < indexNumbers.length - 1) {
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

         document.getElementById("SearchTerm").style.display = "block";
         document.getElementById("SearchTerm").innerHTML = searchTerm + " " + (refIndexCycle + 1) + "/" + indexNumbers.length;
      }
    }
  },

  // command to navigate to the previous search result
  navigateToPreviousResult = {
    indexes: ["previous result"],
    action: function() {
      if (indexNumbers.length > 0) {
        if (refIndexCycle <= indexNumbers.length - 1 && refIndexCycle > 0) {
          refIndexCycle--;

          var api = impress();
          api.init();
          api.goto(indexNumbers[refIndexCycle]);
        } else {
          refIndexCycle = indexNumbers.length - 1;

          var api = impress();
          api.init();
          api.goto(indexNumbers[refIndexCycle]);
        }

         document.getElementById("SearchTerm").style.display = "block";

         //provides information at which result within the search you are
         document.getElementById("SearchTerm").innerHTML = searchTerm + " " + (refIndexCycle + 1) + "/" + indexNumbers.length;
      }
    }
  },

  // command to end the search mode
  exitResult = {
    indexes: ["that's it", "stop search", "select slide", "select result", "exit search"],
    action: function() {

      // removes the search bar
      document.getElementById("SearchTerm").style.visibility = "hidden";

      // clear variables from previous searches
      refIndexCycle = 0;
      indexNumbers.length = 0;

      // removes all highlighting
      $("#impress").find("span").contents().unwrap();
    }
  },

  // command to end the presentation
  endPresentation = {
    indexes: ["stop presentation"],
    action: function() {
      // showSidebar();
      customScaleValue = 0.7;
      closeFullscreen();
    }
  },

  // command to navigate to a specific slide
  navigateToDestinations = {
    smart: true,
    indexes: ["go to the *"],
    action: function(i, wildcard) {
      console.log("this ist the Input" + recognizedWildcard);
      var calledDestination = document.getElementById(recognizedWildcard);
      var api = impress();
      api.init();
      api.goto(calledDestination);
    }
  },

  // command to add bulletpoints to the slide
  addBulletpoints = {
    smart: true,
    indexes: ["please write down *"],
    action: function(i, wildcard) {
      var node = document.createElement("LI");
      var textnode = document.createTextNode(String(recognizedContent));
      node.appendChild(textnode);
      node.id = String(recognizedContent);
      document.getElementById("Ideas").appendChild(node);
      $("#myList").animate({
        opacity: ".5",
        textIndent: "20px"
      })
    }
  },

  // command to delete bulletpoints from the slide
  deleteBulletpoints = {
    smart: true,
    indexes: ["delete *"],
    action: function(i, wildcard) {
      document.getElementById(recognizedDelete).remove();
    }
  }
];

// adds all the commands to Artyom
artyom.addCommands(myGroup);

var elem = document.documentElement;

// function to request fullscreen
function openFullscreen() {
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.mozRequestFullScreen) { /* Firefox */
    elem.mozRequestFullScreen();
  } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) { /* IE/Edge */
    elem.msRequestFullscreen();
  }
}

// function to end fullscreen
function closeFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.mozCancelFullScreen) { /* Firefox */
    document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen) { /* Chrome, Safari and Opera */
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) { /* IE/Edge */
    document.msExitFullscreen();
  }
}

// function to remove the menu bars
function removeMenuBar() {
  document.getElementById("mySidenav").style.visibility = "hidden";
  document.getElementById("header").style.visibility = "hidden";
  document.getElementById("call2action2").style.visibility = "hidden";
  document.getElementById("call2action3").style.visibility = "hidden";

};

// function to show the menu bars
function showMenuBar() {
  document.getElementById("mySidenav").style.visibility = "visible";
  document.getElementById("header").style.visibility = "visible";
  document.getElementById("call2action2").style.visibility = "visible";
  document.getElementById("mySidenav").style.width = "220px";
};
