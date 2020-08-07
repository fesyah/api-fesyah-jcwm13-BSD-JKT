const database = require('../database')
const { generateQuery } = require('../helpers/queryHelp')

module.exports = {
    getCategory : (req, res) => {
        const query = `SELECT * FROM kategori`
        database.query(query, (err, result) => {
            if (err) {
                return res.status(500).send(err)
            }

            res.status(200).send(result)
        })
    },
    addCategory : (req, res) => {
        console.log('body : ', req.body)
        const { kategori } = req.body

        const parentId = req.body.parentId ? req.body.parentId : null

        const query = `INSERT INTO kategori (kategori, parent_id) 
                    VALUES (${database.escape(kategori)}, ${database.escape(parentId)})`
        database.query(query, (err, result) => {
            if (err) {
                return res.status(500).send(err)
            }

            res.status(200).send(result)
        })
    },
    getCategoryDetails : (req, res) => {
        const query = `SELECT c2.id, c2.kategori, c1.kategori as parent 
                    FROM kategori c1
                    RIGHT JOIN kategori c2 ON c1.id = c2.parent_id`
        database.query(query, (err, result) => {
            if (err) {
                return res.status(500).send(err)
            }

            res.status(200).send(result)
        })
    },
    getCategoryDetailsById : (req, res) => {
        const id = parseInt(req.params.id)
        const query = `SELECT c1.id, c1.kategori, c2.kategori as child 
                    FROM kategori c1
                    JOIN kategori c2
                    ON c1.id = c2.parent_id
                    WHERE c1.id = ${id}`
        database.query(query, (err, result) => {
            if (err) {
                return res.status(500).send(err)
            }

            res.status(200).send(result)
        })
    },
    delete : (req, res) => {
        const id = parseInt(req.params.id)
        
        const del = `DELETE FROM kategori WHERE id = ${id}`
        database.query(del, (err, result) => {
            if (err) {
                return res.status(500).send(err)
            }

            res.status(200).send(result)
        })
    },
    getCategoryByQuery : (req, res) => {
        console.log('query : ', req.query)
        const { category, child } = req.query

        const query = `SELECT c1.id, c1.kategori, c2.kategori as child, c2.id as child_id
                    FROM kategori c1
                    JOIN ckategori c2
                    ON c1.id = c2.parent_id
                    HAVING c1.kategori = ${database.escape(kategori)} OR c1.id = ${database.escape(child)}`
        console.log(query)
        database.query(query, (err, result) => {
            if(err) {
                res.status(500).send(err)
            }

            res.status(200).send(result)
        })
    },
    getLeafNodes : (req, res) => {
        const query = `SELECT c1.id, c1.kategori FROM kategori c1
                    LEFT JOIN kategori c2 ON c1.id = c2.parent_id
                    WHERE c2.id IS NULL`
        database.query(query, (err, result) => {
            if (err) {
                return res.status(500).send(err)
            }

            res.status(200).send(result)
        })
    },
    editCategory : (req, res) => {
        const id = parseInt(req.params.id)

        const edit = `UPDATE kategori SET ${generateQuery(req.body)} WHERE id = ${id}`
        console.log(edit)
        database.query(edit, (err, result) => {
            if (err) {
                return res.status(500).send(err)
            }

            res.status(200).send(result)
        })
    }
}