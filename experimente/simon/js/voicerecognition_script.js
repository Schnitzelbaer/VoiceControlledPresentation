const artyom = new Artyom();


function startRec() {
    var elem = document.getElementById("call2action");
    elem.value = 'listening!';
    elem.style.color = 'red';

    startContinuousArtyom();
    responsiveVoice.speak("The stage is yours!");
    $( ".status" ).fadeTo( "slow" , 1);

    // slidesClassNameArray();
}



// slidesClassNameArray = function () {
//     const slides = document.getElementsByClassName('step');
//     const slidesArray = [];

//     for (let i = 0; i < slides.length; i++) {
//         console.log(slides[i]);

//         // At this point we could also push the elements to an array
//         slidesArray.push(slides[i]);
//     }

//     console.log(JSON.stringify(slidesArray, null, 2))
// }




setStartValues = function(){
    document.getElementById('inputBackHome').value = backHome.indexes;
    document.getElementById('inputNextSlide').value = nextSlide.indexes;
    document.getElementById('inputPreviousSlide').value = previousSlide.indexes;
}

updateBackHome = function(){
    var myInput = document.getElementById('inputBackHome');
    var myData = myInput.value;    
    var result = myData.split(',');

    backHome.indexes = result;
}

updateNextSlide = function(){
    var myInput = document.getElementById('inputNextSlide');
    var myData = myInput.value;    
    var result = myData.split(',');

    nextSlide.indexes = result;
}

updatePreviousSlide = function(){
    var myInput = document.getElementById('inputPreviousSlide');
    var myData = myInput.value;    
    var result = myData.split(',');

    previousSlide.indexes = result;
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
            speed: 1 // talk normally
        }).then(function() {
            console.log("Ready to work !");
        });
    }, 250);

}


var userInput;
var recognizedVoiceInput;

artyom.redirectRecognizedTextOutput(function(recognized, isFinal) {
    if (isFinal) {
        console.log("Final recognized text: " + recognized);
        $(".currentResult").html("Recognized: " + recognized);

        // abziehen des hotkeys
        recognizedVoiceInput = recognized.replace('show me', '')
        recognizedVoiceInput = recognizedVoiceInput.trim();
        console.log("understood term: " + recognizedVoiceInput);


    } else {
        console.log(recognized);

    }
});


var myGroup = [

    backHome = {
        indexes: ["back to start", "start from the beginning"],
        action: function() {
            $(".intro").html("You entered: " + recognizedVoiceInput);
        //   responsiveVoice.speak(recognizedVoiceInput + " Oh no, not again!");
        responsiveVoice.speak("Let's do it again");
          var api = impress();
          api.init();
          api.goto(0);
        }
    },

    nextSlide = {
        indexes: ["go to the next slide", "next slide please","next slide", "next please", "show me the next"],
        action: function() {
            $(".intro").html("You entered: " + recognizedVoiceInput);
          responsiveVoice.speak("Next slide");
          var api = impress();
          api.init();
          api.next();
        }
    },

    previousSlide = {
        indexes: ["go back", "go one back", "backt to the last slide", "back to the last", "one back", "last slide please"],
        action: function() {
            $(".intro").html("You entered: " + recognizedVoiceInput);
          responsiveVoice.speak("Last slide again");
          var api = impress();
          api.init();
          api.prev();
        }
    },

    searchSlides = {
        indexes: ["search for"],
        action: function() {
            $(".intro").html("You entered: " + recognizedVoiceInput);

            // abziehen des hotkeys
            recognizedVoiceInput = recognizedVoiceInput.replace('search for', '')
            recognizedVoiceInput = recognizedVoiceInput.trim();
            console.log("final search term is: " + recognizedVoiceInput);
            responsiveVoice.speak("searching for: " + recognizedVoiceInput);

            const options = {
                // isCaseSensitive: false,
                // includeScore: false,
                // shouldSort: true,
                // includeMatches: false,
                // findAllMatches: false,
                // minMatchCharLength: 1,
                // location: 0,
                // threshold: 0.6,
                // distance: 100,
                // useExtendedSearch: false,
                keys: [
                  "slide",
                  "content.pTags"
                ]
              };
              
              const fuse = new Fuse(slideList, options);
              
              // Change the pattern
              const pattern = recognizedVoiceInput

              const searchResults = fuse.search(pattern);
              
            console.log(searchResults);

            const indexNumber = searchResults.refIndex;
            console.log(indexNumber);

            // const key = Object.keys(searchResults)[0];
            // value = searchResults[key]
            // console.log(key,value);

            // alert(value);

            // var api = impress();
            // api.init();
            // api.goto(value);

        }
    },


    newCommand = {
    indexes: ["home", "bring me home", "back to start", "start from the beginning"],
    action: function() {
        $(".intro").html("Give it a try. Tell me which Animal you want to see?" + " <br> <br> Use " + "<span class='blue'>search for …</span>" +" to start.");
    }
}

];


const slideList = [
    { "slide": "step box 1",
        "content": {
            "pTags": ["Welcome to my first shared Presentation!", "Apple", "Kiwi"],
        }
    },
    { "slide": "step box 2",
        "content": {
            "pTags": ["This is the first slide!"],
        }
    },
    { "slide": "step box 3",
        "content": {
            "pTags": ["This slide moves from right to left!", "Apple"],
        }
    },
    { "slide": "step box 4",
        "content": {
            "pTags": ["This slide is in the background!"],
        }
    },
    { "slide": "step box 5",
        "content": {
            "pTags": ["This slide has animation !"],
        }
    },
]



artyom.addCommands(myGroup);
