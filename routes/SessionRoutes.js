const express = require("express");
const router = express.Router();
const SessionController = require("../controller/SessionController");

router.post("/", SessionController.create.bind(SessionController));
router.get("/", SessionController.findAll.bind(SessionController));
router.get("/:id", SessionController.findById.bind(SessionController));
router.put("/:id", SessionController.update.bind(SessionController));
router.delete("/:id", SessionController.delete.bind(SessionController));

module.exports = router;
