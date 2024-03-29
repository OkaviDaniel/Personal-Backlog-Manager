import SearchSite from '../models/search-site.js';
import HttpError from '../models/http-error.js';

const searchForProduct = async (productId, type) => {
    const searchSite = new SearchSite(productId, type);
    let productInfo;
    try{
        // retrieving the info from the model object
        productInfo = await searchSite.getInfo();
    }catch(err){
        throw new HttpError(err.message, 502);
    }
    // console.log(productInfo);
    return productInfo;
}

const searchForProductByName = async (productId, type) => {
    const searchSite = new SearchSite(productId, type);
    let products;
    try{
        products = await searchSite.searchProducts();
    }catch(err){
        throw new HttpError(err.message, 502);
    };

    return products;
};

export {searchForProduct, searchForProductByName};