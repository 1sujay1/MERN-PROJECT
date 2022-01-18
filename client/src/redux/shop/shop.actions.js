// import { convertCollectionsSnapshotToMap, getCollectionsRef } from "../../firebase/firebase.utils";
import shopActionTypes from "./shop.types";

export const fetchCollectionsStart = () => ({
    type: shopActionTypes.FETCH_COLLECTIONS_START
})

export const fetchCollectionsSuccess = (collection) => ({
    type: shopActionTypes.FETCH_COLLECTIONS_SUCCESS,
    payload: collection
})
export const fetchCollectionsFailure = (errorMessage) => ({
    type: shopActionTypes.FETCH_COLLECTIONS_FAILURE,
    payload: errorMessage
})
// export const fetchCollectionsStartAsync = () => {
//     return async (dispatch) => {
//         dispatch(fetchCollectionsStart())
//         const collectionRef = await getCollectionsRef('collections');
//         const collectionData = await convertCollectionsSnapshotToMap(collectionRef);
//         dispatch(fetchCollectionsSuccess(collectionData))
//     }
// }