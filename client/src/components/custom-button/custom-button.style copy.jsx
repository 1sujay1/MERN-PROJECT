import styled, { css } from 'styled-components';

const buttonStyle = css`
background: black;
color: #fff;
border: none;
&:hover{
    background-color: #fff;
    color: black;
    border: 1px solid black;
}
`
const invertedButtonStyle = css`
background-color: #fff;
color: black;
border: 1px solid black;
    &:hover {
    background-color: black;
    color: #fff;
    border: none;
    }
`
const googleSignInButtonStyle = css`
background-color: blue;
color: #fff;
&:hover {
    color: black;
    background-color: #fff;
}
`
const getButtonStyles = props => (
    props.isGoogleSignIn
        ? googleSignInButtonStyle
        : props.inverted
            ? invertedButtonStyle
            : buttonStyle
)
export const CustomButtonContainer = styled.button`
cursor: pointer;
min-width: 165px;
width: auto;
height: 50px;
letter-spacing: 0.5px;
line-height: 50px;
padding: 0 35px 0 35px;
text-transform: uppercase;
font-family: "Open Sans Condensed";
font-weight: bolder;
display: flex;
justify-content: center;
${getButtonStyles}
`