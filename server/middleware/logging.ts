export default defineEventHandler(async (event) => {
  if (event.node.req.method === "POST") {
    const body = await readBody(event);
    const json = JSON.stringify(body, null, 4);
    console.log(`${event.node.req.method} ${event.node.req.url} ${json}`);
    return;
  }

  console.log(`${event.node.req.method} ${event.node.req.url}`);
});
