const express = require("express");
const { getMessage, addMessage, getAllMessage } = require("../controller/messageController");
const router = express.Router()

router.get('/:id',getMessage)

router.get('/',getAllMessage)

router.patch('/:id',addMessage)


module.exports = router