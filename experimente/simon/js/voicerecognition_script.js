const artyom = new Artyom();


function startRec() {
    var elem = document.getElementById("call2action");
    elem.value = 'listening!';
    elem.style.color = 'red';

    startContinuousArtyom();
    responsiveVoice.speak("The stage is yours!");
    $( ".status" ).fadeTo( "slow" , 1);
    
    pushHtmlToArray();

    // formToJson();
}


function formToJson(){
    // var formElement = document.getElementById("impress"),
    //     inputElements = formElement.getElementsByTagName("p"),
    //     jsonObject = {};
    // for(var i = 0; i < inputElements.length; i++){
    //     var inputElement = inputElements[i];
    //     jsonObject[inputElement.name] = inputElement.value;

    // }
    // return JSON.stringify(jsonObject);

    // // console.log(jsonObject);




    // var nm1 = document.getElementById('impress'),
    // i, o = {
    //     Tags: []
    // };
    // for (i = 0; i < nm1.length; ++i) {
    //     // if (nm1[i].textContent && nm2[i].textContent)
    //         o.employees.push({
    //             dude: nm1[i].innerHTML
    //         });
    // }

    // console.log(JSON.stringify(o));
}

pushHtmlToArray = function() {
    // let arrayName = []
    // var slideListString = "";
    $(".step").children("p").each(function(){slideList.push(this.parentNode.id.replace("step-", "") + this.outerHTML)});
    // document.getElementById("impress").innerHTML = slideListString;



    var regex = /(<([^>]+)>)/ig;
    for(x = 0; x < slideList.length; x++) {
        slideList[x] = slideList[x].replace(regex, "");
    }



    // var literal = {};

    // for (var i = 0, l = slideList.length; i < l; ++i ) {
    //     console.log(slideList[i]);
    //     literal[slideList[i]] = slideList[i];
    // }





    // slideList = slideList.split(" ");

    // function helper(root) {
    //     var result = {};
               
    //     $('> .impress', root).each(function () {
    //       result[$(this).text()] = $(this).hasClass('step') ? helper($(this).parent()) : $(this).next('p').text();
    //     });
      
    //     return result;
    //   }
      
    //   console.log(helper('body'));

    console.log(slideList);
    // console.log(literal);
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


            // const options = {
            //     // isCaseSensitive: false,
            //     // includeScore: false,
            //     // shouldSort: true,
            //     // includeMatches: false,
            //     // findAllMatches: false,
            //     // minMatchCharLength: 1,
            //     // location: 0,
            //     // threshold: 0.6,
            //     // distance: 100,
            //     // useExtendedSearch: false,
            //     keys: [
            //       "Slide Content "
            //     ]
            //   };
              
            //   const fuse = new Fuse(slideList, options);
              
            //   // Change the pattern
            //   const pattern = recognizedVoiceInput

            //   const searchResults = fuse.search(pattern);
              
            // // console.log(slideList);

            // const indexNumber = searchResults.refIndex;
            // console.log(indexNumber);



            const options = {
                includeScore: true
            }

            const fuse = new Fuse(slideList, options)

            const result = fuse.search(recognizedVoiceInput)

            console.log(result);

            var firstSearchResult = 0;
            var slideNumber = result[firstSearchResult].item;
            // var slideNumber = slideList[firstSearchResult - 1][firstSearchResult].item;

            console.log(slideNumber);
            console.log(slideNumber.charAt(0));

            var api = impress();
            api.init();
            api.goto(slideNumber.charAt(0)-1);


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
    // { "slide": "step box 1",
    //     "content": {
    //         "pTags": ["Welcome to my first shared Presentation!", "Apple", "Kiwi"],
    //     }
    // },
    // { "slide": "step box 2",
    //     "content": {
    //         "pTags": ["This is the first slide!"],
    //     }
    // },
    // { "slide": "step box 3",
    //     "content": {
    //         "pTags": ["This slide moves from right to left!", "Apple"],
    //     }
    // },
    // { "slide": "step box 4",
    //     "content": {
    //         "pTags": ["This slide is in the background!"],
    //     }
    // },
    // { "slide": "step box 5",
    //     "content": {
    //         "pTags": ["This slide has animation !"],
    //     }
    // },
]



artyom.addCommands(myGroup);
