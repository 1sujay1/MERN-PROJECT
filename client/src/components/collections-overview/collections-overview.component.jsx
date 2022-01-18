import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { selectCollectionsForPreview } from "../../redux/shop/shop.selectors";
import CollectionPreview from "../collection/collection-preview.component";

import './collections-overview.style.scss';

const CollectionOverView = ({ collections }) => {
    return (
        <div className="collection-overview">
            {
                collections.map(({ id, ...otherCollectionProp }) => (
                    <CollectionPreview
                        key={id}
                        {...otherCollectionProp}
                    />
                ))
            }
        </div>
    )
}
const mapStateToProps = createStructuredSelector({
    collections: selectCollectionsForPreview
})

export default connect(mapStateToProps)(CollectionOverView);