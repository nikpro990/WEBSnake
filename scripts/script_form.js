document.addEventListener("DOMContentLoaded", () => {  
  const ButtonForm = document.getElementById("form_js");
  const InputPassword = document.getElementById("password_js");
  const InputPasswordRepeat = document.getElementById("password_repeat_js");
  const buttonSubmit = document.getElementById("submit"); 
  const PasswordDisabled = document.getElementById("password-disabled_js");
  const username = document.getElementById("name");

  if (buttonSubmit) buttonSubmit.disabled = true;

  function checkValue() {  
    const p1 = InputPassword.value;
    const p2 = InputPasswordRepeat.value;
     
    if (p1 === "" || p2 === "" || p1 !== p2) {
      buttonSubmit.disabled = true;
      PasswordDisabled.style.display = "block";
    } else {
      buttonSubmit.disabled = false;
      PasswordDisabled.style.display = "none";
    }
  }

  InputPasswordRepeat.oninput = checkValue;
  InputPassword.oninput = checkValue;

  PasswordDisabled.addEventListener("click", () => {
    alert("Ошибка: пароли не совпадают");
  });

  if (ButtonForm) {
    ButtonForm.onsubmit = async (e) => {
      e.preventDefault();
      const data = {
        username: username.value,
        password: InputPassword.value
      };

      try {
        const response = await fetch("http://127.0.0.1:3000/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data)
        });

        const result = await response.text();

        if (response.ok) {
          alert(result);
          localStorage.setItem("username", username.value);
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
