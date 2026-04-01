const ButtonForm = document.getElementById("form_js");
const InputPassword = document.getElementById("password");
const InputPasswordRepeat = document.getElementById("password_repeat")
const buttonSumbit = document.getElementById("sumbit");



ButtonForm.onsubmit = async (e) => {
    e.preventDefault();
    const data = {
        username : document.getElementById("name").value,
        password : document.getElementById("password").value, 
    }
    const response = await fetch("http://127.0.0.1:5500/form/form.html", {
      method: "POST",
      headers: {"Content-Type": "aplication/json"},
      body: JSON.stringify(data)
    });
    const result = await response.text();
    alert(result);
};