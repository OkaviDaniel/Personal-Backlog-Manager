# Personal-Backlog-Manager

## About
This web application is meant for learning purposes only, and it meant for a single user, therefore Registration and Login is not required.

Personal Backlog Manager let you manage your library using 4 groups:
* **Completed** - List of completed products
* **Current** - List of products that you are currently playing or watching
* **Backlog** - List of products that you want to play or watch
* **Dropped** - List of products that you started but stopped in the middle

In the Wiki page you can read more about each group.

To add products to a list you first need to go to ADD PRODUCT page, and then you have 2 options:
1. Add product by ID, in this case you **don't need** to press "search product"
2. Add product by name, in this case after you wrote the name of the product and selected the category you **need** to press "search product".

## Technologies
This is a MERN Stack project, which includes Web Scraping to fetch data from various sites.
* **JavaScript** - the programming language I used in the whole project
* **Node.js**, **Express.js** - for the Backend
* **HTML**, **CSS**, **React.js** - for the Frontend
* **MongoDB** - for Data Base
* **Cheerio** - for Web Scraping
* **Axios** - for API requests
* **Postman** - for API testing

## Requirements
1. Node
2. MongoDB Compass

## How to use
First make sure you installed the above requirements.

After that create `.env` file in the Frontent and `nodemon.json` in the Backend.

The content of the files should be like this:

**.env** -
```
REACT_APP_BACKEND_URL=<String of the url of the Backend>
```

**nodemon.json** - 
```
{
    "env":{
        "MOVIES_URL":<url>,
        "MOVIES_URL_TITLE":<url>,
        "MOVIES_FIND_URL":<url>,
        "GAMES_MAIN_URL":<url>,
        "GAMES_SEARCH_URL":<url>,
        "GAMES_IMAGE_URL":<url>,
        "MONGO_CONNECTION": <mongodb url>
    }
}
```