import db from "./../db.js";
import joi from "joi";
import { ObjectId } from 'mongodb';
import dayjs from "dayjs";



export async function postChoice(req,res){
  const userSchema = joi.object({
      title: joi.string().required(),
      poolId: joi.string().required()//Deve ser o id da Poll
  });
  const {error} = userSchema.validate(req.body);
  if(error) return res.sendStatus(422);

  const {title,poolId} = req.body 

  try {
    //procurando enquente com o mesmo id
    const enquete = await db.collection("poll").findOne({_id: new ObjectId(poolId)});
    if(!enquete) return res.sendStatus(404);//Não existe a enquete

    //Verificar se o title ja existe?
    const opcao = await db.collection("choice").findOne({title: title});
    if(opcao) return res.sendStatus(409);//Um title igual encontrado

    await db.collection("choice").insertOne({title,poolId});//Criadao
    res.status(201).send("Escolha atribuida a enquete!");   

    
  } catch (error) {
      console.log("Error insercao da transação.", error);
      res.status(500).send("Error na inserção da escolha na enquente.");
  }
}

export async function postVote(req,res){
  const {id} = req.params;
  
  try {
    //Verificar se a opcao (choice) existe
    const opcao = await db.collection("choice").findOne({_id: new ObjectId(id)});
    if(!opcao) return res.sendStatus(404);//Não a opção

    //procurando enquente com o mesmo id
    const enquete = await db.collection("poll").findOne({_id: new ObjectId(opcao.poolId)});

    //Verificar se ja expirou
    const hoje = dayjs().format('YYYY-MM-DD HH:mm');
    if(Date.parse(hoje)>Date.parse(enquete.expireAt)){
      return res.sendStatus(403);//Tempo Expirou
    } 
    const voto = await db.collection("vote").findOne({idVote: opcao._id});
    console.log("Inserido o voto", voto);
    if(!voto){
      //primeiro voto
      await db.collection("vote").insertOne({
        title: opcao.title,
        idVote: opcao._id,
        votes: 1
      });
      res.status(201).send("Voto feito");   

    }else{
      //mais um voto
      await db.collection("vote").updateOne({ 
            _id: new ObjectId(voto._id)
        }, { $inc: {
            votes: 1
        }});
      res.status(201).send("Voto feito"); 
    }

  } catch (error) {
      console.log("Error insercao do voto.", error);
      res.status(500).send("Error na inserção do voto na enquente.");
  }
}