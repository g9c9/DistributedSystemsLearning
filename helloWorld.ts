function greet(name: string): string {
    return `Hello, ${name}!`;
}

console.log(greet("world"));

const handler = (_req: Request) => {
    return new Response(greet("Test"));
}

// Run server: deno run --allow-net server.ts
Deno.serve(handler);