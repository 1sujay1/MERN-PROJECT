import React, { useState } from 'react';
import CustomButton from '../custom-button/custom-button.component';
import FormInput from '../form-input/form-input.component';
import './sign-in.style.scss';
import { auth } from '../../firebase/firebase.utils';
import { emailSignInStart, googleSignInStart } from '../../redux/user/user.actions';
import { connect } from 'react-redux';

const SignIn = ({ emailSignInStart, googleSignInStarts }) => {

    const [userCredentials, setUserCredentials] = useState({ email: '', password: '' });

    const { email, password } = userCredentials;

    const handleChange = (e) => {
        const { value, name } = e.target;
        setUserCredentials({ ...userCredentials, [name]: value })
    }
    const handleSubmit = (event) => {
        event.preventDefault();
        emailSignInStart(auth, email, password);
    }

    return (
        <div className="sign-in" >
            <h2 className="title">I Already have an account</h2>
            <span>Sign in with your email and password</span>
            <form onSubmit={handleSubmit} >

                <FormInput
                    name="email"
                    type="email"
                    value={email}
                    handleChange={handleChange}
                    required
                    label='Email'
                />
                <FormInput
                    name="password"
                    type="password"
                    value={password}
                    handleChange={handleChange}
                    required
                    label='Password'
                />

                <div className="buttons">
                    <CustomButton type="submit">
                        Sign in
                    </CustomButton>
                    <CustomButton type="button" isGoogleSignIn onClick={googleSignInStarts}>
                        Sign in with Google
                    </CustomButton>
                </div>
            </form>
        </div>
    )
}

const mapDispatchToProps = dispatch => ({
    googleSignInStarts: () => dispatch(googleSignInStart()),
    emailSignInStart: (auth, email, password) => dispatch(emailSignInStart({ auth, email, password }))
})

export default connect(null, mapDispatchToProps)(SignIn);
