
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import './styling/signup.css';

const Signup = () => {

    const navigate = useNavigate();
    
    const handleClick = async () => {

        const Name = document.getElementById('signUpName').value;
        const Email = document.getElementById('signUpEmail').value;
        const Password = document.getElementById('signUpPassword').value;
    
        const requestOptions = {
            method : 'POST',
            headers : {
                'Content-Type' : 'application/json'
            },
            body : JSON.stringify({
              Name : Name,
              Email : Email,
              Password : Password  
            }),
        }

        const Response = (await (await fetch('http://localhost:5000/api/signup', requestOptions)).json()).Message;

        alert(Response);

        if (Response === 'Success!'){
            navigate('/login');
        }
        
    
    
    }

return(
    <>
    <Sidebar/>
    <div className="signup">
        
        <h1>Create Your CryptX Account Today!</h1>
        
        <input type="text"  id="signUpName" placeholder="Name"/>
        <input type="text"  id="signUpEmail" placeholder="Email"/>
        <input type="password"  id="signUpPassword" placeholder="Password"/>
        <button onClick={() => handleClick()}> Sign Up </button>
    
        <p onClick={() => navigate('/login')}> Have an account? Log in here </p>

    </div>
    </>
);

}

export default Signup;
