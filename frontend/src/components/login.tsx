import { useState } from "react";
const serverUrl="http://localhost:3001/login"
import axios from "axios";
import { useNavigate } from "react-router-dom";
export default function Login_Page(){
    const [username,setUsername]=useState("");
    const [password,setPassword]=useState("");
    const navigate=useNavigate();
    function handleLoginRequest(e:React.FormEvent){
        e.preventDefault();
        axios.post(serverUrl,{username:username,password:password}).then(
            response=>{
                if(response.status==200){
                        localStorage.setItem(`current_logged_user`,JSON.stringify(response.data))
                        navigate('/')
                }
            }
        )
        .catch(error=>{
            if(error.response && error.response.status === 401)
                 alert("Username and/or password not correct");
            else
                console.error("Login failed:", error.messages[0]);
        })
    }
    return(
        <>
            <form onSubmit={handleLoginRequest} data-testid='login_form'>
                <div>
                    Username
                    <input 
                    type="text" 
                    value={username}
                    name="Username"
                    data-testid="login_form_username" 
                    onChange={(e)=>setUsername(e.target.value)}/>
                </div>
                <div>
                    Password
                    <input 
                    type="text" 
                    value={password}
                    name="Password"
                    data-testid="login_form_password" 
                    onChange={(e)=>setPassword(e.target.value)}/>
                </div>
                <button type="submit" data-testid="login_form_login">login</button>
            </form>
        </>
    )


}