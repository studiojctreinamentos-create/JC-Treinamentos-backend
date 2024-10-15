const BaseController = require('./BaseController')
const Session = require('../models/Session')

class SessionController extends BaseController{
    constructor() {
        super(Session)
    }
}

module.exports = new SessionController()