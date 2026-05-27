document.addEventListener("DOMContentLoaded", () => {  
    const ButtonLogin = document.getElementById("login_js");
    const InputPassword = document.getElementById("password_js");
    const buttonSubmit = document.getElementById("sumbit"); 
    const PasswordDisabled = document.getElementById("password-disabled_js");
    const username = document.getElementById("name");
  
    if (buttonSubmit) buttonSubmit.disabled = true;
  
    function checkValue() {  
      const p1 = InputPassword.value;
       
      if (p1 === "") {
        buttonSubmit.disabled = true;
        PasswordDisabled.style.display = "block";
      } else {
        buttonSubmit.disabled = false;
        PasswordDisabled.style.display = "none";
      }
    }
    InputPassword.oninput = checkValue;
  
    PasswordDisabled.addEventListener("click", () => {
      alert("Пожалуйста, введите пароль");
    });

    if (ButtonLogin) {
        ButtonLogin.onsubmit = async (e) => {
          e.preventDefault();
          const data = {
            username: username.value,
            password: InputPassword.value
          };
    
          try {
            const response = await fetch("http://127.0.0.1:3000/login", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(data)
            });
    
            const result = await response.json();  
            const contentType = response.headers.get("content-type");
    
            if (response.ok && contentType && contentType.includes("application/json")) {
      
              alert(result.message); 
              localStorage.setItem("username", result.user.username);
              localStorage.setItem("score_apples", JSON.stringify(result.statistics.AppleCollection));
              localStorage.setItem("score_time", JSON.stringify(result.statistics.TimeCollection));
              localStorage.setItem("score_starts", JSON.stringify(result.statistics.StartCollection));

              window.location.href = "../index.html";
            }

            else{
             alert(result);   
            }
          } catch (error) {
            alert("Ошибка сети или сервера");
            console.error(error);
          }
        };
    }
});
  