const express = require("express");
const router = express.Router();
const Schedule = require("../controller/ScheduleController");

router.post("/", Schedule.create.bind(Schedule));
router.get("/", Schedule.findAll.bind(Schedule));
router.get("/:id", Schedule.findById.bind(Schedule));
router.put("/:id", Schedule.update.bind(Schedule));
router.delete("/:id", Schedule.delete.bind(Schedule));

module.exports = router;
