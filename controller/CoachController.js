const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Coach = require('../models/Coach')

class CoachController{
    
    async register(req, res){
        const {name, email, password} = req.body
        try {
            const hashedPassword = await bcrypt.hash(password, 10)
            console.log(hashedPassword)
            const coach = await Coach.create({name, email, password: hashedPassword})
            res.status(201).json({message: "successfully created coach"})
        }catch(e){
            res.status(400).json({error: e.message, message: "Foi aqui que deu pau"})
        }
    }

    async login(req, res){
        const {email, password} = req.body
        try {
            const coach = await Coach.findOne({ where: {email}})
            if(!coach || !(await bcrypt.compare(password, coach.password))){
                console.log("achei email não")
                throw Error("Invalid email or password")
            }

            const token = jwt.sign({coachId : coach.id}, process.env.JWT_SECRET, {expiresIn: '10h'})
            
            res.json({ 
                token: token, 
                coachId: coach.id
            })
        }catch(e){
            res.status(400).json({error: e.message})
        }
    }

    async findById(req, res){
        try{
            const coach = await Coach.findByPk(req.params.id)
            if(!coach){
                return res.status(404).json({ error: "Coach not found" });
            }

            const coachData = {
                email: coach.email,
                name: coach.name
            }

            res.status(200).json(coachData)

        }catch(e){
            res.status(500).json({error: e.message})
        }
    }

    verifyToken(req, res){
        res.status(200).json({message: "token is validate"});
    }
}

module.exports = new CoachController()