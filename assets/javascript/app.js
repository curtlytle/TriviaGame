$(document).ready(function () {

    var questionTime = 10;
    var timerId;

    function pageStartUp() {
        displayEmptyTimer();
        $("#answers").hide();
    }

    pageStartUp();

    $("#startButton").on("click", function () {
        $("#startButton").remove();
        displayQuestion("This is a test");
        timerId = setInterval(runTimer, 1000);
        displayTimer(questionTime);
        displayAnswers("Answers test");
    });

    $("#question").on("click", function () {
        clearAnswers();
        displayAnswers("test");
    });


    function displayQuestion(question) {
        var $question = $("#question");
        $question.remove();
        $question.html("<div><h2>" + question + "</h2></div>");
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