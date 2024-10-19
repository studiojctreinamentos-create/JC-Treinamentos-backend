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
                throw Error("Invalid email or password")
            }

            const token = jwt.sign({coachId : coach.id}, process.env.JWT_SECRET, {expiresIn: '1d'})
            res.json({token})
        }catch(e){
            res.status(400).json({error: e.message})
        }

    }

}

module.exports = new CoachController()