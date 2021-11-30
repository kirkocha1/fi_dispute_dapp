class DisputeRepository {
    constructor(dao) {
        this.dao = dao
    }

    createTable() {
        const sql = `CREATE TABLE IF NOT EXISTS disputes (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          address text,
          hash text, 
          initiator text,
          challenger text,
          judge text,
          winner text,
          is_finished bool,
          created_date text,
          updated_date text
          )`
        return this.dao.run(sql)
    }

    getAll() {
        return this.dao.all(`SELECT * FROM disputes`)
    }

    insert(address, hash, initiator) {
        const date = new Date().toString()
        return this.dao.run('INSERT INTO disputes (address ,hash, initiator, is_finished ,created_date, updated_date) VALUES (?, ?,?,?,?,?)', [address, hash, initiator, false, date, date])
    }

    update(address, fields) {
        const date = new Date().toString()
        let sqlFields = []
        fields.forEach(field => {
            sqlFields.push(`${field.name}=?`)
        });
        return this.dao.run(`UPDATE disputes SET ${sqlFields.join(",")}, updated_date=? WHERE address=?`, [...fields.map(field => field.value), date, address])
    }
}

module.exports = DisputeRepository;