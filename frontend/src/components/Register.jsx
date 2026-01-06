import { useState } from "react";
import {useNavigate, Link} from 'react-router-dom';
import API from "../API/api.js";
import './Register.css'
import './Button.css'

const Register = ()=>{
    const [form ,setForm] = useState({name:'',email:'',password:''});
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) =>setForm({...form,[e.target.name]: e.target.value});

    const handleSubmit = async(e)=>{
        e.preventDefault();
        setError('');
        setLoading(true);

        try{
            await API.post('/auth/register',form);
            navigate('/login');
        }catch(err){
            setError(err.response?.data?.msg || 'Something went wrong')
        } finally {
            setLoading(false);
        }
    };

    return(
        <div className="auth-container">
            <div className="auth-card">
                <h1 className="auth-title">Create Account</h1>
                
                {error && <div className="error-message">{error}</div>}
                
                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <input 
                            className="form-input"
                            name="name" 
                            placeholder="Full Name" 
                            value={form.name} 
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <input 
                            className="form-input"
                            name="email" 
                            placeholder="Email Address" 
                            type="email" 
                            value={form.email} 
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <input 
                            className="form-input"
                            name="password" 
                            placeholder="Password" 
                            type="password" 
                            value={form.password} 
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <button 
                        className="btn btn-primary" 
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <span className="loading"></span>
                                Creating account...
                            </>
                        ) : (
                            'Create Account'
                        )}
                    </button>
                </form>
                
                <div className="auth-link">
                    Already have an account? <Link to="/login">Sign in</Link>
                </div>
            </div>
        </div>
    );




};
export default Register;