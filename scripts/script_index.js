document.addEventListener("DOMContentLoaded", () => {
    const buttonStart = document.getElementById("start_js");
    const buttonExit = document.getElementById("exit_js");

    buttonStart.addEventListener("click", () => {
        window.location.href = '/game/game.html';
    });

    buttonExit.addEventListener("click", () => {
        window.close();
    });

});