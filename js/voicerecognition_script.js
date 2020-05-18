const artyom = new Artyom();


function startRec() {
    var elem = document.getElementById("call2action");
    elem.value = 'listening!';
    elem.style.color = 'red';

    startContinuousArtyom();
    responsiveVoice.speak("The stage is yours!");
    $( ".status" ).fadeTo( "slow" , 1);
}

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
        console.log("search term is: " + recognizedVoiceInput);


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


    newCommand = {
    indexes: ["home", "bring me home", "back to start", "start from the beginning"],
    action: function() {
        $(".intro").html("Give it a try. Tell me which Animal you want to see?" + " <br> <br> Use " + "<span class='blue'>search for …</span>" +" to start.");
    }
}

];

artyom.addCommands(myGroup);
