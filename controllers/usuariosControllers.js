import { conexaoDB } from "../config/db.js"
import bcrypt from "bcrypt"
import { signupShema, signinShema } from "../schemas/usuariosSchema.js"
import jwt from "jsonwebtoken"

export async function signup(req, res) {
    const { name, email, password } = req.body


    const { error } = signupShema.validate({ name, email, password }, { abortEarly: false })

    if (error) {
        return res.status(422).json(error.details.map(err => err.message))
    }


    try {
        const db = await conexaoDB()
        const usuarios = db.collection("usuarios")


        const duplicado = await usuarios.findOne({ email })

        if (duplicado) {
            return res.status(409).json({
                message: 'O e-mail já está registrado.'
            })
        }

        const crypt = await bcrypt.hash(password, 10)

        const user = {
            name,
            email,
            password: crypt
        }


        await usuarios.insertOne(user)

        res.status(201).json({ message: 'Usuário criado com sucesso.' });
    } catch (error) {
        res.status(500).json({ message: "Erro no servidor" })
    }

}


export async function signin(req, res) {

    const { email, password } = req.body

    const { error } = signinShema.validate({ email, password }, { abortEarly: false })

    if (error) return res.status(422).send(error.details.map(err => err.message))
    try {

        const db = await conexaoDB()
        const usuarios = db.collection("usuarios")


        const usuario = await usuarios.findOne({ email })

        if (!usuario) return res.status(404).json({ message: "Email não cadastrado" })


        const validarSenha = await bcrypt.compare(password,usuario.password)

        if (!validarSenha) return res.status(401).json({message:"Senha incorreta"})

        const token = jwt.sign({email:email}, process.env.SECRET_KEY, { expiresIn: '1h' });


        return res.status(200).json({token})

    } catch (error) {
        res.status(500)
    }




}