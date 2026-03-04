const { Router } = require('express')
const snaphotController = require('../controllers/snapshotController')

const router = Router()

router.get('/add_snapshot', snaphotController.add_portfolio_chart_values)
router.get('/get_snapshot_values', snaphotController.get_portfolio_chart_values)

module.exports = router