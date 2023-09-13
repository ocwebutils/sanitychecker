import App from "./server/app.js";
import { port } from "./server/config.js";

const app = new App();
app.listen(port);
