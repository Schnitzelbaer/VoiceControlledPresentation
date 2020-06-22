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
      name: "Tom" // Analogy to "Alexa" it it is enabled > you can only give commands when you start with Anna
    }).then(function() {
      console.log("Ready to work !");
    });
  }, 250);

}


var userInput;
var recognizedVoiceInput;
var recognizedWildcard;
var wildcardString;

artyom.redirectRecognizedTextOutput(function(recognized, isFinal) {
  if (isFinal) {
    console.log("Final recognized text: " + recognized);
    $(".currentResult").html("Recognized: " + recognized);

    // abziehen des hotkeys
    recognizedVoiceInput = recognized.replace('Tom', '')
    recognizedVoiceInput = recognizedVoiceInput.trim();
    console.log("search term is: " + recognizedVoiceInput);

    recognizedWildcard = recognized.replace('Tom go to the', '')
    recognizedWildcard = recognizedWildcard.trim();

    recognizedSearch = recognized.replace('Tom show me the slide with', '')
    recognizedSearch = recognizedSearch.trim();

    recognizedContent = recognized.replace('Tom please write down', '')
    recognizedContent = recognizedContent.trim();

    recognizedDelete = recognized.replace('Tom delete', '')
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
      // responsiveVoice.speak("Voice user interfaces have been added to automobiles, home automation systems, computer operating systems, home appliances like washing machines and microwave ovens, but not yet in presentations.");
      artyom.say("Voice user interfaces have been added to automobiles, home automation systems, computer operating systems, home appliances like washing machines and microwave ovens, but not yet in presentations.");
    }
  },


  backHome = {
    indexes: ["back to start", "start from the beginning"],
    action: function() {
      $(".intro").html("You entered: " + recognizedVoiceInput);
      // responsiveVoice.speak("You entered" + recognizedVoiceInput);
      // artyom.say("You entered" + recognizedVoiceInput);
      var api = impress();
      api.init();
      api.goto(0);
    }
  },


  nextSlide = {
    indexes: ["next slide", "next slide please", "next please"],
    action: function() {
      $(".intro").html("You entered: " + recognizedVoiceInput);
      // responsiveVoice.speak("You entered " + recognizedVoiceInput);
      // artyom.say("You entered " + recognizedVoiceInput);
      var api = impress();
      api.init();
      api.next();
    }
  },

  previousSlide = {
    indexes: ["go back", "previous slide", "last slide", "back to the last", "one back", "last slide please"],
    action: function() {
      $(".intro").html("You entered: " + recognizedVoiceInput);
      // responsiveVoice.speak("You entered " + recognizedVoiceInput);
      // artyom.say("You entered " + recognizedVoiceInput);
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


  navigateToDestinations = {
    smart: true,
    indexes: ["show me the slide with *"],
    action: function(i, wildcard) {
      // Speak alterable value
      $(".intro").html("You entered: " + recognizedVoiceInput);
      artyom.say("I will show you the" + wildcard);
      // console.log("Hello:"+ String(wildcard));
      // console.log("this ist the recognizedWildcard " + recognizedWildcard);
      // console.log("this ist the recognizedVoiceInput " + recognizedVoiceInput);
      console.log("this ist the Input" + recognizedSearch);

      // var api = impress();
      // api.init();
      // api.goto( calledDestination );
    }
  },

  navigateToDestinations = {
    smart: true,
    indexes: ["go to the *"],
    action: function(i, wildcard) {
      // Speak alterable value
      $(".intro").html("You entered: " + recognizedVoiceInput);
      artyom.say("I will show you the" + wildcard);
      // console.log("Hello:"+ String(wildcard));
      // console.log("this ist the recognizedWildcard " + recognizedWildcard);
      // console.log("this ist the recognizedVoiceInput " + recognizedVoiceInput);
      console.log("this ist the Input" + recognizedWildcard);
      var calledDestination = document.getElementById(recognizedWildcard);
      var api = impress();
      api.init();
      api.goto(calledDestination);
    }
  },


  addBulletpoints = {
    smart: true,
    indexes: ["please write down *"],
    action: function(i, wildcard) {
      // Speak alterable value
      artyom.say("I will add" + wildcard + "to the slide");
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

  deleteBulletpoints = {
    smart: true,
    indexes: ["delete *"],
    action: function(i, wildcard) {
      // Speak alterable value
      artyom.say("I will delete" + wildcard + "from the slide");
      // var list = document.getElementById("Ideas");
      // list.removeChild(list.childNodes[0]);

      document.getElementById(recognizedDelete).remove();
    }
  }
];

artyom.addCommands(myGroup);