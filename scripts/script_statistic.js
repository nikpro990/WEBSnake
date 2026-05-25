document.addEventListener("DOMContentLoaded", () => {
    const SummApple = document.getElementById("counter_apple_total");
    const SummTime = document.getElementById("counter_time_life");
    const SummStart = document.getElementById("counter_start_click");

    function updateScore(){
        let rawData = localStorage.getItem("apple_collection");
        let apples = JSON.parse(rawData) || [];
        const total = apples.reduce((sum, current) => sum + (current.points || 0), 0); 
        SummApple.innerText = total;

        let rawDataTime = localStorage.getItem("time_collection");
        let times = JSON.parse(rawDataTime) || [];
        const totalTime = times.reduce((sum, current) => sum + (current.points || 0), 0); 
        SummTime.innerText = totalTime;

        let rawDataStart = localStorage.getItem("start_collection");
        let starts = JSON.parse(rawDataStart) || [];
        const totalStart = starts.reduce((sum, current) => sum + (current.points || 0), 0); 
        SummStart.innerText = totalStart;
     
        const getUser = localStorage.getItem("username");

        if(getUser){
        const statsdata = {
            username: getUser,
            apple_collection: total,
            time_collection: totalTime,
            start_collection: totalStart
        };

        fetch('http://127.0.0.1:3000/statistics', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(statsdata)
        })

        .then(res => {
            if (res.ok) {
                console.log("Статистика успешно обновлена в SQL Server!");
            }
        })
        .catch(err => console.error("Ошибка сети при отправке в SQL Server:", err));
        }
    }

    updateScore();

    window.addEventListener('storage', (event) => {
        if(event.key == "apple_collection") {
            updateScore();
            const apples = JSON.parse(event.newValue) || [];
            const total = apples.reduce((sum, current) => sum + (current.points || 0), 0); 
            SummApple.innerText = total;
        }

        if(event.key == "time_collection") {
            updateScore();
            const times = JSON.parse(event.newValue) || [];
            const total = times.reduce((sum, current) => sum + (current.points || 0), 0); 
            SummTime.innerText = total;
        }

        if(event.key == "start_collection") {
            updateScore();
            const starts = JSON.parse(event.newValue) || [];
            const total = starts.reduce((sum, current) => sum + (current.points || 0), 0); 
            SummStart.innerText = total;
        }
    });



});