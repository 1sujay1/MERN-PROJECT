import { all, call, put, takeLatest } from 'redux-saga/effects';
import shopActionTypes from './shop.types';
import { fetchCollectionsSuccess, fetchCollectionsFailure } from './shop.actions.js'
import { convertCollectionsSnapshotToMap, getCollectionsRef } from '../../firebase/firebase.utils';

function* fetchCollectionsAsync() {
    try {
        const collectionRef = yield getCollectionsRef('collections');
        console.log("collectionRef", collectionRef);
        const collectionData = yield call(
            convertCollectionsSnapshotToMap,
            collectionRef
        );
        yield put(fetchCollectionsSuccess(collectionData));
    } catch (error) {
        yield put(fetchCollectionsFailure(error));
    }
}

export function* fetchCollectionsStarts() {
    yield takeLatest(
        shopActionTypes.FETCH_COLLECTIONS_START,
        fetchCollectionsAsync
    )
}
export function* shopSagas() {
    yield all([
        call(fetchCollectionsStarts)
    ])
}