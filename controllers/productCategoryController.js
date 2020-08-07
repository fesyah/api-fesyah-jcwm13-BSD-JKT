const { asyncQuery } = require('../helpers/queryHelp')

module.exports = {
    getProductCategory : async (req, res) => {
        const get = 'SELECT * FROM pro_kat'
        try {
            const result = await asyncQuery(get)
            res.status(200).send(result)
        } catch (err) {
            res.status(500).send(err)
        }
    },
    getProductCategoryDetails : async (req, res) => {
        try {
            const get = `SELECT * FROM pro_kat_details`
            const result = await asyncQuery(get)

            res.status(200).send(result)
        } catch (err) {
            res.status(500).send(err)
        }
    },
    addProductCategory : async (req, res) => {
        console.log('body : ', req.body)
        const { produk_id, kategori_id } = req.body
        try {
            const getCategoryId = `WITH RECURSIVE kategori_path (id, kategori, parent_id) AS
                                (
                                    SELECT id, kategori, parent_id
                                        FROM kategori
                                        WHERE id = ${kategori_id} -- child node
                                    UNION ALL
                                    SELECT c.id, c.kategori, c.parent_id
                                        FROM kategori_path AS cp JOIN kategori AS c
                                        ON cp.parent_id = c.id
                                )
                                SELECT id FROM kategori_path;`
            const categoryId = await asyncQuery(getCategoryId)

            // insert query
            let value = ''
            categoryId.forEach(item => value += `(${produk_id}, ${item.id}),`)
            const insertQuery = `INSERT INTO produk_kategori (produk_id, kategori_id)
                                VALUES ${value.slice(0, -1)}`
            console.log(insertQuery)
            const result = await asyncQuery(insertQuery)

            // sent response to client
            res.status(200).send(result)
        } catch (err) {
            console.log(err)
            res.status(500).send(err)
        }
    },
    delete : async (req, res) => {
        console.log('params : ', req.params)
        const id = parseInt(req.params.id)

        try {
            const del = `DELETE FROM produk_kategori WHERE produk_id = ${id}`
            const result = await asyncQuery(del)

            res.status(200).send(result)

        } catch (err) {
            console.log(err)
            res.status(500).send(err)
        }
    }
}