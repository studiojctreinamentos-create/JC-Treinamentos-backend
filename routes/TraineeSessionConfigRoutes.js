const express = require("express");
const router = express.Router();
const TraineeSessionConfigController = require("../controller/TraineeSessionConfigController");

router.get('/check', TraineeSessionConfigController.checkTraineeSessionConfig.bind(TraineeSessionConfigController))

router.post("/",TraineeSessionConfigController.create.bind(TraineeSessionConfigController));
router.get( "/", TraineeSessionConfigController.findAll.bind(TraineeSessionConfigController));
router.get("/:id", TraineeSessionConfigController.findById.bind(TraineeSessionConfigController));
router.put("/:id", TraineeSessionConfigController.update.bind(TraineeSessionConfigController));
router.delete("/:id", TraineeSessionConfigController.delete.bind(TraineeSessionConfigController));



module.exports = router;
