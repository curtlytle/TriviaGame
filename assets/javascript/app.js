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
    });


    function displayQuestion(question) {
        $("#question").html("<p>" + question+ "</p>");
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