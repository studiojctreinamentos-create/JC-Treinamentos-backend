const BaseController = require('./BaseController')
const Admin = require('../models/Admin')

class AdminController extends BaseController{
    constructor() {
        super(Admin)
    }
}

module.exports = new AdminController()