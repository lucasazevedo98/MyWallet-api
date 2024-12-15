import { MongoClient } from "mongodb";
import dotenv from "dotenv"


dotenv.config()




export async function conexaoDB(){
    let db;
    try{
        const client = new MongoClient(process.env.DATABASE_URL)
        client.connect()
        console.log("conexao com o DB feita com sucesso!")
        db = client.db()
        return db
    } catch(error){
        console.log(error)
    } 
}