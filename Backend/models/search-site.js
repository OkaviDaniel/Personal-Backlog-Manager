import HttpError from "./http-error.js";
import axios from "axios";
import cheerio from "cheerio";
import fs from "fs";

class SearchSite {
  // constructors

  constructor(productId, type) {
    this.productId = productId;
    this.type = type;
  }

  // methods
  async getInfo() {
    let info;
    try {
      if (this.type === "games") {
        info = await this.searchGame();
      } else if (this.type === "videos") {
        info = await this.searchMovie();
      } else if (this.type === "comics") {
        info = await this.searchComic();
      } else if (this.type === "books") {
        info = await this.searchBook();
      }
    } catch (err) {
      throw new HttpError(err.message, 502);
    }
    return info;
  }


  async searchProducts(){
    let products;
    if(this.type === "games"){
      products = await this.searchGamesForTitle();
    }else if(this.type === "videos"){
      products = await this.searchMoviesForTitle();
    }else{
      throw new HttpError("Please provide a valid type", 500);
    }
    return products;
  }
  // private methods

  async searchMoviesForTitle() {
    const prodName = this.productId;
    const validProdNameUrl = prodName.replaceAll(" ", "%20").toLowerCase();
    const url = process.env.MOVIES_FIND_URL + validProdNameUrl;
    const arr = [];

    try {
      // getting the ul of the titles
      const response = await axios.get(url, {
        headers: {
          "User-Agent": "Node/12.14.1",
        },
      });
      const htmlOfWeb = response.data;
      let $ = cheerio.load(htmlOfWeb);
      const listItems = $("ul.ipc-metadata-list").first().children("li");
      listItems.each((index, element) => {
        const li = $(element);
        const imageUrl = li.find("img").attr("src");
        const link = li.find("a");
        const title = link.text();
        const linkUrl = link.attr("href");
        const prodId = linkUrl.split("/")[2];

        // console.log("Image = " + imageUrl);
        // console.log("Title = " + title);
        // console.log("product ID = " + prodId);
        // console.log("------------------------------");

        arr.push({
          title,
          image: imageUrl,
          productId: prodId,
        });
      });
      // console.log(arr);

      // send to the frontend a json object that have the key products and value is the array
    } catch (err) {
      console.log(err);
      throw new HttpError(
        "There was a problem with searching for the product in movies site",
        500
      );
    }
    return arr;

  }

  async searchMovie() {
    const url = process.env.MOVIES_URL_TITLE + this.productId;
    let productInfo;
    try {
      const response = await axios.get(url, {
        headers: {
          "User-Agent": "Node/12.14.1",
        },
      });

      const htmlOfWeb = response.data;
      let $ = cheerio.load(htmlOfWeb);
      const check = $(".ipc-poster > .ipc-media > img").first();
      const image_original = check.attr("src");
      const title = $(".hero__primary-text").text();

      // 2nd check start
      const spans = $("div.ipc-chip-list__scroller a span");
      // printing the genres
      spans.each((index, element) => {
        const spanText = $(element).text();
        // console.log(`Span ${index}: ${spanText}`);
      });
      // 2nd check end

      // check_start
      const a_href = $(".ipc-poster > a").first().attr("href");
      // console.log(a_href);
      const searchImageUrl = process.env.MOVIES_URL + a_href;
      const response2 = await axios.get(searchImageUrl, {
        headers: {
          "User-Agent": "Node/12.14.1",
        },
      });
      const htmlOfWebImages = response2.data;
      $ = cheerio.load(htmlOfWebImages);
      let image = $(".media-viewer > div:nth-child(5) > img")
        .first()
        .attr("src");
      image = image !== undefined ? image : image_original;
      // check_end
      const imagePath = await saveImageFromUrl(image, "videos", this.productId);

      productInfo = {
        title,
        image: imagePath,
        website: url,
        platform: "windows",
      };
    } catch (err) {
      console.log(err.message);
      throw new HttpError("Couldn't retrieve data from movies site", 502);
    }
    return productInfo;
  }
  
  async searchGamesForTitle() {
    const validProdNameUrl = this.productId.replaceAll(" ", "%20").toLowerCase();
    const url = process.env.GAMES_SEARCH_URL + validProdNameUrl;
    // console.log(url);
    const arr = [];
    try {
      const response = await axios.get(url);
      const htmlOfWeb = response.data;
      let $ = cheerio.load(htmlOfWeb);
      const listItems = $("div#cardsContainer").children("div");
      listItems.each((index, element) => {
        const div = $(element);
        const prodUrl = div.find("a").attr("href");
        const regex = /\/games\/details\/(\d+)/;
        const match = prodUrl.match(regex);
        const productIdB = match && match[1];
        const image = div.find("img").attr("src");
        const title = div.find(".cardTitle h3").text();
        const platform = div.find(".cardTitle p").text();

        // console.log("Product id = " + productIdB);
        // console.log("Title = " + title);
        // console.log("Image = " + image);
        // console.log("Platform = " + platform);
        // console.log("------------------------------------------");
        arr.push({
          productId: productIdB,
          image,
          title,
          platform
        });
      });
      // console.log(arr);
    } catch (err) {
      console.log(err);
      throw new HttpError("asdad", 500);
    }
    return arr;
  }
  async searchGame() {
    const url = process.env.GAMES_MAIN_URL + this.productId;
    const imageSiteUrl = process.env.GAMES_IMAGE_URL + this.productId;
    let productInfo;
    try {
      const response = await axios.get(url);
      const htmlOfWeb = response.data;
      var $ = cheerio.load(htmlOfWeb);
      const title = $(".mainContainer > .heading > h1").first().text();
      const platform = $(".infoCards > div:nth-child(2) > div > a")
        .first()
        .text();

      // check start
      // **getting the generes**
      const links = $("div.detailCard")
        .filter(':has(h5:contains("Genres")):has(a)')
        .find("a");

      let generes = [];
      // console.log(links.length); // Number of <a> elements found
      // console.log(links.text()); // Text content of the <a> elements
      links.each((i, el) => {
        generes.push($(el).text().trim());
      });
      // console.log(generes);

      // **getting the date**
      const prodDate = $(".infoCards > div > div > h6").first().text();
      // console.log(prodDate);
      // check end

      const response2 = await axios.get(imageSiteUrl);
      const htmlOfWebImages = response2.data;
      $ = cheerio.load(htmlOfWebImages);
      const imageUrl = $(".image-list > .imageContainerColumn > a")
        .first()
        .attr("href");
      // console.log(imageUrl);
      const imagePath = await saveImageFromUrl(
        imageUrl,
        "games",
        this.productId
      );

      // console.log(imagePath);

      productInfo = {
        image: imagePath,
        title: title,
        website: url,
        platform: platform,
      };
    } catch (err) {
      console.log(err.message);
      throw new HttpError("Couldn't retrieve data from games site", 502);
    }
    return productInfo;
  }
  async searchComic() {}
  async searchBook() {}
}

const saveImageFromUrl = async (imageUrl, siteName, productId) => {
  const fileName = `uploads/images/${siteName}/${productId}.jpg`;
  // console.log("Before getting image");
  // console.log(imageUrl);
  const response2 = await axios.get(imageUrl, {
    responseType: "arraybuffer",
  });
  // console.log("After getting image");

  fs.writeFile(fileName, response2.data, (err) => {
    if (err) {
      console.log("Error in saving image - " + err);
      throw err;
    }
    console.log("Image downloaded successfully!");
  });

  // return fileName.slice(7);
  return fileName.slice(8);
};

export default SearchSite;
