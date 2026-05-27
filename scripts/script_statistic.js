document.addEventListener("DOMContentLoaded", () => {
    const SummApple = document.getElementById("counter_apple_total");
    const SummTime = document.getElementById("counter_time_life");
    const SummStart = document.getElementById("counter_start_click");

    function updateScore() {
        let applesArray = [];
        let timeArray = [];
        let startsArray = [];

        try {
            let rawApples = localStorage.getItem("score_apples");
            let rawTime = localStorage.getItem("score_time");
            let rawStarts = localStorage.getItem("score_starts");

            if (rawApples === "[object Object]") { localStorage.removeItem("score_apples"); rawApples = null; }
            if (rawTime === "[object Object]") { localStorage.removeItem("score_time"); rawTime = null; }
            if (rawStarts === "[object Object]") { localStorage.removeItem("score_starts"); rawStarts = null; }

            if (rawApples) {
              applesArray = JSON.parse(rawApples);
            } else {
              applesArray = [];
            }
            if(rawTime){
               timeArray = JSON.parse(rawTime);
            } else{
                timeArray = [];
            }
            if(rawStarts) {
               startsArray = JSON.parse(rawStarts);
            } else {
                startsArray = [];
            }
            
            if (!Array.isArray(applesArray)) applesArray = [];
            if (!Array.isArray(timeArray)) timeArray = [];
            if (!Array.isArray(startsArray)) startsArray = [];
        } catch (e) {
            console.error("Ошибка чтения данных из localStorage", e);
            applesArray = [];
            timeArray = [];
            startsArray = [];
        }

        const totalApples = applesArray.length;
        const totalTimeSeconds = timeArray.length; 
        const totalStarts = startsArray.length;

        if (SummApple) SummApple.innerText = totalApples;
        if (SummTime) SummTime.innerText = totalTimeSeconds;
        if (SummStart) SummStart.innerText = totalStarts;
     
        const getUser = localStorage.getItem("username");

        if (getUser) {
            const statsdata = {
                username: getUser,
                apple_collection: totalApples,
                time_collection: totalTimeSeconds,
                start_collection: totalStarts
            };

            fetch('http://127.0.0.1:3000/statistics', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(statsdata)
            })
            .then(res => {
                if (res.ok) {
                    console.log("Статистика успешно синхронизирована с SQL Server!");
                }
            })
            .catch(err => console.error("Ошибка сети при отправке в SQL Server:", err));
        }
    }

    updateScore();

    window.addEventListener('storage', (event) => {
        if (event.key === "score_apples" || event.key === "score_time" || event.key === "score_starts") {
            updateScore();
        }
    });
});
