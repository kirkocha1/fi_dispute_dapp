// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

contract FiDispute {
    address[] parties;
    uint256 deposit;
    address judge;
    bool pendingWinner = false;
    bool isFinished = false;
    mapping(address => address[]) approves;
    bytes32 disputeDescriptionHash;

    event JudgeApproval(address judge);

    event ChosenJudge(address judge);

    event Winner(address winner);
    constructor(address _initiatorParty, bytes32 _disputeDescriptionHash, uint256 initiatorStake) {
        parties.push(_initiatorParty);
        disputeDescriptionHash = _disputeDescriptionHash;
        deposit += initiatorStake;
    }

    modifier onlyParties(address caller) {
        requreNotParty(caller);
        _;
    }

    function acceptDispute() public payable onlyParties(msg.sender) {
        parties.push(msg.sender);
        deposit += msg.value;
    }

    function offerJudge(address _judge) public payable onlyParties(msg.sender) {
        require(!isParty(_judge), "judge should not be the same as involved parties");
        emit JudgeApproval(_judge);
    }

    function assignJudge(address _judge) public onlyParties(msg.sender) {
        for (uint256 index = 0; index < approves[_judge].length; index++) {
            require(msg.sender != approves[_judge][index], "user already approved given judge");    
        }
        approves[_judge].push(msg.sender);
        if (approves[_judge].length == parties.length) {
            judge = _judge;
            pendingWinner = true;
            emit ChosenJudge(judge);
        }
    }

    function chooseWinner(address winner) public onlyParties(winner) {
        require(msg.sender == judge, "only judge can make this decision");
        require(!isFinished, "this dispute is already resolved");
        isFinished = true;
        emit Winner(winner);
        payable(winner).transfer(deposit);
    }

    function requreNotParty(address candidate) private view {
        for (uint256 index = 0; index < parties.length; index++) {
            require(candidate != parties[index], "challenger can't be the same as dispute initiator");    
        }
    }

    function isParty(address candidate) private view returns(bool) {
        for (uint256 index = 0; index < parties.length; index++) {
            if (candidate == parties[index]) {
                return true;
            }
        }
        return false;
    }
}