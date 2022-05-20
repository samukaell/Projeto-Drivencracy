import express, { json } from "express";
import dotenv from "dotenv";
import chalk from 'chalk';
import cors from "cors";

//Routers
import pollRouter from "./routers/pollRouter.js"
import choiceRouter from "./routers/choiceRouter.js"

//Configurações padrões
const app = express();
app.use(json());
app.use(cors());
dotenv.config();
//MONGO_URL=mongodb+srv://driven:123@cluster0.knymi.mongodb.net/Drivencracy?retryWrites=true&w=majority
//Routers
app.use(pollRouter);
app.use(choiceRouter);

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(chalk.green.bold(`O servidor está em pé ${port}`));
});