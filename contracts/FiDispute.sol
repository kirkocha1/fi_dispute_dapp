// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

import "./FiDiToken.sol";
import "./FiDisputeManager.sol";
import "@openzeppelin/contracts/utils/Context.sol";

contract FiDispute is Context {
    FiDiToken fiDiToken;
    address fiDiManager;
    address[] parties;
    uint256 participationStake;
    uint256 deposit;
    address judge;
    bool pendingWinner = false;
    bool isFinished = false;
    mapping(address => address[]) approves;
    bytes32 disputeDescriptionHash;

    event JudgeApproval(address judge);

    event ChosenJudge(address judge);

    event Winner(address winner);
    constructor(address _fiDiManager, FiDiToken _fiDiToken, address _initiatorParty, bytes32 _disputeDescriptionHash, uint256 initiatorStake) {
        fiDiManager = _fiDiManager;
        fiDiToken = _fiDiToken;
        parties.push(_initiatorParty);
        disputeDescriptionHash = _disputeDescriptionHash;
        participationStake = initiatorStake;
        deposit += initiatorStake;
    }

    modifier onlyParties(address caller) {
        requreNotParty(caller);
        _;
    }

    function acceptDispute(uint256 challengerStake) public {
        require(_msgSender() == fiDiManager, "only manager contract is allowed to interact with this method");
        parties.push(_msgSender());
        deposit += challengerStake;
    }   

    function offerJudge(address _judge) public payable onlyParties(_msgSender()) {
        require(!isParty(_judge), "judge should not be the same as involved parties");
        emit JudgeApproval(_judge);
    }

    function assignJudge(address _judge) public onlyParties(_msgSender()) {
        for (uint256 index = 0; index < approves[_judge].length; index++) {
            require(_msgSender() != approves[_judge][index], "user already approved given judge");    
        }
        approves[_judge].push(_msgSender());
        if (approves[_judge].length == parties.length) {
            judge = _judge;
            pendingWinner = true;
            emit ChosenJudge(judge);
        }
    }

    function chooseWinner(address winner) public onlyParties(winner) {
        require(_msgSender() == judge, "only judge can make this decision");
        require(!isFinished, "this dispute is already resolved");
        isFinished = true;
        emit Winner(winner);
        fiDiToken.transfer(winner, deposit);
    }

    function getParticipationStake() public view returns(uint256) {
        return participationStake;
    }

    function getDeposit() public view returns(uint256) {
        return deposit;
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