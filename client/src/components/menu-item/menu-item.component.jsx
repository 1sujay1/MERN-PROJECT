import React from "react";
import { withRouter } from "../../utils/router.params";
import './menu-item.style.scss'

const MenuItem = ({ title, imageUrl, size, navigate, linkUrl }) => {
    return (
        <div className={`menu-item ${size}`} onClick={() => navigate(`${linkUrl}`)}>
            <div className="background-image"
                style={{
                    backgroundImage: `url(${imageUrl})`
                }} />
            <div className="content" >
                <h1 className="title">{title.toUpperCase()}</h1>
                <span className="subtitle">SHOP NOW</span>
            </div>
        </div>
    )
}
export default withRouter(MenuItem);