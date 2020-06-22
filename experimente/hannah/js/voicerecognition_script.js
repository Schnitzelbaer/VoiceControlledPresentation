const artyom = new Artyom();
console.log("hello its working");

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
            $(".intro").html("You entered: " + recognizedVoiceInput);

            console.log("this ist the FuseSearch" + recognizedSearch);

            const options = {
            includeScore: true
            }

            const fuse = new Fuse(arr, options);

            const result = fuse.search(recognizedSearch);

            var api = impress();
            api.init();
            api.goto(result[0].refIndex);
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

artyom.addCommands(myGroup);
