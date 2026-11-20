import app, { connectDatabase } from "./app.js";

await connectDatabase();
app.listen(5000, "127.0.0.1", () => console.log("My Classroom API on http://127.0.0.1:5000"));
