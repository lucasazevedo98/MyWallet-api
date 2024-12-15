import { conexaoDB } from "../config/db.js"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import { ObjectId } from "mongodb"

import { adicionarTransacaoShema } from "../schemas/transacaoSchema.js"


dotenv.config()

export async function adicionarTransacao(req, res) {
    const { value, description, type } = req.body

    const token = req.header('Authorization')?.replace('Bearer ', '')

        const { error } = adicionarTransacaoShema.validate({ value, description, type }, { abortEarly: false })
    
        if (error) return res.status(422).send(error.details.map(err => err.message))

    if (!token) {
        return res.status(401).json({ message: "Token inválido ou ausente" })
    }

    try {
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.SECRET_KEY)
        } catch (err) {
            console.error("Erro ao verificar o token:", err.message) 
            return res.status(401).json({ message: "Token inválido", error: err.message })
        }

        const db = await conexaoDB()
        const transacao = db.collection("transacao")

        const result = await transacao.insertOne({
            value,
            description,
            type,
            email: decoded.email,
            createdAt: new Date()  
        })

        if (result.acknowledged) {
            return res.status(200).json({ message: "Transação cadastrada com sucesso" })
        } else {
            return res.status(500).json({ message: "Erro ao cadastrar transação" })
        }

    } catch (error) {
        console.error("Erro interno do servidor:", error)
        return res.status(500).json({ message: "Erro interno do servidor", error: error.message })
    }
}

export async function obterTransacoes(req, res) {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ message: "Token inválido ou ausente" });
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        
        let page = parseInt(req.query.page) || 1;

        if (page <= 0) {
            return res.status(400).json({ message: "A página deve ser um número positivo." });
        }

        const db = await conexaoDB();
        const transacaoCollection = db.collection("transacao");

        const limit = 10;
        const skip = (page - 1) * limit;

        const transacoes = await transacaoCollection
            .find({ email: decoded.email })
            .sort({ createdAt: -1 }) 
            .skip(skip) 
            .limit(limit) 
            .toArray();

        const totalTransacoes = await transacaoCollection.countDocuments({ email: decoded.email });

        const totalPages = Math.ceil(totalTransacoes / limit);

        return res.status(200).json({
            transacoes,
            page,
            totalPages,
            totalTransacoes,
        });

    } catch (err) {
        console.error("Erro ao verificar o token:", err);
        return res.status(401).json({ message: "Token inválido", error: err.message });
    }
}

export async function editarTransacao(req, res) {
    const { value, description, type } = req.body;
    const transacaoId = req.params.id;  

    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ message: "Token inválido ou ausente" });
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);

        const { error } = adicionarTransacaoShema.validate({ value, description, type }, { abortEarly: false });
        if (error) {
            const errorMessages = error.details.map(err => err.message);
            return res.status(400).json({ message: "Erro de validação", details: errorMessages });
        }

        const db = await conexaoDB();
        const transacaoCollection = db.collection("transacao");
        const transacao = await transacaoCollection.findOne({ _id: new ObjectId(transacaoId) });

        if (!transacao) {
            return res.status(404).json({ message: "Transação não encontrada" });
        }

        if (transacao.email !== decoded.email) {
            return res.status(401).json({ message: "Você não tem permissão para editar esta transação" });
        }

        await transacaoCollection.updateOne(
            { _id: new ObjectId(transacaoId) },
            {
                $set: {
                    value,
                    description,
                    type,
                    updatedAt: new Date(), 
                },
            }
        );

        return res.status(204).send();

    } catch (error) {
        console.error("Erro ao verificar o token ou ao editar a transação:", error);
        return res.status(401).json({ message: "Token inválido", error: error.message });
    }
}

export async function deletarTransacao(req, res) {
    const transacaoId = req.params.id;  

    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ message: "Token inválido ou ausente" });
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const db = await conexaoDB();
        const transacaoCollection = db.collection("transacao");
        const transacao = await transacaoCollection.findOne({ _id: new ObjectId(transacaoId) });

        if (!transacao) {
            return res.status(404).json({ message: "Transação não encontrada" });
        }

        if (transacao.email !== decoded.email) {
            return res.status(401).json({ message: "Você não tem permissão para editar esta transação" });
        }

        await transacaoCollection.deleteOne(
            { _id: new ObjectId(transacaoId) }
        );

        return res.status(204).send();

    } catch (error) {
        console.error("Erro ao verificar o token ou ao editar a transação:", error);
        return res.status(401).json({ message: "Token inválido", error: error.message });
    }
}