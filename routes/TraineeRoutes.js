const express = require("express");
const router = express.Router();
const TraineeController = require("../controller/TraineeController");


router.get(
  "/schedule-data",
  TraineeController.findWithScheduleData.bind(TraineeController)
);

router.post("/", TraineeController.create.bind(TraineeController));
router.get("/", TraineeController.findAll.bind(TraineeController));
router.get("/:id", TraineeController.findById.bind(TraineeController));
router.put("/:id", TraineeController.update.bind(TraineeController));
router.delete("/:id", TraineeController.delete.bind(TraineeController));


module.exports = router;
