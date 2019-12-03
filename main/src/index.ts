import "reflect-metadata";
import * as express from "express";
import * as bodyParser from "body-parser";
import * as helmet from "helmet";
import * as cors from "cors";
import routes from "./routes";
import Main from "./services/match-service";
import { createConnection } from "typeorm";

//Connects to the Database -> then starts the express

// Create a new express application instance
createConnection()
  .then(async connection => {
    const app = express();
    // Call midlewares
    app.use(cors());
    app.use(helmet());
    app.use(bodyParser.json());

    //Set all routes from routes folder
    app.use("/", routes);

    app.listen(3001, () => {
      console.log("Server started on port 3001");
    });
    Main.loop();
  })
  .catch(error => console.log(error));
