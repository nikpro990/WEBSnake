document.addEventListener("DOMContentLoaded", () => {
    const buttonLogin = document.getElementById("registration_js");
    const buttonStart = document.getElementById("start_js");
    const buttonStatistics = document.getElementById("apple_count_js");
    const buttonExit = document.getElementById("exit_js");

    buttonLogin.addEventListener("click", () => {

    });

    buttonStart.addEventListener("click", () => {
        window.location.href = '/game/game.html';
    });

    buttonStatistics.addEventListener("click", () => {
        window.location.href = '/counter_apple/counter_apple.html'
    });

    buttonExit.addEventListener("click", () => {
        window.close();
    });

});