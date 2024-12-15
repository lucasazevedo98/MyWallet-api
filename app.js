import express,{json} from "express"
import  dotenv from "dotenv"
import { conexaoDB } from "./config/db.js"
import usuariosRotas from "./routes/usuariosRotas.js"

dotenv.config()

const app = express()

app.use(json())


conexaoDB()


app.use(usuariosRotas)






const PORT = process.env.PORT || 5000

app.listen(PORT, ()=>{
    console.log("servidor rodando!")
})