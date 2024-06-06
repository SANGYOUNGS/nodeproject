const express = require('express')
const app = express()

require('dotenv').config()



let connectDB = require('./db.js')

let db
connectDB.then((client)=>{
  console.log('DB연결성공')
  db = client.db(' ')
}).catch((err)=>{
    app.listen(process.env.PORT, () => {
        console.log('http://localhost:8080 에서 서버 실행중')
    })
  console.log(err)
})

app.use('/clothes', require('./routes/clothes.js') )