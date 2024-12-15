import express from "express"
import {adicionarTransacao,obterTransacoes,editarTransacao,deletarTransacao} from "../controllers/transacaoControllers.js"


const router = express.Router()


router.post("/transactions",adicionarTransacao)
router.get("/transactions", obterTransacoes)
router.put("/transactions/:id", editarTransacao)
router.delete("/transactions/:id", deletarTransacao)


export default router