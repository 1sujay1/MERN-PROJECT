
import React, { useState } from 'react';
import { connect } from 'react-redux';
import { signUpStart } from '../../redux/user/user.actions';
import CustomButton from '../custom-button/custom-button.component';
import FormInput from '../form-input/form-input.component';
import './sign-up.style.scss';


const SignUp = ({ signUpStart }) => {
    const [userCredentials, setUserCredentials] = useState(
        {
            displayName: '',
            email: '',
            password: '',
            confirmPassword: ''
        }
    )
    const { displayName, email, password, confirmPassword } = userCredentials;

    const handleChange = (e) => {
        const { value, name } = e.target;
        setUserCredentials({ ...userCredentials, [name]: value });
    }
    const handleSubmit = async (event) => {
        event.preventDefault();
        if (password !== confirmPassword) {
            alert("Password donot match");
            return;
        }
        signUpStart(displayName, email, password)
    }
    return (
        <div className="sign-up">
            <h1 className="title">I do not have an account</h1>
            <span>Sign up with email and password</span>
            <form className="sign-up-form" onSubmit={handleSubmit} >
                <FormInput
                    name='displayName'
                    type='text'
                    value={displayName}
                    handleChange={handleChange}
                    required
                    label='Name'
                />
                <FormInput
                    name='email'
                    type='email'
                    value={email}
                    handleChange={handleChange}
                    required
                    label='Email'
                />
                <FormInput
                    name='password'
                    type='password'
                    value={password}
                    handleChange={handleChange}
                    required
                    label='Password'
                />
                <FormInput
                    name='confirmPassword'
                    type='confirmPassword'
                    value={confirmPassword}
                    handleChange={handleChange}
                    required
                    label='Confirm password'
                />
                <CustomButton type='submit'>Submit</CustomButton>
            </form>
        </div>
    )
}


const mapDispatchToProps = dispatch => ({
    signUpStart: (displayName, email, password) => dispatch(signUpStart({ displayName, email, password }))
})
export default connect(null, mapDispatchToProps)(SignUp);
