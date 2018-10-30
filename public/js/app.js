var app = angular.module('loginApp',[]);
var checkbox = document.getElementById('policycheck');
var signupbtn = document.getElementById('signup');
checkbox.onchange = function() {
    if(this.checked){
        signupbtn.disabled = false;
    } else {
        signupbtn.disabled = true;
    }
};

var modal = document.getElementById('modal-wrapper');
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}
function ClearField()
{
    document.getElementById('modal-wrapper').style.display='none';
    document.getElementById("username").value = "";
    document.getElementById("password").value = "";
    document.getElementById("email").value = "";
    document.getElementById("repassword").value = "";
    document.getElementById("policycheck").value = "";
    checkbox.checked=false;
}
function closepopup()
{
    ClearField();
}

function SignIn() {
    var username=document.getElementById("unsignin").value;
    var pwd=document.getElementById("pwdsignin").value;
    var getvalue=localStorage.getItem(username);
    if(getvalue==null)
    {
        alert("Not a user");
    }
    if(getvalue==pwd)
    {
        window.location.href = "HomePage.html?"+username;
    }
    else
    {
        alert("Password or Username may be wrong");
    }

}
