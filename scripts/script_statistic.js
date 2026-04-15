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