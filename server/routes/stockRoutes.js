const { Router } = require('express')
const stockController = require('../../server/controllers/stockController')

const router = Router()

router.post('/api/buy_stock', stockController.buy_stock)
router.post('/api/sell_stock', stockController.sell_stock)
router.get('/api/get_value', stockController.get_portfolio_value)
router.post('/api/search_stock', stockController.search_for_company)
router.post('/api/company_info', stockController.get_info_company)
router.get('/api/user_holdings', stockController.get_user_holdings)
router.get('/api/user_transactions', stockController.get_user_transactions)
router.get('/api/get_gainers', stockController.get_gainers)
router.get('/api/get_user_info', stockController.get_user_info)
router.post('/api/get_company_chart_info', stockController.get_company_chart_info)

module.exports = router