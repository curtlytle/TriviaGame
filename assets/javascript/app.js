$(document).ready(function () {

    var questionTime = 10;
    var timerId;
    var gameQuestions;

    function pageStartUp() {
        displayEmptyTimer();
        loadData();
        $("#answers").empty();
    }

    pageStartUp();

    $("#startButton").on("click", function () {
        $("#question").empty();

        displayNextQuestion();

        timerId = setInterval(runTimer, 1000);
        displayTimer(questionTime);
    });

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
                    answered: -1,
                    answers: []
                };

                for (var j = 0; j < result.incorrect_answers.length; j++) {
                    var answerObj = {
                        answer: result.incorrect_answers[j],
                        correct: false
                    };

                    questionObj.answers.push(answerObj);
                }
                var answerObj2 = {
                    answer: result.correct_answer,
                    correct: true
                };

                questionObj.answers.push(answerObj2);
                questionObj.answers = shuffle(questionObj.answers);
                gameQuestions.push(questionObj);
            }
        });
    }

    $("#question").on("click", function () {
        //displayAnswers("test");
    });

    function displayNextQuestion() {
        for (var i = 0; i < gameQuestions.length; i++) {
            var quest = gameQuestions[i];
            if (quest.answered === -1) {
                displayQuestion(quest.question);
                displayAnswers(quest.answers);
                break;
            }

        }
    }

    function displayQuestion(question) {
        $("#question").empty();
        var $question1 = $("<div>", {class: "question1"});
        $question1.html("<h2>" + question + "</h2>");

        var question = $("#question");
        question.append($question1);
    }

    function displayAnswers(answers) {
        $("#answers").empty();

        var answersdiv = $("#answers");

        for (var i = 0; i < answers.length; i++) {
            var obj = answers[i];
            var aclass = "answer";
            var $adiv = $("<div>");
            $adiv.attr("data-element", i);
            $adiv.addClass(aclass);
            $adiv.html("<p>" + obj.answer + "</p>");
            answersdiv.append($adiv);
        }

    }

    function displayTimer(time) {
        $("#timer").html("<h3>Time Remaining: " + time + " seconds</h3>");
    }

    function displayEmptyTimer() {
        $("#timer").html("<h3>&nbsp;</h3>");
    }

    function runTimer() {
        questionTime--;
        displayTimer(questionTime);

        if (questionTime <= 0) {
            clearInterval(timerId);
        }

    }

    function answerQuestion() {

        var element = $(this).attr("data-element");
        console.log("Chose question: " + element);
    }

    $(document).on("click", ".answer", answerQuestion);

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