import {Server} from "./libs/server";
import {MemoryManager} from "./libs/memoryManager";


const memoryInstance: MemoryManager = new MemoryManager({
    maxLength: 3
})

const serverInstance: Server = new Server({
    port: 6969,
    memory: memoryInstance
})


serverInstance.setupServer().then(r=> {
    console.log("Listening")
    // . . .
})