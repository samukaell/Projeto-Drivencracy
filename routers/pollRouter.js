import { Router } from "express";
//controllers
import { getPoll,postPoll, getChoice,getResult } from "../controllers/pollController.js"; 


//Esnquentes -> poll
const pollRouter = Router();

pollRouter.get("/poll", getPoll);
pollRouter.get("/poll/:id/choice", getChoice);
pollRouter.get("/poll/:id/result", getResult);
pollRouter.post("/poll", postPoll);

export default pollRouter;
