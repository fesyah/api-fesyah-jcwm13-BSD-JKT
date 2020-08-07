const { generateQuery, asyncQuery } = require('../helpers/queryHelp')


module.exports = {
    getProducts : async (req, res) => {
        const getData = 'SELECT * FROM produk'
        try {
            const result = await asyncQuery(getData)
            res.status(200).send(result)
        } catch (err) {
            res.status(500).send(err)
        }
    },
    getProductById : async (req, res) => {
        const getDataById = `SELECT * FROM produk WHERE id=${parseInt(req.params.id)}`
        try {
            const result = await asyncQuery(getDataById)
            res.status(200).send(result[0])
        } catch (err) {
            res.status(500).send(err)
        }
    },
    editProduct : async (req, res) => {
        const id = parseInt(req.params.id)
        try {
            const checkProduct = `SELECT * FROM produk WHERE id=${id}`
            const check = await asyncQuery(checkProduct)
            if (check.length === 0) return res.status(400).send('product doesn\'t exist.')

            const edit = `UPDATE produk SET ${generateQuery(req.body)} WHERE id=${id}`
            const result =  await asyncQuery(edit)

            res.status(200).send(result)

        } catch (err) {
            res.status(500).send(err)
        }
    },
    delete : async (req, res) => {
        const id = parseInt(req.params.id)
        try {
            const checkProduct = `SELECT * FROM produk WHERE id=${id}`
            const check = await asyncQuery(checkProduct)
            if (check.length === 0) return res.status(400).send('product doesn\'t exist.')

            const del = `DELETE FROM produk WHERE id=${id}`
            const result = await asyncQuery(del)

            res.status(200).send(result)
        } catch (err) {
            res.status(500).send(err)
        }
    },
    add : async (req, res) => {
        console.log('body : ', req.body)
        const { name, price, stock } = req.body
        try {
            const insert = `INSERT INTO produk (nama_produk, harga, stok)
                            VALUES ('${name}', ${price}, ${stock})` 
            const result =  await asyncQuery(insert)

            res.status(200).send(result)
        } catch (err) {
            res.status(500).send(err)
        }
    }
}