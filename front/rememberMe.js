const rmCheck = document.getElementById("rememberMe"),
  textInput = document.getElementById("text");
  passwordInput = document.getElementById("password");
  

if (localStorage.checkbox && localStorage.checkbox !== "") {
  rmCheck.setAttribute("checked", "checked");
  textInput.value = localStorage.identifier;
  passwordInput.value = localStorage.password;

} else {
  rmCheck.removeAttribute("checked");
  textInput.value = "";
  passwordInput.value = "";

}

function lsRememberMe() {
  if (rmCheck.checked && textInput.value !== "" && passwordInput.value !== "" ) {
    localStorage.identifier = textInput.value;
    localStorage.password = passwordInput.value;
    localStorage.checkbox = rmCheck.value;
  } else {
    localStorage.identifier = "";
    localStorage.password ="";
    localStorage.checkbox = "";
  }
}
//last time I encoutered a problem with login.ejs the input fields had 'for' with names of 'name' instead the 'for' should be 
//identical to the name of the 'id'