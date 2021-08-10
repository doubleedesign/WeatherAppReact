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
    const date = new Date(props.data.publishedAt);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    /**
     * Output
     */
    return (
        <article className="article">
            <a className="article__inner" href={props.data.url} target="_blank" rel="noreferrer">
                <h2 className="article__inner__title">{props.data.title}</h2>
                <p className="article__inner__source">
                    <span>{date.getDate()} {months[date.getMonth()]}</span>
                    <span>{props.data.source.name}</span>
                </p>
                <div className="article__inner__copy">
                    {/*<LinesEllipsis component="p" text={props.data.description} maxLine="3" ellipsis="..." trimRight basedOn="letters"/> */}
                </div>
            </a>
        </article>
    )
}

export default Article;