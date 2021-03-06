import React from "react";
import { withRouter } from "../../utils/router.params";
import CollectionItem from "../collection-item/collection-item.component";
import './collection-preview.style.scss';

const CollectionPreview = ({ title, items, routeName, navigate, location }) => {

    return (
        <div className="collection-preview">
            <h1 className="title" onClick={() => navigate(`${location.pathname}/${routeName}`)} >{title.toUpperCase()}</h1>
            <div className="preview">
                {items
                    .filter((item, index) => index < 4)
                    .map((item) => (
                        <CollectionItem
                            key={item.id} item={item}
                        />
                    ))}
            </div>
        </div>
    )
}
export default withRouter(CollectionPreview);
