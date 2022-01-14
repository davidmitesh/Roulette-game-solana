const fs = require('fs')

const {
    Connection,
    PublicKey,
    clusterApiUrl,
    Keypair,
    LAMPORTS_PER_SOL,
    Transaction,
    SystemProgram,
    Account,
    sendAndConfirmTransaction
   } = require("@solana/web3.js");
let newPair;
const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
let secretKey;
const path = "./secret.txt";
let myWallet;

if (fs.existsSync(path)) {

   secretKey =  fs.readFileSync('./secret.txt')
   myWallet =  Keypair.fromSecretKey(secretKey);
    
} else {
    newPair = new Keypair(); // This class allows us to create a new wallet
   

    secretKey = newPair._keypair.secretKey
    myWallet =  Keypair.fromSecretKey(secretKey);
    fs.writeFile('./secret.txt', secretKey, (err) => {
        console.log("New wallet key created at secret.txt")
        // In case of a error throw err.
        if (err) throw err;
    })
}
let publicKey = new PublicKey(myWallet.publicKey)

//function to check the wallet balance
const getWalletBalance = async (publicKey) => {
    try {
        
        

        const walletBalance = await connection.getBalance(
            new PublicKey(publicKey)
        );
        // console.log(`Wallet balance: ${walletBalance}`);

        // console.log(`=> For wallet address ${publicKey}`);
        // console.log(`   Wallet balance: ${parseInt(walletBalance)/LAMPORTS_PER_SOL}SOL`);
        return parseInt(walletBalance)/LAMPORTS_PER_SOL
    } catch (err) {
        console.log(err);
    }
};

//function to airdrop some sol in the wallet
const airDropSol = async (secretKey,transferAmount) => {
    try {
        
        const walletKeyPair = await Keypair.fromSecretKey(secretKey);
        // await getWalletBalance()
        console.log(`-- Airdropping ${transferAmount}SOL --`)
        const fromAirDropSignature = await connection.requestAirdrop(
            new PublicKey(walletKeyPair.publicKey),
            transferAmount * LAMPORTS_PER_SOL
        );
        await connection.confirmTransaction(fromAirDropSignature);
        console.log(`-- Successfully airdropped ${transferAmount}SOL  --`)
        // await getWalletBalance()
    } catch (err) {
        console.log(err);
    }
};


const transferSOL=async (from,to,transferAmt)=>{
    try{
        
        const transaction=new Transaction().add(
            SystemProgram.transfer({
                fromPubkey:new PublicKey(from.publicKey.toString()),
                toPubkey:new PublicKey(to.publicKey.toString()),
                lamports:transferAmt*LAMPORTS_PER_SOL
            })
        )
        const signature=await sendAndConfirmTransaction(
            connection,
            transaction,
            [from]
        )
        return signature;
    }catch(err){
        console.log(err);
    }
}

module.exports = {
    secretKey,
    publicKey,
    myWallet,
    connection,
    getWalletBalance,
    airDropSol,
    transferSOL
}



