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

      // searchTerm = recognizedSearch;
      // document.getElementById("SearchIndex").style.display = "block";
      // document.getElementsByClassName("SearchTerm")[0].innerHTML = searchTerm + " " + (refIndexCycle+1) + "/" + result.length;


      // for (var index = 0; index < result.length; index++) {
      //   indexNumbers.push(result[index].refIndex);
      // }
      //
      // console.log(indexNumbers);
      //
      // console.log(result[0].refIndex);
      //
      // var api = impress();
      // api.init();
      // api.goto(result[0].refIndex);
    }
  }

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

  // Keywords Definition end
];

artyom.addCommands(myGroup);
