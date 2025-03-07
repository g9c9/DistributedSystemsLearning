// Run this file using command: deno run --allow-net KeyValueStore/SingleNodeKeyValueStore.ts
// To specify different port from 8000: deno run --allow-net KeyValueStore/SingleNodeKeyValueStore.ts 8001

// Get port from command line arguments (Default: 8000)
const port = parseInt(Deno.args[0]) || 8000;

const store = new Map<string, string>();
const peers = new Set<string>();

const handler = async (req: Request) => {
    const url = new URL(req.url)
    const key = url.pathname.slice(1) // Remove / from URL

    if (req.method === "PUT") {
        const value = await req.text() // Get body
        store.set(key, value);
        return new Response("Stored", { status: 200 })
    }

    if (req.method === "GET") {
        if (store.has(key)) {
            return new Response(store.get(key), { status: 200 }) 
        }
        return new Response("Not Found", { status: 404})
    }

    if (req.method === "DELETE") {
        store.delete(key)
        return new Response("Deleted", { status: 200 })
    }

    if (req.method === "POST" && key === "register") {
        const peerAddress = await req.text();
        peers.add(peerAddress);
        console.log(`Registered new peer: ${peerAddress}`);
        return new Response("Peer registered", { status: 200 })
    }

    return new Response("Invalid method", { status: 405 })
}

Deno.serve({port}, handler)