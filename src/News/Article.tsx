import React, {useState} from "react";
//import LinesEllipsis from "react-lines-ellipsis";
import "./_Article.scss";

export interface ArticleProps {
    data: any
}

export const Article: React.FC<ArticleProps> = function(
    props: {
        data: any
    }) {
    let date = new Date(props.data[1].published_at);
    let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    /**
     * Output
     */
    return (
        <article className="article">
            <a className="article__inner" href={props.data[1].url}>
                <h2 className="article__inner__title">{props.data[1].title}</h2>
                <p className="article__inner__source">
                    <span>{date.getDate()} {months[date.getMonth()]}</span>
                    <span>{props.data[1].source}</span>
                </p>
                <div className="article__inner__copy">
                    {/*<LinesEllipsis component="p" text={props.data[1].description} maxLine="3" ellipsis="..." trimRight basedOn="letters"/> */}
                </div>
            </a>
        </article>
    )
}

export default Article;