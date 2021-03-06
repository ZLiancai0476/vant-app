const mysql = require('mysql')
const config = require('../config')

const pool = mysql.createPool({
  host: config.database.HOST,
  port: config.database.PORT,
  password: config.database.PASSWORD,
  user: config.database.USERNAME,
  database: config.database.DATABASE
})

let query = (sql, values) => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        reject(err)
      } else {
        connection.query(sql, values, (err, rows) => {
          if (err) {
            reject(err)
          } else {
            // console.log(rows)
            // console.log('数据库连接成功')
            resolve(rows)
          }
          connection.release()
        })
      }
    })
  })
}

let buyerUser = `
  create table if not exists buyerUser(
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    userName VARCHAR(255) NOT NULL,
    passWord VARCHAR(255) NOT NULL,
    auth VARCHAR(255) NOT NULL,
    phone VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    account_img LONGBLOB NOT NULL,
    createTime TIMESTAMP(4) NOT NULL);`

let cartgoods = `
  create table if not exists cartgoods(
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    goodsid VARCHAR(255) NOT NULL,
    imgurl LONGTEXT NOT NULL,
    price VARCHAR(255) NOT NULL,
    goodsnumber VARCHAR(255) NOT NULL,
    goodsdescript VARCHAR(255) NOT NULL,
    bussinessname VARCHAR(255) NOT NULL,
    username VARCHAR(255) NOT NULL
  );`

let address = `
  create table if not exists address(
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    areaCode VARCHAR(255) NOT NULL,
    addressDetail VARCHAR(255) NOT NULL,
    tel VARCHAR(255) NOT NULL,
    isDefault VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    postalCode VARCHAR(255) NOT NULL,
    province VARCHAR(255) NOT NULL,
    city VARCHAR(255) NOT NULL,
    county VARCHAR(255) NOT NULL,
    userid INT NOT NULL
  );`
let paylist = `
  create table if not exists paylist(
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    goodsid VARCHAR(255) NOT NULL,
    imgurl LONGTEXT NOT NULL,
    price VARCHAR(255) NOT NULL,
    goodsnumber VARCHAR(255) NOT NULL,
    goodsdescript VARCHAR(255) NOT NULL,
    bussinessname VARCHAR(255) NOT NULL,
    createtime VARCHAR(255) NOT NULL
  );`
let businessUser = `
  create table if not exists businessUser(
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    userName VARCHAR(255) NOT NULL,
    passWord VARCHAR(255) NOT NULL,
    auth VARCHAR(255) NOT NULL,
    phone VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    account_img LONGBLOB NOT NULL,
    createTime VARCHAR(255) NOT NULL);`

let upload = `
  create table if not exists upload(
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    data_source LONGBLOB NOT NULL,
    data_name VARCHAR(255) NOT NULL,
    goods_name VARCHAR(255) NOT NULL,
    goods_price VARCHAR(255) NOT NULL,
    goods_descript VARCHAR(255) NOT NULL,
    goods_area VARCHAR(255) NOT NULL,
    userName VARCHAR(255) NOT NULL,
    account_img LONGTEXT NOT NULL,
    goods_id VARCHAR(255) NOT NULL,
    upload_time TIMESTAMP(4) NOT NULL
  );`
let chat = `
create table if not exists chat(
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  goods_name VARCHAR(255) NOT NULL,
  buyerName VARCHAR(255) NOT NULL,
  bussinessName VARCHAR(255) NOT NULL
);`
let createTable = (sql) => {
  return query(sql, [])
}

// 建表
createTable(buyerUser) // 买家
createTable(cartgoods)
createTable(address)
createTable(paylist)
createTable(upload) // 卖家上传的商品
createTable(businessUser) // 卖家
createTable(chat) // 聊天人
// 注册买家用户
let insertUser = (value) => {
  console.log(value)
  let _sql = `insert into buyerUser set userName=?,passWord=?,auth=?,phone=?,email=?,account_img=?,createTime=?;`
  return query(_sql, value)
}
// 上传买家头像
let uploadBuyerHead = (val) => {
  console.log('val', val.username)
  let _sql = `update buyerUser set account_img=? where userName="${val.username}"`
  return query(_sql, val.data_img)
}
// 买家用户登录
let login = (name) => {
  let _sql = `select * from buyerUser where userName="${name}"`
  return query(_sql)
}

// 查找用户
let findUser = name => {
  let _sql = `select * from buyerUser where userName="${name}"`
  return query(_sql)
}

// 存购物车
let saveCart = obj => {
  let _sql = `insert into cartgoods set goodsid=?,imgurl=?,price=?,goodsnumber=?,goodsdescript=?,bussinessname=?,username=?;`
  return query(_sql, obj)
}
// 更新购物车中的数据(此操作仅在商品相同的情况下执行)
let updateCartGoods = obj => {
  let _sql = `update cartgoods set goodsnumber=? where (goodsid="${obj[1]}" && username="${obj[2]}")`
  return query(_sql, obj)
}
// 取购物车中的数据
let getCartGoods = (da) => {
  let _sql = da.goodsid ? `select * from cartgoods where (goodsid="${da.goodsid}" && username="${da.username}")` :`select * from cartgoods where username="${da.username}"`
  return query(_sql)
}
// 根据多个goodsid 查找购物车数据库中的数据
let getCartFormID = val => {
  let data
  let data1 = []
  let _sql
  val.map(item => {
    data = `${item}`
    data1.push(data)
  })
  _sql = `select * from cartgoods where goodsid in (${data1.join()})`
  return query(_sql)
}
// 从购物车中删除数据
let deleteCartGoods = (val,user) => {
  let data
  let data1 = []
  let _sql
  val.map(item => {
    data = `${item}`
    data1.push(data)
  })
  _sql = `DELETE FROM cartgoods WHERE (goodsid in (${data1.join()}) && username="${user}")`
  return query(_sql)
}
// 存详细地址
let saveAddress = value => {
  let _sql = `insert into address set areaCode=?,addressDetail=?,tel=?,isDefault=?,name=?,postalCode=?,province=?,city=?,county=?,userid=?;`
  return query(_sql, value)
}
let getAddress = value => {
  let _sql = `SELECT * FROM address WHERE userid = ${value};`
  return query(_sql)
}
let payList = value => {
  let data
  let data1 = []
  let _sql
  for (let i in value) {
    data = `('${value[i].goodsid}','${value[i].imgurl}','${value[i].price}','${value[i].goodsnumber}','${value[i].goodsdescript}', '${value[i].bussinessname}', '${value[i].createtime}')`
    data1.push(data)
  }
  _sql = `insert into paylist(goodsid,imgurl,price,goodsnumber,goodsdescript,bussinessname,createtime) VALUES ${data1.join()};`
  console.log(_sql)
  return query(_sql)
}
let getPayList = (user) => {
  let _sql = `select * from paylist where bussinessname = "${user}"`
  return query(_sql)
}
// 根据购买时间统计数量
let echPayList = (username) => {
  let _sql = `select date_format(createtime, '%Y-%m-%d') as time,sum(goodsnumber) 
  from paylist where bussinessname = "${username}"
  GROUP BY date_format(createtime, '%Y-%m-%d');`
  return query(_sql)
}
// 卖家注册
let insertSeller = (value) => {
  let _sql = `insert into businessUser set userName=?,passWord=?,auth=?,phone=?,email=?,account_img=?,createTime=?;`
  return query(_sql, value)
}
// 上传卖家家头像
let uploadSellerHead = (val) => {
  let _sql = `update businessUser set account_img=? where userName="${val.username}";`
  return query(_sql, val.data_img)
}
// 卖家登录
let loginSeller = (name) => {
  let _sql = `select * from businessUser where userName="${name}"`
  return query(_sql)
}

// 查找卖家用户
let findSeller = name => {
  let _sql = `SELECT * FROM businessuser WHERE userName = '${name}';`
  return query(_sql)
}
// 卖家上传图片
let uploadImg = value => {
  let _sql = `insert into upload set data_source=?,data_name=?,goods_name=?,goods_price=?,goods_area=?,goods_descript=?,userName=?,account_img=?,goods_id=?,upload_time=?;`
  return query(_sql, value)
}
let findSellerGoods = _ => {
  let _sql = `SELECT * FROM upload ORDER BY upload_time DESC;`
  return query(_sql)
}
let insertChat = value => {
  let _sql = `insert into chat set goods_name=?,buyerName=?,bussinessName=?;`
  return query(_sql, value)
}
// 查询买家聊天列表
let findChat = value => {
  let _sql = `select * from chat where buyerName="${value.username}"`
  return query(_sql)
}
// 查询商家聊天列表
let findBussinessChat = value => {
  let _sql = `select * from chat where bussinessName="${value.username}"`
  return query(_sql)
}
module.exports = {
  insertUser,
  uploadBuyerHead,
  login,
  findUser,
  saveCart,
  getCartGoods,
  getCartFormID,
  deleteCartGoods,
  updateCartGoods,
  saveAddress,
  getAddress,
  payList,
  getPayList,
  echPayList,
  uploadImg,
  insertSeller,
  uploadSellerHead,
  loginSeller,
  findSeller,
  findSellerGoods,
  insertChat,
  findChat,
  findBussinessChat
}
