import { put, takeLatest, all, call } from 'redux-saga/effects'
import UserActionTypes from './user.types'

import { googleProvider, auth, createUserProfileDocument, getCurrentUser } from '../../firebase/firebase.utils'
import { signInFailure, signInSuccess, signOutFailure, signOutSuccess, signUpFailure, signUpSuccess } from './user.actions'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth'

export function* getSnapshotFromUserAuth(user, additionalData) {
    try {
        const userRef = yield call(createUserProfileDocument, user, additionalData);
        yield put(signInSuccess({ id: userRef.id, ...userRef.data() }))
    } catch (error) {
        yield put(signInFailure(error))
    }
}

export function* signInWithGoogle() {
    try {
        const { user } = yield signInWithPopup(auth, googleProvider);
        yield getSnapshotFromUserAuth(user)
    } catch (error) {
        yield put(signInFailure(error))
    }
}
export function* signInWithEmail({ payload: { auth, email, password } }) {
    try {
        const { user } = yield signInWithEmailAndPassword(auth, email, password);
        yield getSnapshotFromUserAuth(user)
    } catch (error) {
        yield put(signInFailure(error))
    }
}
export function* isUserAuthenticated() {
    try {
        const userAuth = yield getCurrentUser();
        if (!userAuth) return
        yield getSnapshotFromUserAuth(userAuth)
    } catch (error) {
        yield put(signInFailure(error))
    }
}
export function* signOutUserFromSession() {
    try {
        yield auth.signOut()
        yield put(signOutSuccess())
    } catch (error) {
        yield put(signOutFailure(error))
    }
}
export function* signUpUser({ payload: { displayName, email, password } }) {
    try {
        console.log("displayName, email, password", displayName, email, password);
        const { user } = yield createUserWithEmailAndPassword(auth, email, password);
        yield put(signUpSuccess({ user, additionalData: { displayName } }))
    } catch (error) {
        yield put(signUpFailure(error))
    }
}

export function* signUpAfterSuccess({ payload: { user, additionalData } }) {
    try {
        yield getSnapshotFromUserAuth(user, additionalData)
    } catch (error) {
        yield put(signUpFailure(error))
    }
}

/**Sagas (Listeners or observers listening for actions)*/

export function* onGoogleSignInStart() {
    yield takeLatest(
        UserActionTypes.GOOGLE_SIGN_IN_START,
        signInWithGoogle
    )
}
export function* onEmailSignInStart() {
    yield takeLatest(
        UserActionTypes.EMAIL_SIGN_IN_START,
        signInWithEmail
    )
}
export function* onCheckUserSession() {
    yield takeLatest(
        UserActionTypes.CHECK_USER_SESSION,
        isUserAuthenticated
    )
}
export function* onSignOut() {
    yield takeLatest(
        UserActionTypes.SIGN_OUT_START,
        signOutUserFromSession
    )
}

export function* onSignUpStart() {
    yield takeLatest(
        UserActionTypes.SIGN_UP_START,
        signUpUser
    )
}
export function* onSignUpSuccess() {
    yield takeLatest(UserActionTypes.SIGN_UP_SUCCESS,
        signUpAfterSuccess
    )
}
export function* userSagas() {
    yield all([
        call(onGoogleSignInStart),
        call(onEmailSignInStart),
        call(onCheckUserSession),
        call(onSignOut),
        call(onSignUpStart),
        call(onSignUpSuccess),
    ])
}
