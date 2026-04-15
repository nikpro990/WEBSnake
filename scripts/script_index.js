document.addEventListener("DOMContentLoaded", () => {
    const buttonLogin = document.getElementById("registration_js");
    const buttonStart = document.getElementById("start_js");
    const buttonStatistics = document.getElementById("apple_count_js");
    const buttonExit = document.getElementById("exit_js");

    buttonLogin.addEventListener("click", () => {
        window.location.href = './form/form.html'
    });

    buttonStart.addEventListener("click", () => {
        window.location.href = './game/game.html';
        let rawDataStart = localStorage.getItem("start_collection");
        let startArrays = rawDataStart ? JSON.parse(rawDataStart) : []; 
        startArrays.push({ points: 1, time: Date.now() });
        localStorage.setItem("start_collection", JSON.stringify(startArrays));
    });

    buttonStatistics.addEventListener("click", () => {
        window.location.href = './statistic/statistic.html'
    });

    buttonExit.addEventListener("click", () => {
        window.close();
    });

});