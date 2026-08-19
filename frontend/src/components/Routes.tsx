import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import App from './App'
import Login_Page from './login'
import CreateUser from './CreateUser';

export default function AppRoutes(){
    return(
        <Router>
            <Routes>
                <Route path="/" element={<App/>} />
                <Route path="/login" element={<Login_Page/>}/>
                <Route path="/create-user" element={<CreateUser/>}/>
            </Routes>
        </Router>
    );
}