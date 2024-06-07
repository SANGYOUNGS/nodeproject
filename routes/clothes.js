const router = require('express').Router()


router.get('/', (res, req) => {
    res.send('옷파는 사이트')
 })

 module.exports = router;