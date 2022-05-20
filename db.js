import {MongoClient} from "mongodb";
import chalk from 'chalk';
import dotenv from "dotenv";

dotenv.config();

let db = null;
try {
    const mongoClient = new MongoClient(process.env.MONGO_URL);
    await mongoClient.connect();
    db = mongoClient.db(process.env.BANCO);
    console.log(chalk.blue.bold("Conexão com o banco dados MongoDB estabelecida!"))
} catch(e) {
    console.log(chalk.red.bold("Erro ao se conectar ao banco de dados!"),e);
}

export default db;