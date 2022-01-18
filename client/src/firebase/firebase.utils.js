// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, getDoc, collection, getDocs, doc, setDoc, writeBatch } from "firebase/firestore";
// import { getAnalytics } from "firebase/analytics";
import { getAuth, signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword } from "firebase/auth";


export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' })
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// Initialize Cloud Firestore through Firebase
const firebaseConfig = {
    apiKey: "AIzaSyD_LPGvdkgJ0_Rwdn_wdL2UgnAXxmAfHwo",
    authDomain: "ecommerce-cloth-5dd7b.firebaseapp.com",
    projectId: "ecommerce-cloth-5dd7b",
    storageBucket: "ecommerce-cloth-5dd7b.appspot.com",
    messagingSenderId: "986073070819",
    appId: "1:986073070819:web:4c07a0e3a22c3e722219d6",
    measurementId: "G-J0P841FG0G"
};

// Initialize Firebase
initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

export const auth = getAuth();
export const firestore = getFirestore();
export const signInWithGoogle = () => signInWithPopup(auth, googleProvider);
// export default firebase;

export const createUserProfileDocument = async (userAuth, additionalData) => {

    // console.log("querySnapshot", await getDocs(collection(firestore, "collections")));
    if (!userAuth) return;

    try {
        const userRef = await doc(firestore, "users", userAuth.uid)
        let docSnap = await getDoc(userRef);

        if (!docSnap.exists()) {
            console.log("No such document!");
            const { displayName, email, uid } = userAuth;
            const createdAt = new Date();

            await setDoc(userRef, {
                displayName, email, createdAt, ...additionalData
            });
            return { id: uid, data: () => { return { displayName, email, ...additionalData } } };
        } else {
            // console.log("Document data:", docSnap.data());
            return docSnap

        }
    } catch (error) {
        console.log(error.message);
    }
}
export const addCollectionAndDocuments = async (collectionKey, objectsToAdd) => {
    const getRef = collection(firestore, collectionKey);
    // const querySnapshot = await getDocs(getRef);

    const batch = writeBatch(firestore)
    objectsToAdd.forEach(obj => {
        const newDocRef = doc(getRef);
        // console.log("newDocRef", newDocRef.data());
        batch.set(newDocRef, obj);
    })
    await batch.commit();
}
export const convertCollectionsSnapshotToMap = async (collection) => {
    const transformedCollection = await collection.docs.map(doc => {
        const { title, items } = doc.data()
        return {
            title,
            items,
            routeName: encodeURI(title).toLowerCase(),
            id: doc.id
        }
    })
    return transformedCollection.reduce((collectionArray, collection) => {
        collectionArray[collection.title.toLowerCase()] = collection;
        return collectionArray
    }, {})
}
export const getCollectionsRef = async (collectionName) => {
    const collectionRef = await collection(firestore, collectionName);
    const docRef = await getDocs(collectionRef)
    return docRef;
}

export const createUserWithEmail = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password)
}
export const getCurrentUser = () => {
    return new Promise((resolve, reject) => {
        const unsubscribe = auth.onAuthStateChanged(userAuth => {
            unsubscribe();
            resolve(userAuth)
        }, reject)
    })
}
// export const signOutUserAuth = () => {
//     auth.signOut()
// }