$(document).ready(function () {

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

    var ansTimer = {
        id: null,
        amount: 3,
        time: 3,
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

       // qTimer.id = setInterval(timerCounting, 1000);
       // displayTimer(qTimer.time);
        qTimer.start();
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

    function displayNextQuestion() {
        var qobj = getCurrentQuestion();
        displayQuestion(qobj.question);
        displayAnswers(qobj.answers);
        qTimer.start();
    }

    function getCurrentQuestion() {
        for (var i = 0; i < gameQuestions.length; i++) {
            var quest = gameQuestions[i];
            if (quest.answerCode === -1) {
                return quest;
            }
        }
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


    function answerQuestion() {
        qTimer.stop();
        displayEmptyTimer();
        var element = $(this).attr("data-element");
        console.log("Chose question: " + element);

        var qobj = getCurrentQuestion();

        var answer = qobj.answers[element];
        if (answer.correct) {
            console.log("You chose wisely");
            qobj.answerCode = 2;
            ansTimer.answerDisplay = "Correct!";
        } else {
            console.log("You chose poorly");
            qobj.answerCode = 1;
            var correctAnswer = getCorrectAnswer(qobj.answers);
            ansTimer.answerDisplay = "Nope! The correct answer is: " + correctAnswer.answer;
        }

        ansTimer.start();
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