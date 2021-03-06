$(document).ready(function() {
  const { ml5 } = window;
  const classifier = ml5.imageClassifier("MobileNet");

  var x = document.getElementById("CommandsIndex");
  if (x.style.display === "none") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }





  //const $slidesInfos = ('#impress').children('div').each.map(function(index, element) {
  $('#impress').children('div').each(function(index, element) {
    var pixelSource;
    var imgClassifierResults;
    pixelSource = this.getElementsByTagName('img')[0];

    if (pixelSource == undefined) {
      console.log('this is undefined');
    } else {
    console.log(this.getElementsByTagName('img')[0]);
    classifier.predict(this.getElementsByTagName('img')[0], function(err, results) {
      console.log(results);
      imgClassifierResults = results;
    });
    }

    // Filter p-Tags
    console.log("el: " + element)
    console.log("i: " + index)

    var splitResult = element.querySelectorAll("p");

    console.log("splitResult = " + splitResult)
    
	  return {
		  ref_div: element,
		  innerHTML: element.innerHTML,
      index: index,
      paragraphs: splitResult,
      imgClassifierContent: imgClassifierResults
    }
  });





  // const $slideDivs = $('#impress > div');
  // const $slidesInfos = $slideDivs.map(function(i, el) {

  //   var imgClassifierResults = "";

  //   // console.log(this.getElementsByTagName('img')[0]);
  //   classifier.predict(this.getElementsByTagName('img')[0], function(err, results) {
  //     imgClassifierResults = results.toString();
  //     console.log("imgClassifierResults" + imgClassifierResults);
  //   });

  //   // Filter p-Tags
  //   console.log("el: " + el)
  //   console.log("i: " + i)

  //   var splitResult = el.querySelectorAll("p");

  //   console.log("splitResult = " + splitResult)
    
	//   return {
	// 	  ref_div: el,
	// 	  innerHTML: el.innerHTML,
  //     index: i,
  //     paragraphs: splitResult,
  //     imgClassifierContent: imgClassifierResults
  //   }
  // });

  // // console.log("Nach dem ganzen Shizzle: " + splitResult);
  // console.log($slidesInfos);



  impress().init();

// documentreadyfunction
});


const artyom = new Artyom();


function startRec() {
  var elem = document.getElementById("call2action");
  elem.value = 'listening!';
  elem.style.color = 'red';

  startContinuousArtyom();
  // responsiveVoice.speak("I'm listening!");
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
var searchTerm;

artyom.redirectRecognizedTextOutput(function(recognized, isFinal) {
  if (isFinal) {
    console.log("Final recognized text: " + recognized);
    $(".currentResult").html("Recognized: " + recognized);

    // abziehen des hotkeys
    // recognizedVoiceInput = recognized.replace('Tom', '')
    // recognizedVoiceInput = recognizedVoiceInput.trim();
    // console.log("search term is: " + recognizedVoiceInput);
    //
    // recognizedWildcard = recognized.replace('Tom go to the', '')
    // recognizedWildcard = recognizedWildcard.trim();
    //
    // recognizedSearch = recognized.replace('Tom search for', '')
    // recognizedSearch = recognizedSearch.trim();
    //
    // recognizedContent = recognized.replace('Tom please write down', '')
    // recognizedContent = recognizedContent.trim();
    //
    // recognizedDelete = recognized.replace('Tom delete', '')
    // recognizedDelete = recognizedDelete.trim();



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
            // console.log("Hello:"+ String(wildcard));
            // console.log("this ist the recognizedWildcard " + recognizedWildcard);
            // console.log("this ist the recognizedVoiceInput " + recognizedVoiceInput);
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
            keys: ['paragraphs']
            }

            const fuse = new Fuse(arr, options);

            const result = fuse.search(recognizedSearch);
            console.log(result);

            searchTerm = recognizedSearch;
            document.getElementById("SearchIndex").style.display = "block";
            document.getElementsByClassName("SearchTerm")[0].innerHTML = searchTerm + " " + (refIndexCycle+1) + "/" + result.length;


            // refIndexes.concat(result.refIndex);
            for (let index = 0; index < result.length; index++) {
              // console.log(result[index].refIndex);
              indexNumbers.push(result[index].refIndex);
            }

            console.log(indexNumbers);

            // var arrLength = result.length;

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
            // Speak alterable value
            $(".intro").html("You entered: " + recognizedVoiceInput);
            // console.log("Hello:"+ String(wildcard));
            // console.log("this ist the recognizedWildcard " + recognizedWildcard);
            // console.log("this ist the recognizedVoiceInput " + recognizedVoiceInput);
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
            // Speak alterable value
            artyom.say("I will add" + wildcard + "to the slide");
            var node = document.createElement("LI");
            var textnode = document.createTextNode(String(recognizedContent));
            node.appendChild(textnode);
            node.id = String(recognizedContent);
            // document.getElementById("Ideas").appendChild(node);
            // console.log("hello:" + recognizedContent);


            var i = 0;
            var speed = 50;

            function typeWriter() {
              if (i < recognizedContent.length) {
                // document.getElementById("myList").appendChild(node) += recognizedContent.charAt(i);
                document.getElementById("myList").innerHTML += recognizedContent.charAt(i);
                i++;
                setTimeout(typeWriter, speed);
              }
            }
            typeWriter();


    }
  },

  deleteBulletpoints = {
    smart:true,
    indexes: ["delete *"],
    action: function(i, wildcard){
            // Speak alterable value
            artyom.say("I will delete" + wildcard + "from the slide");
            // var list = document.getElementById("Ideas");
            // list.removeChild(list.childNodes[0]);

            document.getElementById(recognizedDelete).remove();
    }
  }
];

const result = [];

const indexNumbers = [];

var refIndexCycle = 0;

artyom.addCommands(myGroup);
