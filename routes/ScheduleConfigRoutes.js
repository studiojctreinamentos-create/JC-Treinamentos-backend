const express = require("express");
const router = express.Router();
const ScheduleConfig = require("../controller/ScheduleConfigController");

router.get("/find-id", ScheduleConfig.findIdByDayAndTime.bind(ScheduleConfig))
router.post("/create-many", ScheduleConfig.createMany);

router.post("/", ScheduleConfig.create.bind(ScheduleConfig));
router.get("/", ScheduleConfig.findAll.bind(ScheduleConfig));
router.get("/:id", ScheduleConfig.findById.bind(ScheduleConfig));
router.put("/:id", ScheduleConfig.update.bind(ScheduleConfig));
router.delete("/:id", ScheduleConfig.delete.bind(ScheduleConfig));

module.exports = router;
