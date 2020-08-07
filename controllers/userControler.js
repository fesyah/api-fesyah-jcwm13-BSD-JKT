const { validationResult } = require ('express-validator')
const database = require('../database')
const { generateQuery, asyncQuery } = require('../helpers/queryHelp')
const CryptoJS = require('crypto-js')
const { createToken } = require('../helpers/jwt')

const SECRET_KEY = process.env.SECRET_KEY

module.exports = {
    getUserData : (req, res) => {
        const query = 'select * from users'
        database.query(query, (err, result) => {
            if (err) {
                return res.status(500).send('Internal Server Error')
            }
            res.status(200).send(result)
        })
    },
    login : (req, res) => {
        console.log('body : ', req.body)
        const { username, password } = req.body

        const query = `SELECT * FROM users WHERE username = '${username}'`
        database.query(query, (err, result) => {
            if (err) {
                return res.status(500).send(err)
            }

            const hashpass = CryptoJS.HmacMD5(password, SECRET_KEY)
            if (hashpass.toString() !== result[0].password) {
                return res.status(400).send('invalid password.')
            }

            delete result[0].password

            const token = createToken({ id : result[0].user_id, username : result[0].username })
            console.log('token : ', token)

            result[0].token = token

            res.status(200).send(result[0])
        })
    },
    register : async (req, res) => {
        console.log('body : ', req.body)
        const { username, email, password, confpassword } = req.body

        const errors = validationResult(req)
        console.log(errors)
        if (!errors.isEmpty()) {
            return res.status(422).send(errors.array()[0].msg)
        }
        if (password !== confpassword) {
            return res.status(400).send('password doesn\'t match.')
        }

        try {
            const checkUser = `SELECT * FROM users WHERE username='${username}' OR email='${email}'`
            const user = await asyncQuery(checkUser)

            if (user.length > 0) {
                return res.status(400).send('username or email is already used.')
            }

            const hashpass = CryptoJS.HmacMD5(password, SECRET_KEY)

            const insertUser = `INSERT INTO users (username, password, email, role, status) 
                                        values ('${username}', '${hashpass.toString()}', '${email}', 'user', 0)`
            const newUser = await asyncQuery(insertUser)
            const new_userId = newUser.insertId

            const insertProfile = `INSERT INTO profil (user_id) values (${new_userId})`
            const newProfile = await asyncQuery(insertProfile)

            const token = createToken({ id : new_userId, username : username })


        } catch (err) {
            console.log(err)
            res.status(500).send(err)
        }
    },
    delete : (req, res) => {
        console.log('params : ', req.params)
        console.log('body : ', req.body)
        const id = parseInt(req.params.id)
        const { password } = req.body

        const checkId = `SELECT * FROM users WHERE user_id=${id}`
        database.query(checkId, (err, result) => {
            if (err) {
                return res.status(500).send(err)
            }

            if (result.length === 0) {
                return res.status(200).send(`user with id : ${id} doens't exists.`)
            }

            const hashpass = CryptoJS.HmacMD5(password, SECRET_KEY)
            if (hashpass.toString() !== result[0].password) {
                return res.status(400).send('invalid password.')
            }

            const delAccount = `DELETE FROM users WHERE user_id=${id}`
            database.query(delAccount, (err2, result2) => {
                if (err2) {
                    return res.status(500).send(err2)
                }

                res.status(200).send(result2)
            })
        })
    },
    edit : (req, res) => {
        console.log('params : ', req.params)
        console.log('body : ', req.body)
        const id = parseInt(req.params.id)

        const checkId = `SELECT * FROM users WHERE user_id=${id}`
        database.query(checkId, (err, result) => {
            if (err) {
                return res.status(500).send(err)
            }

            if (result.length === 0) {
                return res.status(200).send(`user with id : ${id} doens't exists.`)
            }

            const editQuery = `UPDATE users SET ${generateQuery(req.body)} WHERE user_id=${id}`
            console.log(editQuery)

            database.query(editQuery, (err2, result2) => {
                if (err2) {
                    return res.status(500).send(err2)
                }

                res.status(200).send(result2)
            })
        })
    },
    editPass : (req, res) => {
        console.log('params : ', req.params)
        console.log('body : ', req.body)
        const id = parseInt(req.params.id)
        const { oldpass, newpass, confpass } = req.body

        if (newpass !== confpass) {
            return res.status(400).send('password doesn\'t match.')
        }

        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(422).send({ errors : errors.array() })
        }

        const checkPass = `SELECT password FROM users WHERE user_id=${id}`
        database.query(checkPass, (err, result) => {
            if (err) {
                return res.status(500).send(err)
            }

            const hasholdpass = CryptoJS.HmacMD5(oldpass, SECRET_KEY)
            if (hasholdpass.toString() !== result[0].password) {
                return res.status(400).send('invalid password.')
            }

            const hashpass = CryptoJS.HmacMD5(newpass, SECRET_KEY)
            const updatePass = `UPDATE users SET password='${hashpass}' WHERE user_id=${id}`
            database.query(updatePass, (err2, result2) => {
                if (err2) {
                    res.status(500).send(err2)
                }

                res.status(200).send(result2)
            })
        })

    },
    keeplogin : async (req, res) => {
        console.log('user : ', req.user)
        try {

            const query = `SELECT user_id, username, email, role 
                        FROM users 
                        WHERE user_id=${req.user.id} AND username='${req.user.username}'`
            const result = await asyncQuery(query)

            res.status(200).send(result[0])
        } catch (err) {
            res.status(500).send(err)
        }
    },
    emailverification : async (req, res) => {
        console.log('user : ', req.user)
        try {

            const query = `UPDATE users SET status = 1 WHERE user_id = ${req.user.id} AND username = '${req.user.username}'`
            const result = await asyncQuery(query)
            console.log(result)

            res.status(200).send('email has been verified.')
        } catch (err) {
            console.log(err)
            res.status(500).send(err)
        }
    }
}