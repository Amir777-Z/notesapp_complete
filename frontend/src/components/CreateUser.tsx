import axios from 'axios';
import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom'; // For redirection
import type { errorObject } from '../lib/types/errorObject';




export default function CreateUser() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate(); // For redirecting after submission


    // Send the request once we submit
    async function handleSubmit(e: FormEvent) {
        e.preventDefault(); // Prevents the form from disappearing which is the default behavior
        const newUser = { name, email, username, password };
        await axios.post(
            'http://localhost:3001/user',
            newUser,
        )
            .then(() => { navigate('/'); }).catch((error) => {
                const errorFields = error.response.data as errorObject
                if (errorFields.messages) {
                    if(errorFields.messages.length==1){
                        alert(errorFields.title + ": " + errorFields.messages[0])
                    }
                    else{
                        const reasons = errorFields.messages.slice(1).reduce((previousReasons, reason) => previousReasons + ", " + reason, errorFields.messages[0])
                    alert(errorFields.title + ": " + reasons)
                    }
                    
                }
                else {
                    alert(errorFields.title+", try again later")
                }
            });
    }

    // when the button of type "submit" is clicked, it triggers the form's onSubmit handler
    return (
        <form onSubmit={handleSubmit} data-testid="create_user_form">

            <div>
                <label>Name</label>
                <input data-testid="create_user_form_name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>

            <div>
                <label>Email</label>
                <input data-testid="create_user_form_email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>

            <div>
                <label>Username</label>
                <input data-testid="create_user_form_username" value={username} onChange={(e) => setUsername(e.target.value)} required />
            </div>

            <div>
                <label>Password</label>
                <input data-testid="create_user_form_password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>



            <button type="submit" data-testid="create_user_form_create_user">Create User</button>


        </form>
    );
}
