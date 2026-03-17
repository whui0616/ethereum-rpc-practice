require('dotenv').config();
const { ethers } = require('ethers');

// .env 파일에서 가져온 정보
const INFURA_API_KEY = process.env.INFURA_API_KEY;
// 전송 실습을 할 경우 .env에 PRIVATE_KEY=내_개인키 가 있어야 해!
const PRIVATE_KEY = process.env.PRIVATE_KEY; 

const provider = new ethers.JsonRpcProvider(`https://mainnet.infura.io/v3/${INFURA_API_KEY}`);

// WETH 컨트랙트 주소 및 ABI
const WETH_ADDRESS = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
const WETH_ABI = [
    "function name() view returns (string)",
    "function symbol() view returns (string)",
    "function totalSupply() view returns (uint256)",
    "function balanceOf(address) view returns (uint256)",
    "function transfer(address to, uint256 amount) returns (bool)"
];

async function main() {
    // 컨트랙트 객체 생성 (읽기용)
    const contract = new ethers.Contract(WETH_ADDRESS, WETH_ABI, provider);

    try {
        console.log("--- [Assignment #1] 컨트랙트 정보 ---");
        const name = await contract.name();
        const symbol = await contract.symbol();
        const totalSupply = await contract.totalSupply();
        console.log(`Name: ${name}`);
        console.log(`Symbol: ${symbol}`);
        console.log(`Total Supply: ${ethers.formatUnits(totalSupply, 18)} ${symbol}`);

        console.log("\n--- [Assignment #2 & #3] 잔액 조회 ---");
        // 체크섬 에러 방지를 위해 getAddress 사용
        // index.js 파일에서 이 부분을 찾아 아래 한 줄로 바꿔줘!
        const targetAddress = "0xf0d4c12a5768d806021f803d3280d3c4ab155d25";
        const balance = await contract.balanceOf(targetAddress);
        console.log(`Address: ${targetAddress}`);
        console.log(`Balance: ${ethers.formatEther(balance)} WETH`);

        /* // 만약 2인 1조 전송 실습을 한다면 아래 주석을 풀고 사용해!
        // 전송을 위해선 Signer(지갑)가 필요해.
        if (PRIVATE_KEY) {
            const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
            const contractWithSigner = contract.connect(wallet);
            console.log("\n--- [Write 실습] 전송 시도 ---");
            // 예: 친구 주소로 0.01 WETH 전송
            // const tx = await contractWithSigner.transfer("친구_지갑_주소", ethers.parseEther("0.01"));
            // await tx.wait();
            // console.log("전송 완료!");
        }
        */

    } catch (error) {
        console.error("실행 중 에러 발생:", error.message);
    }
}

main();