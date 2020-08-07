const { asyncQuery, generateQuery } = require('../helpers/queryHelp')

module.exports = {
    getProfile : async (req, res) => {
        const id = parseInt(req.params.id)
        try {
            const query = `SELECT * FROM profil WHERE user_id = ${id}`
            const result = await asyncQuery(query)

            res.status(200).send(result[0])
        } catch (err) {
            console.log(err)
            res.status(500).send(err)
        }
    },
    editProfile : async (req, res) => {
        const id = parseInt(req.params.id)
        try {
            const checkUser = `SELECT * FROM profil WHERE user_id = ${id}`
            const user = await asyncQuery(checkUser)

            if (user.length === 0) {
                return res.status(400).send('user doesn\'t exist.')
            }

            // edit
            const edit = `UPDATE profil SET ${generateQuery(req.body)} WHERE user_id = ${id}`
            const info = await asyncQuery(edit)

            res.status(200).send(info)
        } catch (err) {
            console.log(err)
            res.status(500).send(err)
        }
    }
}