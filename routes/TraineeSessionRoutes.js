const express = require("express");
const router = express.Router();
const TraineeSessionController = require("../controller/TraineeSessionController");

router.get('/check/', TraineeSessionController.checkTraineeSession.bind(TraineeSessionController))

router.post('/', TraineeSessionController.create.bind(TraineeSessionController))
router.get("/",TraineeSessionController.findAll.bind(TraineeSessionController));
router.get("/:id",TraineeSessionController.findById.bind(TraineeSessionController));
router.put("/:id",TraineeSessionController.update.bind(TraineeSessionController));
router.delete("/:id",TraineeSessionController.delete.bind(TraineeSessionController));



module.exports = router;
