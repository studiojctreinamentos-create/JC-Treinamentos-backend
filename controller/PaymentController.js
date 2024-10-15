const Payment = require("../models/Payment")
const BaseController = require("./BaseController")

class PaymentController extends BaseController{
    constructor() {
        super(Payment)
    }
}

module.exports = new PaymentController()