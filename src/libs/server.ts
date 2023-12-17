import {ServerConfig} from "../types/serverConfig";
import express, {Express, Router, Request, Response} from "express";
import {serverData} from "../types/serverBody";
import {memory} from "../types/memoryData";

export class Server {
    private readonly serverSetup : ServerConfig
    private readonly app : Express
    private readonly router : Router
    public constructor(options: ServerConfig) {
        this.serverSetup = options;
        this.app = express();
        this.router = Router({
            strict: true,
            caseSensitive: true
        });
        this.router.use(express.json())
        this.app.use(this.router);
    }
    public async setupServer(): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            await this.setupAPIs();
            this.app.listen(this.serverSetup.port, ()=> {
                resolve(true)
            })
        })
    }
    private async setupAPIs(){
        this.router.get("/keys", async (req: Request, res: Response) => {
            return res.status(200).json({
                data: this.serverSetup.memory.memoryData
            })
        })
        this.router.post("/data", async (req: Request,res: Response) => {
            const body: serverData = req.body
            if (!body.key && body.mouseCords) {
                //Mouse Cords
                await this.serverSetup.memory.saveData("NONE", body.mouseCords).then((r: memory) => {
                    return res.status(200).json({
                        data: r
                    })
                }).catch(e => {
                    return res.status(500).json({
                        error: e.error
                    })
                })
            } else if (body.key && !body.mouseCords) {
                //key
                await this.serverSetup.memory.saveData(body.key).then((r: memory) => {
                    return res.status(200).json({
                        data: r
                    })
                }).catch(e => {
                    return res.status(500).json({
                        error: e.error
                    })
                })
            } else {
                return res.status(500).json({
                    error: "Disallowed"
                })
            }
        })
    }
}