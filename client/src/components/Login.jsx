import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";

const Login = () => {


    const navigate = useNavigate();

const handleClick = async () => {

    const Email = document.getElementById('logInEmail').value;
    const Password = document.getElementById('logInPassword').value;


    const requestOptions = {
        method : 'POST',
        headers : {
            'Content-Type' : 'application/json' 
        },
        body : JSON.stringify({
          Email : Email,
          Password : Password  
        }),
        credentials : 'include'
    }

    const Response = await((await fetch('http://localhost:5000/api/login', requestOptions)).json());

    

    if (Response.Response === 'Success!'){
        alert(Response.Response);
        navigate('/dashboard')
    }
    else
    {
        alert(Response.Response)
    }

}

return(

<>
<Sidebar/>

<div className="login">
<input type="text"  id="logInEmail" placeholder="Email"/>
<input type="text"  id="logInPassword" placeholder="Password"/>
<button onClick={() => handleClick()}> Login </button>

</div>

</>

);

}

export default Login;
