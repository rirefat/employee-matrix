import app from "../dist/server.cjs";

// Ensure we get the Express app correctly regardless of default-interop behavior
const handler = app.default || app;

export default handler;
