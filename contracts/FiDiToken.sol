// SPDX-License-Identifier: MIT
pragma solidity 0.8.10;

import "@openzeppelin/contracts/token/ERC20/presets/ERC20PresetMinterPauser.sol";


contract FiDiToken is ERC20PresetMinterPauser("FiDiToken for dispute registering", "FIDI") {

    function grantRole(bytes32 role, address account) public virtual override {
        super.grantRole(role, account);
    }
}