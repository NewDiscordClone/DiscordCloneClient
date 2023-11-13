import React, {useContext, useEffect, useState} from 'react';
import {AppContext} from "../../../../../../Contexts";
import GIFScroll from "./GIFScroll";
import tabStyles from "./GIFs.module.scss";
import {Category} from "../../../../../../api/TenorController";

type Props = {
    search: string | undefined;
    setSearch: (value: string) => void;
    openFeatured: () => void;
}
const GiFsCategories = ({search, setSearch, openFeatured}: Props) => {
    const {getData} = useContext(AppContext);
    const [categories, setCategories] = useState<Category[]>([])


    useEffect(() => {
        getData.tenor.getCategories().then(c => setCategories(c))
    }, [search]);

    return (
        <GIFScroll>
            {
                categories && categories.map(category =>
                    <div className={tabStyles.category} onClick={(e) => {
                        e.stopPropagation()
                        if(category.isFeatured) openFeatured();
                        else setSearch(category.searchTerm);
                    }}>
                        <img key={category.image} src={category.image} alt={category.searchTerm}/>
                        <h3>{category.searchTerm}</h3>
                    </div>
                )
            }
        </GIFScroll>
    );
};

export default GiFsCategories;