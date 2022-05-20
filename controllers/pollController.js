import db from "./../db.js";
import joi from "joi";
import dayjs from "dayjs"; //Formato usado ->dayjs().format('YYYY-MM-DD HH:mm')
import { ObjectId } from 'mongodb';

export async function getPoll(req, res) {
  try {
    const enquentes = await db.collection("poll").find().toArray(); 
    res.send(enquentes);
  } catch (e) {
    console.log(e);
    return res.status(500).send("Erro na lista de enquetes!", e);
  }
}

export async function postPoll(req,res){
  const userSchema = joi.object({
      title: joi.string().required(),
      //expireAt: joi.string().valid('',pattern(/^20[0-9]{2}-[0-1][0-9]-[0-2][0-9]:[0-5][0-9]$/)).required(),
      expireAt: joi.string()
  });
  const {error} = userSchema.validate(req.body);
  if(error) return res.sendStatus(422);

  const {title,expireAt} = req.body 

  try {
    if(expireAt == "" || expireAt == undefined){
      let prazo = dayjs().add(30, 'day').format(`YYYY-MM-DD HH:mm`); //adicionado mais 30 dias a partir do dia criado
      await db.collection("poll").insertOne({title,expireAt:prazo});
      res.status(201).send("Enquete criada");   
    }else{
      await db.collection("poll").insertOne({title,expireAt});
      res.status(201).send("Enquete criada"); 
    }
    
  } catch (error) {
      console.log("Error insercao da transação.", error);
      res.status(500).send("Error insercao da transação.");
  }
}

//Retornar as escolhas da enquente
export async function getChoice(req, res) {

  const {id} = req.params;

  try {
    const choices = await db.collection("choice").find({poolId: id}).toArray();
    res.send(choices);
  } catch (e) {
    console.log(e);
    return res.status(500).send("Erro na lista de usuarios!", e);
  }
}

export async function getResult(req, res) {

  const {id} = req.params;//Id da enquente

  try {
    //enquente
    const poll = await db.collection("poll").findOne({_id: new ObjectId(id)});
  
    let resultado = {
      title: "",
      votes: 0
    }
    //buscar as choices
    const choices = await db.collection("choice").find({poolId: id}).toArray();
    
    const promiseList = choices.map(async (escolha) => {
      //verificar quantos votos existem nesta escolha
      const voto = await db.collection("vote").findOne({idVote: escolha._id});
      if(voto.votes > resultado.votes){
        resultado.title = voto.title
        resultado.votes = voto.votes
      }
      return resultado;
    });

    Promise.all(promiseList).then(results => {
        res.send({
          _id:poll._id,
          title: poll.title,
          expireAt: poll.expireAt,
          result:resultado
        })
    });
    
  } catch (e) {
    console.log(e);
    return res.status(500).send("Erro na lista de votos!", e);
  }
}

