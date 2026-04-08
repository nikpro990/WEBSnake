document.addEventListener("DOMContentLoaded", () => {
    const SummApple = document.getElementById("counter_apple_total");

    function updateScore(){
        let rawData = localStorage.getItem("apple_collection");
        let apples = JSON.parse(rawData) || [];
        const total = apples.reduce((sum, current) => sum + (current.points || 0), 0); 
        SummApple.innerText = total;
    }

    updateScore();

    window.addEventListener('storage', (event) => {
        if(event.key == "apple_collection") {
            updateScore();
            const apples = JSON.parse(event.newValue) || [];
            const total = apples.reduce((sum, current) => sum + (current.points || 0), 0); 
            SummApple.innerText = total;
        }
    });

});