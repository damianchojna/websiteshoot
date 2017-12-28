const fs = require("fs");
const path = require("path");
const errors = require('restify-errors');
const sanitize = require("sanitize-filename");
const container = require('./../core/container');

module.exports = async (req, res, next) => {

    try {
        const browser = container.get('browser');
        const page = await browser.newPage();
        await page.setViewport({width: 1920, height: 1080});

        const url = req.query.url;
        const filePath = path.join(__dirname, '..', 'data',  sanitize(url)+'.png');
        await page.goto(req.query.url);

        await page.screenshot({path: filePath, fullPage: true});

        const stat = fs.statSync(filePath);
        res.setHeader('Content-Type', 'image/png');
        res.setHeader('Content-Length', stat.size);

        const screenShotStream = fs.createReadStream(filePath);
        screenShotStream.pipe(res);
        return next();
    } catch(e) {
        res.send(new errors.InternalServerError());
        console.error(e);
        return next();
    }

};