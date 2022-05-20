const express = require('express');
const res = require('express/lib/response');
const app = express();

db = require('./db/db.js');
const { conn, Bookmark, Category} = db;

app.get('/', (req, res) => res.redirect('/bookmarks'));
app.get('/bookmarks', async (req, res, next) => {
    try {
        const bookmarks = await Bookmark.findAll({
            //do joins with includes in sequelize
            include: [ Category ]
        });
        res.send(`
            <html>
                <head>
                    <title>Bookmarker</title>
                </head>
                <body>
                    <h1>Bookmarker</h1>
                    ${
                        bookmarks.map( bookmark => {
                            return `<li>
                              ${ bookmark.name }
                              <a href='/categories/${bookmark.categoryId}'>${ bookmark.category.name}</a>
                            </li>`;
                        }).join('')
                    }
                </body>
            </html>
        `);
    } 
    catch(ex) {
        next(ex);
    }
});

app.get('/categories/:id', async (req, res, next) => {
    try {
        const category = await Category.findByPk(req.params.id, {
            include : [ Bookmark ]
        });
        res.send(`
            <html>
                <head>
                    <title>Bookmarks for ${ category.name }</title>
                </head>
                <body>
                    <h1>Bookmarks for ${ category.name }</h1>
                    <a href='/bookmarks'>All Bookmarks</a>
                    <ul>
                    ${
                        category.bookmarks.map ( bookmark => {
                            return `
                                <li>
                                ${ bookmark.name }
                                </li>
                            `;
                        }).join('')
                    }
                    </ul>
                </body>
            </html>
        `)
    }
    catch {
        next(ex)
    }

});
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


