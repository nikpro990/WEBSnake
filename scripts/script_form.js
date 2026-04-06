document.addEventListener("DOMContentLoaded", () => {
  const ButtonForm = document.getElementById("form_js");
  let InputPassword = document.getElementById("password_js");
  let InputPasswordRepeat = document.getElementById("password_repeat_js")
  const buttonSumbit = document.getElementById("sumbit");
  
  buttonSumbit.disabled = true;

  function checkValue(){  
     const p1 = InputPassword.value;
     const p2 = InputPasswordRepeat.value;

     buttonSumbit.disabled = (p1 === "" || p2 === "" || p1 !== p2);
  }

  InputPasswordRepeat.oninput = checkValue;
  InputPassword.oninput = checkValue;

  ButtonForm.onsubmit = async (e) => {
      e.preventDefault();
      const data = {
          username : document.getElementById("name").value,
          password : document.getElementById("password_js").value, 
      }
      const response = await fetch("http://127.0.0.1:5500/form/form.html", {
        method: "POST",
        headers: {"Content-Type": "aplication/json"},
        body: JSON.stringify(data)
      });

      if(response.ok){
        alert(result)
      }
      const result = await response.text();
  };
});
