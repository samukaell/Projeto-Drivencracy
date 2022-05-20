import { Router } from "express";
//controllers
import { postChoice,postVote } from "../controllers/choiceController.js"; 


//Escolha da enquete -> choice
const choiceRouter = Router();

choiceRouter.post("/choice", postChoice);
choiceRouter.post("/choice/:id/vote", postVote);

export default choiceRouter;