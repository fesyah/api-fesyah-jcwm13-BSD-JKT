const jwt = require('jsonwebtoken')
const TOKEN_KEY = process.env.TOKEN_KEY

module.exports = {
    createToken : (data) => {
        return jwt.sign(data, TOKEN_KEY, { expiresIn : '1hr' })
    },
    // verify token as middleware
    verify : (req, res, next) => {
        const token = req.body.token

        // check token
        if (!token) {
            return res.status(400).send('no token.')
        }

        try {
            // verify token
            const result = jwt.verify(token, TOKEN_KEY)
            
            // add token data to req
            req.user = result

            // next
            next()

        } catch (err) {
            console.log(err)
            res.status(500).send(err)
        }
    }
}