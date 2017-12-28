const puppeteer = require('puppeteer');
const restify = require('restify');
const packageJson = require('./package.json');
const container = require('./core/container');

//Error Handling
process.on('unhandledRejection', err => console.error(err));
process.on('uncaughtException',  err => console.error(err));

//Kernel class
class Kernel {
    constructor() {
        this.container = container;
        this.server = this.createServer();
        this.registerRouters(this.server);
        this.initServices(container, this.server);
    }

    async initServices(container, server) {
        container.set('server',  server);
    }

    registerRouters(server) {
        server.get('/', require('./actions/home'));
        server.get('/api/printwebsite', require('./actions/printwebsite'));
    }

    createServer() {
        const server = restify.createServer({
            name: packageJson.name,
            version: packageJson.version
        });
        server.use(restify.plugins.queryParser());
        server.use(restify.plugins.bodyParser());

        return server;
    }

    async listen() {
        //@TODO przeniesc do this.initServices
        const browser = await puppeteer.launch({headless: true});
        this.container.set('browser', browser);

        await this.server.listen(3000);
        console.log('%s ready on %s', this.server.name, this.server.url);
    }
}

const app = new Kernel();
app.listen();


// async function getPic() {
//     const browser = await puppeteer.launch({headless: true});
//     const page = await browser.newPage();
//
//     await page.setViewport({width: 1920, height: 5000});
//     await page.goto('https://codeburst.io/a-guide-to-automating-scraping-the-web-with-javascript-chrome-puppeteer-node-js-b18efb9e9921');
//     await page.screenshot({path: 'google.png'});
//     await browser.close();
// }
// getPic();
