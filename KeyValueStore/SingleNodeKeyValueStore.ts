const store = new Map<string, string>();

const handler = async (req: Request) => {
    const url = new URL(req.url)
    const key = url.pathname.slice(1) // Remove / from URL

    if (req.method === "PUT") {
        const value = await req.text() // Get body
        store.set(key, value);
        return new Response("Stored", {status: 200})
    }

    if (req.method === "GET") {
        if (store.has(key)) {
            return new Response(store.get(key), {status: 200}) 
        }
        return new Response("Not Found", { status: 404})
    }

    if (req.method === "DELETE") {
        store.delete(key)
        return new Response("Deleted", {status: 200})
    }

    return new Response("Invalid method", {status: 405})
}

Deno.serve(handler)