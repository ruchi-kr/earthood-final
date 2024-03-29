import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ErrorMessage, Field, Formik } from 'formik';
import loginSchema from '../Schema/LoginSchema';
import axios from 'axios';
import { login_url,mail_reminder_url } from '../config';
import { toast } from 'react-toastify';
import logo from '../assets/logo.png'

export default function Login() {

    const navigate=useNavigate();

    const loginform = {
        user_id: '',
        password: '',
    };

    const handleSubmit = async (payload, { setSubmitting }) => {
        try {
            const result = await axios.post(login_url, payload);
            
            if(result.status===200 && result.data.status===true){
                
                toast.success('Login Successfully');
                const mail_reminder = await axios.get(`${mail_reminder_url}`);
                console.log(mail_reminder.data.data);
                localStorage.setItem('mail_reminder', JSON.stringify(mail_reminder.data.data));
                sessionStorage.setItem("token", result.data.user.token);
                sessionStorage.setItem("designation_id", result.data.user.designation_id);
                sessionStorage.setItem("name", result.data.user.name);
                sessionStorage.setItem('user', JSON.stringify(result.data.user));

                navigate('/dashboard')
                window.location.reload()

            }else{

                toast.error(result.data.error);

            }

            
        } catch (error) {
            toast.error(error);
        }
        setSubmitting(false);
    };

    return (
        <div className="container-fluid loginbg" style={{ height: '100vh' }}>
            <div className="row h-100">

                <div className='col-lg-6 col-xl-4 col-12 col-md-8 p-5 rounded-4 blurloginbox shadow-lg mx-auto my-auto border border-2 border-light'>
                <img className='mb-5 d-flex justify-content-center mx-auto' width='205px' height='49px' src={logo} alt="earthoodlogo" />
                    <p className='text-center fw-bolder' style={{ fontSize: '40px', fontWeight: '700', lineHeight: '60.51px' }}>
                        <span className='fw-bolder textcolorblue'>Welcome back</span><br />
                        {/* <span className='textcolor fw-bolder'>Earthood</span> */}
                    </p>
                    <h5 className='text-white text-center'>Login to your account</h5>
                    <Formik
                        initialValues={loginform}
                        validationSchema={loginSchema}
                        onSubmit={handleSubmit}
                        validateOnChange={true}
                        validateOnBlur={true}
                    >
                        {({ handleSubmit, isSubmitting }) => (
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="user_id" className="form-label text-white">Username</label>
                                    <Field type="text" name="user_id" id="user_id" className="form-control" />
                                    <ErrorMessage name="user_id" component="div" className="error" />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="password" className="form-label text-white">Password</label>
                                    <Field type="password" name="password" id="password" className="form-control" />
                                    <ErrorMessage name="password" component="div" className="error" />
                                </div>
                                <div className="d-flex justify-content-end">
                                    <Link to="/forgotpassword" className="text-white text-end text-decoration-underline mb-3">Forgot Password?</Link>
                                </div>
                                <div className="d-grid">
                                    <button className="btn btn-success border-0 bg_green text-white" type="submit" disabled={isSubmitting}>
                                        {isSubmitting ? 'Signing...' : 'Login'}
                                    </button>
                                </div>
                            </form>
                        )}
                    </Formik>
                </div>
            </div>
        </div>
    );
}
