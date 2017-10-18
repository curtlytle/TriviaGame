$(document).ready(function () {

    var questionTime = 10;
    var timerId;
    var gameQuestions;

    function pageStartUp() {
        displayEmptyTimer();
        loadData();
        $("#answers").hide();
    }

    pageStartUp();

    $("#startButton").on("click", function () {
        $("#startButton").remove();
        displayQuestion("This is a test");

        displayAnswers("Answers test");

        console.log(gameQuestions);
        displayNextQuestion();

        timerId = setInterval(runTimer, 1000);
        displayTimer(questionTime);
    });

    function loadData() {
        $.ajax({
            url: "https://opentdb.com/api.php?amount=10&category=9&difficulty=medium&type=multiple",
            method: "GET"
        }).done(function (response) {
            console.log(response.response_code);
            // console.log(response.results[0].question);
            if (response.response_code == 0) {
                gameQuestions = new Array(response.results.length);
                gameQuestions.answers = new Array(4);
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

                    questionObj.answers[j] = answerObj;
                }
                var answerObj2 = {
                    answer: result.correct_answer,
                    correct: true
                };

                questionObj.answers[result.incorrect_answers.length] = answerObj2;

                gameQuestions[i] = questionObj;
            }
        });
    }

    $("#question").on("click", function () {
        clearAnswers();
        displayAnswers("test");
    });

    function displayNextQuestion() {
        for (var i = 0; i < gameQuestions.length; i++) {
            var quest = gameQuestions[i];
            if (quest.answered === -1) {
                clearQuestion();
                displayQuestion(quest.question);
                break;
            }

        }
    }

    function displayQuestion(question) {
        var $question1 = $("<div>", {class: "question1"});
        $question1.html("<h2>" + question + "</h2>");

        var question = $("#question");
        question.append($question1);
    }

    function clearAnswers() {
        var $div1 = $(".answer1");
        var $div2 = $(".answer2");
        var $div3 = $(".answer3");
        var $div4 = $(".answer4");

        $div1.remove();
        $div2.remove();
        $div3.remove();
        $div4.remove();
    }

    function clearQuestion() {
        var $div = $(".question1");
        $div.remove();
    }

    function displayAnswers(answers) {
        var $div1 = $("<div>", {class: "answer1"});
        var $div2 = $("<div>", {class: "answer2"});
        var $div3 = $("<div>", {class: "answer3"});
        var $div4 = $("<div>", {class: "answer4"});

        $div1.html("<p>answer 1 hello</p>");
        $div2.html("<p>answer 2 hello</p>");
        $div3.html("<p>answer 3 hello</p>");
        $div4.html("<p>answer 4 hello</p>");

        var answers = $("#answers");
        answers.show();
        answers.append($div1);
        answers.append($div2);
        answers.append($div3);
        answers.append($div4);


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


});