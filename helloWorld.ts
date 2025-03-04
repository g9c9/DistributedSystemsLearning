function greet(name: string): string {
    return `Hello, ${name}!`;
}

console.log(greet("world"));


// https://docs.deno.com/runtime/fundamentals/http_server/

const handler = async (req: Request) => {
    console.log(`Method: ${req.method}`);

    const url = new URL(req.url);
    console.log(`Path: ${url.pathname}`);
    console.log(`Query parameters: ${url.searchParams}`);

    console.log("Headers:");
    req.headers.forEach((val, key, _parent) => {
        console.log(`${key} : ${val}`);
    })

    if (req.body) {
        // Await here ensures the body is fully read before logging
        const body = await req.text();  
        console.log(`Body: ${body}`);
    }

    return new Response(greet(url.searchParams.get('name') ?? "User"));
}

// Run server: deno run --allow-net server.ts
Deno.serve(handler);