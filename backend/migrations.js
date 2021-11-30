async function migrate(disputeRepository) {
    try {
        await disputeRepository.createTable()
        await disputeRepository.insert("test_hash", "0x2e48ce9B68bAAaA5e33D0a9B9B6782ecbC9FA6d1")
    } catch(error) {
        console.log(`migrations were not successful ${error}`)
    }
    
}

module.exports = migrate