import {MemoryConfig} from "../types/memoryConfig";
import {memory} from "../types/memoryData";
import * as crypto from "crypto";

export class MemoryManager {
    private readonly memoryDB: memory[] = [];
    private readonly memorySetup : MemoryConfig
    public constructor(options: MemoryConfig) {
        this.memorySetup = options;
    }
    public get memoryData(): memory[] {
        if (this.memoryDB.length < 1) {
            return []
        } else {
            return this.memoryDB.splice(0, this.memoryDB.length)
        }
    }
    public async saveData(key: string, mouseCords?: number): Promise<memory> {
        return new Promise(async (resolve, reject) => {
            const foundElement = this.memoryDB.filter(el => el.key);
            if (foundElement.length >= this.memorySetup.maxLength){
                reject({
                    error: `Input not received; ${key} is already existent and keyLimit has been reached (${this.memorySetup.maxLength})`
                })
            }
            try {
                const append: number = this.memoryDB.push({
                    key: key,
                    mouseCords: !mouseCords ? -1 : mouseCords,
                    id: crypto.randomUUID({
                        disableEntropyCache : true
                    })
                })
                resolve(this.memoryDB[append - 1])
            } catch (e: any) {
                reject({
                    error: e.message
                })
            }
        })
    }
}