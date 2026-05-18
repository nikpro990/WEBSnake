document.addEventListener("DOMContentLoaded", () => {
  const ButtonForm = document.getElementById("form_js");
  let InputPassword = document.getElementById("password_js");
  let InputPasswordRepeat = document.getElementById("password_repeat_js")
  const buttonSumbit = document.getElementById("sumbit");
  const PasswordDisabled = document.getElementById("password-disabled_js");
  const username = document.getElementById("name");
  const password = document.getElementById("password_js")

  buttonSumbit.disabled = true;

  function checkValue(){  
     const p1 = InputPassword.value;
     const p2 = InputPasswordRepeat.value;

    if (p1 === "" || p2 === "" || p1 !== p2) {
      buttonSumbit.disabled = true;
      PasswordDisabled.style.display = "block";
    } else {
      buttonSumbit.disabled = false;
      PasswordDisabled.style.display = "none";
    }
  }

  PasswordDisabled.addEventListener("click", () => {
      alert("Ошибка: пароли не совпадают");
  });

  InputPasswordRepeat.oninput = checkValue;
  InputPassword.oninput = checkValue;

  ButtonForm.onsubmit = async (e) => {
      e.preventDefault();
      const data = {
          username : username.value,
          password : password.value, 
      }
      const response = await fetch("http://127.0.0.1:3000/register", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data)
      });

      if(username.value.trim() !== ""){
        const saveUser = localStorage.setItem("username", username.value);
      
        //window.location.href = "../index.html"
      }
      

      const result = await response.text();

      if(response.ok){
        alert(result);
      }
      else{
        alert(result);
      }
     
  };
});
