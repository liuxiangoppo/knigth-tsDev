import config from "./config";
import { createServer } from "http";
import { resolve, normalize } from "path";
import { stat, createReadStream } from "fs";
import MimeType from "./MimeType";

export default class KnightStaticServer {

    constructor() {
        this.port = config.port;
        this.root = config.root;
        this.indexPage = config.indexPage;
    }

    private port: number;
    private root: string;
    private indexPage: string;

    start() {
        // Todo
        createServer((req, res) => {
            const pathName = resolve(this.root + normalize(req.url));
            this.routeResolve(pathName, req, res);
        }).listen(this.port, err => {
            if (err) {
                console.error(err);
                console.info("Failed to start server");
            } else {
                console.info(`Server started on port ${this.port}`);
            }
        });
    }

    routeResolve(pathname, req, res) {
        stat(pathname, (err, stat) => {
            if (!err) {
                this.respondFile(pathname, res);
            } else {
                this.respondNotFound(req, res);
            }
        });
    }

    respondFile(pathName, res) {
        const readStream = createReadStream(pathName);
        readStream.pipe(res);
    }

    /**
     * 404结果处理
     * @param req Http请求
     * @param res Http返回
     */
    respondNotFound(req, res) {
        res.writeHead(404, {
            "Content-Type": "text/html"
        });
        res.end(`<h1>Not Found</h1><p>The requested URL ${req.url} was not found on this server.</p>`);
    }
}