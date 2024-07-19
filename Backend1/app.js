const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const fs = require('fs')
const cors = require('cors');

require('./data/db')

const app = express()
// 使用 cors 中间件
app.use(cors({
  origin: 'http://localhost:3000', 
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: ['Content-Type', 'Authorization', 'Pragma', 'Cache-Control', 'Expires'] 
}));

// view engine setup

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))
app.use('/api', express.static(path.join(__dirname, 'doc'))) // TODO 上线时关闭 apidoc -i routes/ -o doc/

const routes = fs.readdirSync(path.join(__dirname, 'routes'))
routes.forEach((v) => {
  let rout = v.replace('.js', '')
  app.use(`/${rout}`, require(`./routes/${rout}`)) //以文件名为接口
})

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404))
})

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
