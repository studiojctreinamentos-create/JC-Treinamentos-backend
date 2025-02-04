class BaseController {
  constructor(model) {
    this.model = model;
  }

  async create(req, res, options = {}) {
    try {
      const newRecord = await this.model.create(req.body, {
        transaction: options.transaction,
      });
      res.status(201).json(newRecord);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }

  async findAll(req, res) {

    const options = {}

    if(req.query.order){
      const [field, direction] = req.query.order.split(',')
      options.order = [[field, direction.toUpperCase()]]
    }
    
    try {
      const data = await this.model.findAll(options);
      res.status(200).json(data);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }

  async findById(req, res, options = {}) {
    try {
      const data = await this.model.findByPk(req.params.id);
      if (!data) {
        return res.status(400).json({ message: "invalid id" });
      }
      res.status(200).json(data);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }

  async update(req, res, options = {}) {
    try {
      const data = await this.model.findByPk(req.params.id, {
        transaction: options.transaction,
      });

      if (!data) {
        return res.status(400).json({ message: "invalid id" });
      }

      await data.update(req.body, { transaction: options.transaction });
      res.status(200).json(data);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }

  async delete(req, res, options = {}) {
    try {
      const data = await this.model.findByPk(req.params.id, {
        transaction: options.transaction,
      });
      if (!data) {
        return res.status(400).json({ message: "invalid id" });
      }
      await data.destroy();
      res.json({ message: "data deleted" });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }
}

module.exports = BaseController;
