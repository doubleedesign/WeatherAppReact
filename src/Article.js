import React, {useState} from "react";
import LinesEllipsis from "react-lines-ellipsis";

export default function Article(props) {
    //console.log(props.data[1]);
    let date = new Date(props.data[1].published_at);
    let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    /**
     * Output
     */
    return (
        <article className="news-item">
            <a href={props.data[1].url}>
                <h2 className="news-item-heading">{props.data[1].title}</h2>
                <p className="news-item-source">
                    <span>{date.getDate()} {months[date.getMonth()]}</span>
                    <span>{props.data[1].source}</span>
                </p>
                <LinesEllipsis component="p" text={props.data[1].description} maxLine="3" ellipsis="..." trimRight basedOn="letters"/>
            </a>
        </article>
    )
}