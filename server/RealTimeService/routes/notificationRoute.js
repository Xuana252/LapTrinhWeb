const express = require("express");
const { addNotification, getNotification, deleteNotification, deleteAllNotification, readNotification } = require("../controller/notificationController");
const router = express.Router()

router.get('/:id',getNotification)

router.post('/:id',addNotification)

router.patch('/:id',readNotification)

router.delete('/:id/:notificationId',deleteNotification)

router.delete('/:id',deleteAllNotification)


module.exports = router