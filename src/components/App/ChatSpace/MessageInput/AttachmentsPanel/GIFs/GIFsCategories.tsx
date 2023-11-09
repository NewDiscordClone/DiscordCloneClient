import React, {useContext, useEffect, useState} from 'react';
import {AppContext} from "../../../../../../Contexts";
import GIFScroll from "./GIFScroll";
import tabStyles from "./GIFs.module.scss";

type Props = {
    search: string | undefined;
    setSearch: (value: string) => void;
    openFeatured: () => void;
}
type Category = {
    title: string;
    image: string;
    action: () => void;
}
const GiFsCategories = ({search, setSearch, openFeatured}: Props) => {
    const {getData} = useContext(AppContext);
    const [categories, setCategories] = useState<Category[]>([])


    useEffect(() => {
        getData.tenor.featured(1)
            .then(response => {
                setCategories([
                    {
                        title: "featured",
                        image: response.results[0].media_formats.tinygif.url,
                        action: openFeatured

                    }
                ]);
                return getData.tenor.categories();
            })
            .then(categories => {
                setCategories(prev => [...prev, ...categories.map(c => (
                    {
                        title: c.searchterm,
                        image: c.image,
                        action: () => setSearch(c.searchterm)
                    }
                ))])
            })
    }, [search]);

    return (
        <GIFScroll>
            {
                categories && categories.map(category =>
                    <div className={tabStyles.category} onClick={(e) => {
                        e.stopPropagation()
                        category.action()
                    }}>
                        <img key={category.image} src={category.image} alt={category.title}/>
                        <h3>{category.title}</h3>
                    </div>
                )
            }
        </GIFScroll>
    );
};

export default GiFsCategories;