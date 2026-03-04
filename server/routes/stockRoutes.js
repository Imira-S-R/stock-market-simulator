const { Router } = require('express')
const stockController = require('../../server/controllers/stockController')

const router = Router()

router.post('/buy_stock', stockController.buy_stock)
router.post('/sell_stock', stockController.sell_stock)
router.get('/get_value', stockController.get_portfolio_value)
router.post('/search_stock', stockController.search_for_company)
router.post('/company_info', stockController.get_info_company)
router.get('/user_holdings', stockController.get_user_holdings)
router.get('/user_transactions', stockController.get_user_transactions)
router.get('/get_gainers', stockController.get_gainers)
router.get('/get_user_info', stockController.get_user_info)
router.post('/get_company_chart_info', stockController.get_company_chart_info)

module.exports = router