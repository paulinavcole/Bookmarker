const express = require('express');
const app = express();
db = require('./db/db.js');
const { conn, Bookmark, Category} = db;

app.get('/', (req, res) => res.redirect('/bookmarks'));
app.get('/bookmarks', async (req, res, next) => {
    try {
        const bookmarks = await Bookmark.findAll();
        res.send(bookmarks);
    } 
    catch(ex) {
        next(ex);
    }
})


const init = async() => {
    try{
        await conn.sync( {force: true});
        const coding = await Category.create({name: 'coding'});
        const search = await Category.create( {name: 'search'});

        await Bookmark.create({name: 'mdn', url: 'https://developer.mozilla.org/en-US/', categoryId : coding.id})
        await Bookmark.create({name: 'Stack Overflow', url: 'https://stackoverflow.com/', categoryId : coding.id})
        await Bookmark.create({name: 'Google', url: 'https://www.google.com/', categoryId : search.id})
        await Bookmark.create({name: 'Bing', url: 'https://www.bing.com/', categoryId : search.id})

        const port = process.env.PORT || 3000
        app.listen(port, () => console.log(`listening on port ${port}`))}   
    
    catch(ex) {
        console.log(ex)
    }
};

init();


