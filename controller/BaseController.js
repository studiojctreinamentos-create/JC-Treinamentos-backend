class BaseController {
    constructor(model) {
        this.model = model
    }

    async create(req, res){
        try{
            const newRecord = await this.model.create(req.body)
            res.status(201).json(newRecord)
        }catch(e){
            res.status(500).json({error: e.message})
        }
    }

    async findAll(req, res){
        try{
            const data = await this.model.findAll()
            res.status(200).json(data)
        }catch(e){
            res.status(500).json({error: e.message})
        }
    }

    async findById(req, res){
        try{
            const data = await this.model.findByPk(req.params.id)
            if(!data){
                throw Error("data not found")
            }
            res.status(200).json(data)
        } catch(e){
            res.status(500).json({error: e.message})
        }
    }

    async update(req, res){
        try{
            const data = await this.model.findByPk(req.params.id)

            if(!data){
                throw new Error("invalid id")
            }
            
            await data.update(req.body)
            res.status(200).json(data)
        }catch(e){
            res.status(500).json({error: e.message})
        }
    }

    async delete(req, res){
        try{
            const data = await this.model.findByPk(req.params.id)
            if(!data){
                throw new Error("data not found")
            }
            await data.destroy();
            res.json({ message: 'data deleted'})
        }catch(e){
            res.status(500).json({ error: e.message})
        }
    }
}

module.exports = BaseController