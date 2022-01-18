import React from "react";
import './categories.style.scss';
import { selectCollection } from "../../redux/shop/shop.selectors";
import { useSelector } from "react-redux";
// import { connect, useSelector } from "react-redux";
// import { withRouter } from "../../utils/router.params";
import CollectionItemComponent from "../../components/collection-item/collection-item.component";
import { useParams } from "react-router-dom";

const CollectionPage = () => {

    const { collectionId } = useParams();
    const collection = useSelector(selectCollection(collectionId))
    const { title, items } = collection;
    return (
        <div className="collection-page">
            <h2 className="title">{title}</h2>
            <div className="items">
                {items.map(item => (
                    <CollectionItemComponent key={item.id} item={item} />
                ))}
            </div>
        </div>
    )
}
// const mapStateToProps = (state, { urlParams }) => {
//     return ({
//         collection: selectCollection(urlParams.collectionId)(state)
//     })
// }
export default CollectionPage;