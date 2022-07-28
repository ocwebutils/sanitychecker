import App from "./server/app";
import { port } from "./server/config";

const app = new App();
app.listen(port);
