$(document).ready(function () {
    var gameQuestions;  // all the game questions are stored here after api load up

    // Question Timer object
    var qTimer = {
        id: null,
        amount: 10,
        time: 10,
        start: function () {
            clearInterval(qTimer.id);
            qTimer.time = qTimer.amount;
            qTimer.id = setInterval(qTimer.count, 1000);
        },
        count: function () {
            displayTimer(qTimer.time);
            qTimer.time--;

            if (qTimer.time < 0) {
                clearInterval(qTimer.id);
                var qobj1 = getCurrentQuestion();
                qobj1.answerCode = 0;
                var correctAnswer = getCorrectAnswer(qobj1.answers);
                ansTimer.answerDisplay = "Times Up! The correct answer is: " + correctAnswer.answer;
                ansTimer.start();
            }
        },
        stop: function () {
            clearInterval(qTimer.id);
        }
    };

    // Answer Timer object, used for after a question is answered
    var ansTimer = {
        id: null,
        amount: 1,
        time: 1,
        answerDisplay: "",
        start: function () {
            clearInterval(ansTimer.id);
            ansTimer.time = ansTimer.amount;
            ansTimer.id = setInterval(ansTimer.count, 1000);
            showAnswer();
        },
        count: function () {

            ansTimer.time--;

            if (ansTimer.time < 0) {
                clearInterval(ansTimer.id);
                displayNextQuestion();
            }
        },
        stop: function () {
            clearInterval(ansTimer.id);
        }
    };

    function pageStartUp() {  // Initial page startup
        displayEmptyTimer();
        loadData();
        $("#answers").empty();
    }

    pageStartUp();

    // Start button click
    $("#startButton").on("click", function () {
        $("#question").empty();

        displayNextQuestion();
    });

    $(document).on("click", "#playAgain", function () {
       displayNextQuestion();
    });

    // Load the data from the api
    function loadData() {
        $.ajax({
            url: "https://opentdb.com/api.php?amount=10&category=9&difficulty=medium&type=multiple",
            method: "GET"
        }).done(function (response) {
            console.log(response);
            // console.log(response.results[0].question);
            if (response.response_code == 0) {
                gameQuestions = new Array();
                gameQuestions.answers = new Array();
            } else {
                // not sure what to do if we don't get any data
            }

            for (var i = 0; i < response.results.length; i++) {
                var result = response.results[i];
                var questionObj = {
                    question: result.question,
                    answerCode: -1,  // -1 = current question, 0 = no answer, 1 = incorrect, 2 = correct
                    answers: []
                };

                for (var j = 0; j < result.incorrect_answers.length; j++) {
                    var answerObj = {
                        answer: result.incorrect_answers[j],
                        correct: false
                    };

                    questionObj.answers.push(answerObj);
                }
                var answerObj2 = {  // put in the correct answer last, no problem, we shuffle later
                    answer: result.correct_answer,
                    correct: true
                };

                questionObj.answers.push(answerObj2);
                questionObj.answers = shuffle(questionObj.answers);  // shuffle all the answers
                gameQuestions.push(questionObj);
            }
        });
    }

    // gets the next question based on answerCode, which is -1, and then starts the timer
    function displayNextQuestion() {
        var qobj = getCurrentQuestion();  // have to get the current question
        if (qobj != null) {
            displayQuestion(qobj.question);
            displayAnswers(qobj.answers);
            qTimer.start();
        } else {
            allDone();
        }
    }

    function getCurrentQuestion() {
        for (var i = 0; i < gameQuestions.length; i++) {
            var quest = gameQuestions[i];
            if (quest.answerCode === -1) {
                return quest;
            }
        }
        return null;
    }

    function displayQuestion(question) {
        $("#question").empty();
        var $question1 = $("<div>", {class: "question1"});
        $question1.html("<h3>" + question + "</h3>");

        var question = $("#question");
        question.append($question1);
    }

    function displayAnswers(answers) {
        var answersdiv = $("#answers");
        answersdiv.empty();

        for (var i = 0; i < answers.length; i++) {
            var obj = answers[i];
            var aclass = "answer";
            var $adiv = $("<div>");
            $adiv.attr("data-element", i);
            $adiv.addClass(aclass);
            $adiv.html("<h4>" + obj.answer + "</h4>");
            answersdiv.append($adiv);
        }
    }

    function showAnswer() {
        var answersdiv = $("#answers");
        answersdiv.empty();
        var $adiv = $("<div>");
        $adiv.html("<h3>" + ansTimer.answerDisplay + "</h3>");
        answersdiv.append($adiv);
    }

    function displayTimer(time) {
        $("#timer").html("<h3>Time Remaining: " + time + " seconds</h3>");
    }

    function displayEmptyTimer() {
        $("#timer").html("<h3>&nbsp;</h3>");
    }


    // clicked on one of the answers
    function answerQuestion() {
        qTimer.stop();
        displayEmptyTimer();
        var element = $(this).attr("data-element");  // data elements match elements in array
        // console.log("Chose question: " + element);

        var qobj = getCurrentQuestion();

        var answer = qobj.answers[element];
        if (answer.correct) {
            //console.log("You chose wisely");
            qobj.answerCode = 2;
            ansTimer.answerDisplay = "Correct!";
        } else {
            //console.log("You chose poorly");
            qobj.answerCode = 1;
            var correctAnswer = getCorrectAnswer(qobj.answers);
            ansTimer.answerDisplay = "Nope! The correct answer is: " + correctAnswer.answer;
        }

        ansTimer.start();  // starting the answer timer to give time to show results
    }

    function allDone() {
        displayQuestion("All Done, here's how you did!");
        showResults();
        loadData();
    }

    function showResults() {
        var answersdiv = $("#answers");
        answersdiv.empty();
        var cntCorrect = 0;
        var cntIncorrect = 0;
        var cntNada = 0;

        for (var i = 0; i < gameQuestions.length; i++) {
            var question = gameQuestions[i];
            if (question.answerCode == 0) {
                cntNada++;
            } else if (question.answerCode == 1) {
                cntIncorrect++;
            } else if (question.answerCode == 2) {
                cntCorrect++;
            }
        }

        var $adiv = $("<div>");
        $adiv.html("<h4>Correct Answers: " + cntCorrect + "</h4>");
        answersdiv.append($adiv);
        var $bdiv = $("<div>");
        $bdiv.html("<h4>Incorrect Answers: " + cntIncorrect + "</h4>");
        answersdiv.append($bdiv);
        var $cdiv = $("<div>");
        $cdiv.html("<h4>Unanswered: " + cntNada + "</h4>");
        answersdiv.append($cdiv);

        var $buttPlayAgain = $("<button>");
        $buttPlayAgain.addClass("btn btn-success btn-lg");
        $buttPlayAgain.attr("id", "playAgain");
        $buttPlayAgain.html("Click to Play Again");

        answersdiv.append($buttPlayAgain);
    }

    function getCorrectAnswer(answers) {
        for (var i = 0; i < answers.length; i++) {
            var obj = answers[i];
            if (obj.correct) {
                return obj;
            }
        }
        return null;
    }

    $(document).on("click touchstart", ".answer", answerQuestion);

    function shuffle(array) {
        var currentIndex = array.length, temporaryValue, randomIndex;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {

            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;
    }

});