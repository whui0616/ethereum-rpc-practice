// SPDX-License-Identifier: MIT



pragma solidity ^0.8.0;

// ERC-20 토큰과 상호작용하기 위한 기본 인터페이스 정의
interface IERC20 {
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    function transfer(address recipient, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool); // <- 드디어 추가된 핵심 한 줄!
}

contract SimpleStaking {
    IERC20 public stakingToken;
    mapping(address => uint256) public balances;
    uint256 public totalStaked;

    // 생성자: 배포할 때 사용할 ERC-20 토큰의 주소를 입력받습니다.
    constructor(address _stakingToken) {
        stakingToken = IERC20(_stakingToken);
    }

    // 1. 토큰 예치 (Stake)
    function stake(uint256 _amount) external {
        require(_amount > 0, "Amount must be greater than 0");
        
        // 유저의 지갑에서 이 컨트랙트로 토큰을 전송합니다. (미리 approve를 해둬야 작동함)
        require(stakingToken.transferFrom(msg.sender, address(this), _amount), "Stake transfer failed");

        balances[msg.sender] += _amount;
        totalStaked += _amount;
    }

    // 2. 토큰 출금 (Withdraw)
    function withdraw(uint256 _amount) external {
        require(_amount > 0, "Amount must be greater than 0");
        require(balances[msg.sender] >= _amount, "Insufficient staked balance");

        balances[msg.sender] -= _amount;
        totalStaked -= _amount;

        // 컨트랙트에서 유저의 지갑으로 토큰을 돌려줍니다.
        require(stakingToken.transfer(msg.sender, _amount), "Withdraw transfer failed");
    }

    // 3. 내 예치 잔액 확인 (Check Staked Balance)
    function getStakedBalance() external view returns (uint256) {
        return balances[msg.sender];
    }
}