// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

import "./FiDispute.sol";
import "./FiDiToken.sol";
import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract FiDisputeManager is Context {

    FiDiToken token;

    mapping(bytes32 => address) disputes; 

    event NewOpenDispute(address indexed disputeAddress);

    event NewCompleteDispute(
        address indexed disputeAddress, 
        address initiator,
        address challenger, 
        address judge
    );

    event FiDiTokenExchange(address buyer);

    event FiDiTokenRefund(address buyer);
    constructor(FiDiToken _token) {
        token = _token;
    }

    receive() payable external {
        _obtainDisputeTokens();
    }

    function registerDisputeIntention(bytes32 disputeHash, uint256 stakeTokenAmount) public returns(address) {
        require(token.balanceOf(_msgSender()) >= stakeTokenAmount, "not enough tokens");
        FiDispute dispute = new FiDispute(address(this) ,token, _msgSender(), disputeHash, stakeTokenAmount);
        disputes[disputeHash] = address(dispute);
        token.transferFrom(
            _msgSender(),
            dispute,
            FiDispute(disputeInstance).getParticipationStake()
        );
        emit NewOpenDispute(address(dispute));
        return address(dispute);
    }

    function acceptDispute(address dispute) public {
        FiDispute disputeInstance = FiDispute(dispute);
        require(
            token.balanceOf(_msgSender()) >= disputeInstance.getParticipationStake(),
            "no enough token to participate"
        );
        disputeInstance.acceptDispute(disputeInstance.getParticipationStake());
        token.transferFrom(
            _msgSender(),
            dispute,
            FiDispute(disputeInstance).getParticipationStake()
        );
    }

    function refund(uint256 refundAmount) public payable {
        require(token.balanceOf(_msgSender()) >= refundAmount, "not enough token");
        token.burnFrom(_msgSender(), refundAmount);
        payable(_msgSender()).transfer(refundAmount);
        emit FiDiTokenRefund(_msgSender());
    }

    function getTokenAddress() public view returns(address) {
        return address(token);
    }

    function _obtainDisputeTokens() private {
        token.mint(_msgSender(), msg.value);
        emit FiDiTokenExchange(_msgSender());
    }

}