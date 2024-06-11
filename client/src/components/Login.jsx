import React, { useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import '../css/login.css'
const Login = () => {
    const imageUrl = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRto4be2Rv71tmznTKS27nMtwbdqxb3RMOr_A&s";
    const [account, toggleAccount] = useState('login');
    const [login, setLogin] = useState({ username: '', password: ''});
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const loginUsingGoogle = () => {
        window.open("https://xeno-task.onrender.com/auth/google", "_self");
   
};
    

    const onValueChange = (e) => {
        setLogin({ ...login, [e.target.name]: e.target.value });
        console.log(login)
    };


    const loginUser = async () => {
        const settings = {
            method: "POST",
            body: JSON.stringify(login),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        };
        try {
            console.log(settings.body)
            const fetchResponse = await fetch(`https://xeno-task.onrender.com/login`, settings);
            const response = await fetchResponse.json();
            setError('');
            if (response.msg === 'Account does not exist') {
                setError('Account does not exist');
                setLogin({ username: '', password: '' });
                return;
            }
            sessionStorage.setItem('accessToken', `Bearer ${response.accessToken}`);
            sessionStorage.setItem('refreshToken', `Bearer ${response.refreshToken}`);

            if(response.status === 'success'){
                setLogin({ username: '', password: '',});
                navigate('/home');
            }else{
                setError('Something went wrong, please try again later');
            }
            
            
        } catch (e) {
            
        }
    };

    return (
        <div className='login-boxx'>

            <div className='sub-box-1'>
                <div style={{
                    fontSize:'20px',
                    fontWeight:'700',
                    color:'white'
                }}>
                    Welcome To Mini CRM Application
                </div>
                <div className='google-text'>
                    <div>
                        Google authentitcation
                    </div>

                    
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', padding: '50px 0 0' }}>
                <img src={imageUrl} alt="login" style={{ width: '200px' }} />
            </div>
            
                    <div style={{ display: 'flex', flexDirection: 'column', marginTop: '20px' }}>
                        
                        <Button
                            onClick={loginUsingGoogle}
                            style={{
                                textTransform: 'none',backgroundColor: 'black',color: '#41ef1a',height: '48px', borderRadius: '7px',boxShadow: '0 2px 4px 0 rgb(0 0 0 / 20%)', marginTop: '20px'
                            }}>
                            SIGN IN WITH GOOGLE
                        </Button>
                    </div>
                
                
            
        </div>
    );
};
export default Login;
