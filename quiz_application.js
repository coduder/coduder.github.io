//MASTER question object array
var allQuestions = [{
        questionText: "Which color is best?",
        name: "color",
        choices: ["Red", "Green", "Blue", "Yellow", "Purple", "Black"],
        correctAnswer: 1,
        userChoice: -1
    },
    {
        questionText: "How many centimeters are in an inch?",
        name: "centimeter",
        choices: ["2.54", "3.42", "2.45"],
        correctAnswer: 0,
        userChoice: -1
    },
    {
        questionText: "What is Hillary Clinton\'s middle name?",
        name: "middle-name",
        choices: ["Riley", "Hillary", "Dillary", "Rodham", "Regis"],
        correctAnswer: 3,
        userChoice: -1
    }
];


/**
 * Main Page Function
 */
//<<<<<<<<<<<TODO>>>>>>>>>>>
//DONE 1) Set up previous question button functionality 
//DONE 2) Figure out a way to store a users answer
//DONE  -Maybe update the allQuestions array to store users seleciton
//TODO  -Maybe create another array of individual question divs so they can just be 
//          created if they don't exist, or hidden if moving forward instead of deleting
//          and loading the choices UL for every change
//          +This would make storage of choice and display faster probably
//TODO 3) GO TO NEXT QUESTION AND TRY TO IMPLEMENT PROPER BACK TRACKED RADIO CHECKING 
//          for users answers that occurred already, may need to uncheck other answers first
//          the jquery is probably messed up too

$(document).ready(function() {
    //Global javascript variables
    var currQIndex = 0; //index of current question in Viewport
    var tally = 0; //user correct score tally

    //Grab necessary DOM objects
    var $quizPanel = $("#quiz_panel"); //main quiz display div
    var $questionPanel = $("#question_panel");
    var $landingPage = $("#landing_page"); //starting page div
    var $endingPage = $("#ending_page"); //ending page div
    //var $docQuestion = $("#question"); //question text element
    //var $choicesList = $("#choices"); //<ul> wrapping choice radio btns

    //Start with landingPage shown
    initPage();


    /**
     * Start quiz, hide landingPage show quizPanel
     */
    $("#start_btn").on("click", function() {
        $landingPage.hide();
        $quizPanel.show();
        loadQuestion(allQuestions[currQIndex]);
    });


    /**
     * Handle next question button transition set up
     */
    $("#next_question_btn").on("click", function() {

        updateUserChoiceAndTally(allQuestions[currQIndex]);

        //increment current question to next
        currQIndex++;

        //Check for end of quiz 
        if (currQIndex >= allQuestions.length) {
            displayScore();
        }

        //Load next set of quesitons
        loadQuestion(allQuestions[currQIndex]);
    });

    /**
     * Handle prev question button transition set up
     */
    $("#prev_question_btn").on("click", function() {
        updateUserChoiceAndTally(allQuestions[currQIndex]);

        currQIndex--;

        if (currQIndex < 0) {
            alert("This is the first question. You cannot go back further.");
            currQIndex = 0;
        }

        loadQuestion(allQuestions[currQIndex]);

    });

    /**
     * Restarts quiz from scratch WITHOUT saving answers
     */
    $("#restart_btn").on("click", function() {
        var i,
            len;

        //reset user choices to base values
        for (i = 0, len = allQuestions.length; i < len; i++) {
            allQuestions[i].userChoice = -1;
        }

        initPage();
    });

    /**
     * Initialize application with base values of currQIndex, tally, 
     * and page to show landing page and hide all others
     */

    function initPage() {
        currQIndex = 0;
        tally = 0;

        $quizPanel.hide();
        $endingPage.hide();
        $landingPage.show();
    }


    /**
     * Load next question onto page with all choices, if accessed via back tracking, the users previous choice
     * is shown as checked, otherwise the top option is checked
     * 
     * @param {Object} currQuestion - current question object (normally allQuestions[currQIndex])
     */
    function loadQuestion(currQuestion) {
        //Check for existence of question on DOM
        var $questionToLoad = $("#Q_" + currQIndex + "_div");

        //question not found, make it and show it
        if ($questionToLoad.val() == undefined) {

            var qDiv = makeQuestionDiv(currQuestion);
            var justMade = true;
            showQuestion(qDiv, justMade);

        }
        //quesiton is found, show it
        else {

            showQuestion($questionToLoad);

        }

        //ALways ensure an option is checked when the question is viewed, if this is a first time view, check the top option,
        //otherwise check users previous option
        var uChoice = currQuestion.userChoice;
        if (uChoice == -1) {
            $("#radio" + currQIndex + "_0").prop("checked", true);
        } else {
            $("#radio" + currQIndex + "_" + uChoice).prop("checked", true);
        }
    }

    /**
     * Constructs a div enclosing a questions main text and an <ul> of radio button selections.
     * 
     * @param {Object} currQuestion -Current question object to construct question div
     * @return {HTMLElement:div}            -the question div
     */
    function makeQuestionDiv(currQuestion) {
        //Make div
        var DIV_question = document.createElement("div");
        DIV_question.id = "Q_" + currQIndex + "_div";
        DIV_question.classList.add("question_div"); //to apply uniform styling

        //make question text
        var P_questionText = document.createElement("p");
        P_questionText.id = "Q_" + currQIndex + "_text";
        P_questionText.classList.add("question_text");
        P_questionText.innerHTML = currQuestion.questionText;

        //make UL to store radio options
        var UL_choices = document.createElement("ul");
        UL_choices.id = "Q_" + currQIndex + "_choices";
        UL_choices.classList.add("question_choices");

        //populate UL with radio options
        for (var j = 0, len2 = currQuestion.choices.length; j < len2; j++) {
            var li = makeQuestionLI(currQIndex, j, true, "radio", currQuestion.choices[j], currQuestion.name);
            UL_choices.appendChild(li);
        }

        //append UL & text to div
        DIV_question.appendChild(P_questionText);
        DIV_question.appendChild(UL_choices);

        return DIV_question;
    }

    /**
     * Construct and return a question LI to insert into quiz
     * 
     * @param {Number} qIndex       - current question index 
     * @param {Number} idNum        - current choice number
     * @param {Boolean} required    - should this be a required option
     * @param {String}  type 
     * @param {String}  value
     * @param {String}  name        - for grouping radiobuttons
     * @return {HTMLElement:li}            -a LI DOM object with input object embedded
     */
    function makeQuestionLI(qIndex, idNum, required, type, value, name) {
        var li = document.createElement("LI");
        li.id = "li_" + qIndex + "_" + idNum;

        //construct new input element 
        var input = document.createElement("input");
        input.id = type + qIndex + "_" + idNum;
        input.type = type;
        input.value = value;
        if (name) {
            input.name = name;
        }
        input.required = required; //doesn"t do anyting yet because next button is not Submit

        //create label for input
        var label = document.createTextNode(value);

        //construct LI element
        li.appendChild(input);
        li.appendChild(label);

        return li;

    }

    /**
     * Only shows question div specified by showQuestion and hides all others, assumes that newly created questions 
     * will be sent in form of document elements and questions that existed already will be jquery objects
     * 
     * @param {HTMLElement:div} questionToShow -A div containing the question text and choices to show
     * @param {Boolean} questionJustCreated    -Indcator if this question has just being created
     */
    function showQuestion(questionToShow, questionJustCreated) {

        //hide all current children
        $questionPanel.children().hide();

        //append new question to panel and thus show it
        if (questionJustCreated) {
            $questionPanel.append(questionToShow);
        } else {
            questionToShow.show();
        }

    }

    /**
     * Update current user choice in allQuestions[currQIndex] array object, validate user choice and update tally
     * 
     * @param {Object} currQuestion - current question object from allQuestions array
     */
    function updateUserChoiceAndTally(currQuestion) {
        //Grab value of users selection from current question div
        var newChoice = currQuestion.choices.indexOf($("input:checked", "#Q_" + currQIndex + "_choices").val());
        var oldChoice = currQuestion.userChoice;
        var correct = currQuestion.correctAnswer;

        //First time a user has come upon this question
        if (oldChoice == -1) {
            if (newChoice == correct) {
                tally++;
            }

        } else {
            //Thereafter, Only need to update tally if one choice was correct and another wasn't
            if ((oldChoice != correct) && (newChoice == correct)) {
                tally++;
            } else if ((oldChoice == correct) && (newChoice != correct)) {
                tally--;
            }
        }

        //always update userChoice on object
        currQuestion.userChoice = newChoice;
    }

    /**
     * Display ending page and tallied score
     */
    function displayScore() {
        //Tallied score display construction
        $("#display_score_text").text("Your score is " + tally);

        $quizPanel.hide();
        $endingPage.show();
    }
});