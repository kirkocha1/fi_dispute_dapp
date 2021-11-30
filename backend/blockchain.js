const FiDispute = require(process.env.CONTRACT_PATH + "/FiDispute.json")
const FiDisputeManager = require(process.env.CONTRACT_PATH + "/FiDisputeManager.json")

async function blockchainListener(web3, disputeRepository) {
    let networkId = await web3.eth.net.getId()
    console.log(networkId)
    let disputeManger = new web3.eth.Contract(
        FiDisputeManager.abi,
        FiDisputeManager.networks[networkId] && FiDisputeManager.networks[networkId].address
    )


    disputeManger.events.NewOpenDispute()
        .on('data', async function (event) {
            await disputeRepository.insert(event.returnValues.disputeAddress, event.returnValues.disputeHash, event.returnValues['2'])
            subscribeToDisputeEvents(event.returnValues.disputeAddress, web3, disputeRepository)
        })
        .on('error', console.error)

    disputeManger.events.FiDisputeAccepted()
        .on('data', async function (event) {
            console.log(event)
            await disputeRepository.update(event.returnValues['0'], [{ name: "challenger", value: event.returnValues['1'] }])
        })
        .on('error', console.error)

}

async function subscribeToDisputeEvents(address, web3, disputeRepository) {
    let dispute = new web3.eth.Contract(FiDispute.abi, address)
    dispute.events.ChosenJudge()
        .once('data', async function (event) {
            await disputeRepository.update(event.returnValues['0'], [{ name: "judge", value: event.returnValues['1'] }])
        })
        .once('error', console.error)

    dispute.events.Winner()
        .once('data', async function (event) {
            await disputeRepository.update(event.returnValues['0'], [{ name: "winner", value: event.returnValues['1'] }, { name: "is_finished", value: true }])
        })
        .once('error', console.error)
}

module.exports = blockchainListener
