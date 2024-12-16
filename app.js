import express,{json} from "express"
import  dotenv from "dotenv"
import { conexaoDB } from "./config/db.js"
import usuariosRotas from "./routes/usuariosRotas.js"
import transacaoRotas from "./routes/transacaoRotas.js"
import cors from "cors"

dotenv.config()

const app = express()

app.use(json())
app.use(cors())


conexaoDB()


app.use(usuariosRotas)

app.use(transacaoRotas)






const PORT = process.env.PORT || 5000

app.listen(PORT, ()=>{
    console.log(`servidor rodando! na porta ${PORT}`)
})