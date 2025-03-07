import { assertEquals } from "jsr:@std/assert" // https://jsr.io/@std/assert

// Run tests using this command: deno test --allow-read --allow-run --allow-net

// Define server settings
const BASE_URL = "http://localhost:8000"
const serverScript = "KeyValueStore/SingleNodeKeyValueStore.ts"

// Start server before running tests
const serverProcess: Deno.ChildProcess = new Deno.Command(Deno.execPath(), {
    args: [
        "run",
        "--allow-net",
        serverScript
    ]
}).spawn();

// Give the server some time to start
await new Promise((resolve) => setTimeout(resolve, 1000));

// Helper function to send requests
async function request(method: string, key:string, body?: string) {
    const response = await fetch(`${BASE_URL}/${key}`, {
        method,
        body,
    });

    // Ensure response body is consumed
    const responseText = await response.text();
    return {status: response.status, body: responseText};
}

// Test case: PUT and GET a key
Deno.test("Put and Get a key", async () => {
    const key = "name";
    const value = "Kaladin";

    // Store a key-value pair
    const putResponse = await request("PUT", key, value);
    assertEquals(putResponse.status, 200);
    assertEquals(putResponse.body, "Stored");

    // Get the value from key
    const getResponse = await request("GET", key);
    assertEquals(getResponse.status, 200);
    assertEquals(getResponse.body, value);
});

// Test Case: Negative validation - Retrive non-existent key
Deno.test("Retrieve non-existent key", async () => {
    const key = "profession";

    const response = await request("GET", key);
    assertEquals(response.status, 404);
    assertEquals(response.body, "Not Found");
});

// Test Case: Delete existing key
Deno.test("Delete existing key", async () => {
    const key = "name";
    const value = "Kaladin"

    const putResponse = await request("PUT", key, value);
    assertEquals(putResponse.status, 200);
    assertEquals(putResponse.body, "Stored");

    const getResponse = await request("GET", key);
    assertEquals(getResponse.status, 200);
    assertEquals(getResponse.body, value);

    const deleteResponse = await request("DELETE", key);
    assertEquals(deleteResponse.status, 200);
    assertEquals(deleteResponse.body, "Deleted");

    const getResponse2 = await request("GET", key);
    assertEquals(getResponse2.status, 404);
    assertEquals(getResponse2.body, "Not Found");
});

Deno.test("Shutdown server", () => {
    serverProcess.kill();
});