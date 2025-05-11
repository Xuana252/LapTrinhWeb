const express = require("express");
const { getMessage, addMessage } = require("../controller/messageController");
const router = express.Router()

router.get('/:id',getMessage)

router.patch('/:id',addMessage)


module.exports = router