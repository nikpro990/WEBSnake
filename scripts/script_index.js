document.addEventListener("DOMContentLoaded", () => {
    const buttonRegistration = document.getElementById("registration_js");
    const buttonLogin = document.getElementById("login_js")
    const buttonStart = document.getElementById("start_js");
    const buttonStatistics = document.getElementById("apple_count_js");
    const buttonExit = document.getElementById("exit_js");
    const getUser = localStorage.getItem("username");

    if(getUser){
        buttonRegistration.outerHTML = `<span class="getUser">${getUser}</span>`;
        buttonLogin.style.display = "none";
    } 

    buttonRegistration.addEventListener("click", () => {
        window.location.href = './form/form.html'
    });

    buttonLogin.addEventListener("click", () => {
        window.location.href = "../form/login.html"
    });

    buttonStart.addEventListener("click", () => {
        if(getUser){          
                window.location.href = './game/game.html';
                let rawDataStart = localStorage.getItem("score_starts");
                let startArrays = [];
                
                try {
                    startArrays = rawDataStart ? JSON.parse(rawDataStart) : [];
                    if (!Array.isArray(startArrays)) startArrays = [];
                } catch(e) {
                    startArrays = [];
                }

                startArrays.push({ start: 1, time: Date.now() });
                
                localStorage.setItem("score_starts", JSON.stringify(startArrays));
        }
        else{
          alert("Чтобы играть, нужно создать аккаунт")  
        }
    });

    buttonStatistics.addEventListener("click", () => {
        window.location.href = './statistic/statistic.html'
    });

    buttonExit.addEventListener("click", (e) => {
        if(getUser){
            alert("Вы вышли из аккаунта");
            localStorage.clear();
            window.location.reload();
        }
        else{
           alert("Создайте аккаунт");
        }
    });

});