//MASTER question object array
var allQuestions = [{
        questionText: "Which color is best?",
        name: "color",
        choices: ["Red", "Orange", "Blue", "Yellow", "Purple", "Black"],
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
    },
    {
        questionText: "What kind of shark has Forest scuba dived with?",
        name: "shark",
        choices: ["Great White", "Tiger", "Thresher", "Hammer Head"],
        correctAnswer: 2,
        userChoice: -1
    }
];


/**
 * Main Page Function
 */
$(document).ready(function() {
    //Global javascript variables
    var currQIndex = 0; //index of current question in Viewport
    var tally = 0; //user correct score tally

    //Grab necessary DOM objects
    var $quizPanel = $("#quiz_panel"); //main quiz display div
    var $questionPanel = $("#question_panel"); //container used for display properties of all question divs
    var $landingPanel = $("#landing_panel"); //starting page div
    var $endingPanel = $("#ending_panel"); //ending page div
    var $prevButton = $("#prev_question_btn");
    var $nextButton = $("#next_question_btn");

    //LOAD START PAGE
    initPage();


    /**
     * EVENT HANDLER
     * Start quiz, hide landingPage show quizPanel
     */
    $("#start_btn").click(function() {
        $landingPanel.hide();
        $quizPanel.show();
        loadQuestion(allQuestions[currQIndex]);
    });


    /**
     * EVENT HANDLER
     * Handle next question button transition set up
     */
    $("#next_question_btn").click(function() {
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
     * EVENT HANDLER
     * Handle prev question button transition set up
     */
    $("#prev_question_btn").click(function() {
        updateUserChoiceAndTally(allQuestions[currQIndex]);

        currQIndex--;

        if (currQIndex < 0) {
            alert("This is the first question. You cannot go back further.");
            currQIndex = 0;
        }

        loadQuestion(allQuestions[currQIndex]);

    });

    /**
     * EVENT HANDLER
     * Restarts quiz from scratch WITHOUT saving answers
     */
    $("#restart_btn").click(function() {
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
        $endingPanel.hide();
        $landingPanel.show();
    }


    /**
     * Load next question onto page with all choices, if accessed via back tracking, the users previous choice
     * is shown as checked, otherwise the top option is checked
     * 
     * @param {Object} currQuestion - current question object (normally allQuestions[currQIndex])
     */
    function loadQuestion(currQuestion) {
        //Update prev/next buttons based on location in quiz
        //Disable prev button at first question
        //REFACTOR THIS \/ \/ \/ INTO FUNCTION
        if (currQIndex == 0) {
            $prevButton.prop("disabled", true);
        }
        //Indicate end of quiz
        else if (currQIndex === allQuestions.length - 1) {
            $nextButton.text("Finish Quiz");
        }
        //Default behavior
        else {
            $prevButton.prop("disabled", false);
            $nextButton.text("Next Question");
        }
        // /\ /\ /\


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

        //ALways ensure an option is checked when the question is viewed
        checkUserChoiceAndFocus(currQuestion);
    }

    /**
     * Constructs a div enclosing a questions main text and an <ol> of radio button selections.
     * 
     * @param {Object} currQuestion -Current question object to construct question div
     * @return {HTMLElement:div}            -the question div
     */
    function makeQuestionDiv(currQuestion) {
        //Make div
        var DIV_question = document.createElement("div");
        DIV_question.id = "Q_" + currQIndex + "_div";
        DIV_question.classList.add("question_div"); //to apply uniform styling
        DIV_question.classList.add("col"); //Boot strap col Sizing and styling

        //make question text
        var h2_questionText = document.createElement("H2");
        h2_questionText.id = "Q_" + currQIndex + "_text";
        h2_questionText.classList.add("question_text");
        h2_questionText.classList.add("card-title"); //Bootstrap card title
        h2_questionText.innerHTML = currQuestion.questionText;

        //make OL to store radio options
        var OL_choices = document.createElement("ol");
        OL_choices.id = "Q_" + currQIndex + "_choices";
        OL_choices.classList.add("question_choices");
        OL_choices.classList.add("list-group"); //Bootstrap
        OL_choices.classList.add("list-group-flush"); //Bootstrap

        //populate OL with radio options
        for (var j = 0, len2 = currQuestion.choices.length; j < len2; j++) {
            var newInputChoice = makeQuestionChoice(currQIndex, j, true, "radio", currQuestion.choices[j], currQuestion.name);
            OL_choices.appendChild(newInputChoice);
        }

        //append OL & text to div
        DIV_question.appendChild(h2_questionText);
        DIV_question.appendChild(OL_choices);

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
    function makeQuestionChoice(qIndex, idNum, required, type, value, name) {

        //Elements necessary for Funky Bootstrap input structure
        var formCheck = document.createElement("div");
        formCheck.classList.add("form-check");
        var formCheckLabel = document.createElement("LABEL");
        formCheckLabel.classList.add("form-check-label");

        //Construct new input element
        var formCheckInput = document.createElement("input");
        formCheckInput.classList.add("form-check-input");
        formCheckInput.id = type + qIndex + "_" + idNum;
        formCheckInput.type = type;
        formCheckInput.value = value;
        if (name) {
            formCheckInput.name = name;
        }
        formCheckInput.required = required; //doesn't do anyting yet because next button is not Submit


        var labelText = document.createElement("SPAN");
        labelText.innerHTML = value;
        //properly nest all elements in bootstrap format before return
        formCheckLabel.appendChild(formCheckInput);
        formCheckLabel.appendChild(labelText);
        formCheck.appendChild(formCheckLabel);

        return formCheck;
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
     * Ensures that, when a new question is loaded, that either the default
     * option or previous user selection is selected and has focus
     * 
     * @param {Object} currQuestion -current question object to act on
     */
    function checkUserChoiceAndFocus(currQuestion) {
        var uChoice = currQuestion.userChoice,
            checkedRadio;

        //No user choice yet, default
        if (uChoice == -1) {
            checkedRadio = $("#radio" + currQIndex + "_0");
            checkedRadio.prop("checked", true);
            checkedRadio.focus();
        }
        //Load prev user choice
        else {
            checkedRadio = $("#radio" + currQIndex + "_" + uChoice);
            checkedRadio.prop("checked", true);
            checkedRadio.focus();
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
        $("#display_score_text").text("Your score is ");
        $("#display_score_number").text(tally);

        $quizPanel.hide();
        $endingPanel.show();
    }
});