// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;
import "./FiDispute.sol";

contract FiDisputeManager {

    event NewOpenDispute(address indexed disputeAddress);

    event NewCompleteDispute(
        address indexed disputeAddress, 
        address initiator,
        address challenger, 
        address judge
    );

    function registerDisputeIntention(bytes32 disputeHash) public payable {
        FiDispute dispute = new FiDispute(msg.sender, disputeHash, msg.value);
        payable(address(dispute)).transfer(msg.value);
        emit NewOpenDispute(address(dispute));
    }

}