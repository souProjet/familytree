import {
    serve,
    Response
} from "https://deno.land/std@0.104.0/http/server.ts";


let port = 5000
const server = serve({ port: port });
class Webhook {
    constructor(url) {
        this.url = url;
    }
    send(message) {
        fetch(this.url, {
            "method": "POST",
            "headers": { "content-type": "application/json" },
            "body": JSON.stringify(message)
        })
    }
}
const webhook = new Webhook("https://discord.com/api/webhooks/969880469242007582/0eSBFL1g7HmA2SW6rWwtPrbY586KUae7E33eI3wE3L4ahqG8aGNpdZC9c5MWGbWMohv7");
let mod = []
loadModule()

async function main(request: any) {
    let response: Response = {}
    if (request.url == "/") request.url = "/accueil";
    if (request.url.startsWith("/assets/")) {
        response.body = Deno.readFileSync("./web-page" + request.url)
    } else {
        let module = mod.find(x => x.path == request.url.split("/")[1])
        if (module) {
            response.body = await module.mod.main(request, webhook);
        }
    }

    if (!response.body || response.body == undefined || response.body == "" || response.status == 404) {
        //Page de 404
        //response.body = Deno.readFileSync("/web-page/error/404.html");
    }

    var head = new Headers();
    head.set("Access-Control-Allow-Origin", "*");
    response.headers = head;

    request.respond(response)
}


async function loadModule() {
    let tmp = []
    let module = JSON.parse(Deno.readTextFileSync("./module.json"))
    for (let i = 0; i < module.length; i++) {
        let data = module[i]
        data.mod = await import("./maker/" + module[i].path + "/main.ts")
        tmp.push(data)
        console.log("Module " + data.name + " loaded")
    }
    mod = tmp
    console.log(`App loaded on port ${port}`)

}
for await (const request of server) {
    if (["GET", "POST"].includes(request.method)) {
        main(request)
    } else { request.respond({ body: "Method not allowed" }); }
}