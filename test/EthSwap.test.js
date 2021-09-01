const Token = artifacts.require('Token');
const EthSwap = artifacts.require('EthSwap');

require('chai').use(require('chai-as-promised')).should()


function tokens(n) {
    //   basically it convert into human readable form
    return web3.utils.toWei(n,'ether');
}
contract('EthSwap',([deployer,investor])=>{  // actualy deployer and investor is a account 0 and 1
    let token,ethSwap;
    before(async ()=>{
         token = await Token.new();
         ethSwap = await EthSwap.new(token.address);

         console.log('token :- ',tokens('1000000'));
        // Transfer All token to EthSwap
        await token.transfer(ethSwap.address,tokens('1000000'));
    })
    describe('Token deployment',async ()=>{
        it('contract has a name' , async ()=>{
            const name = await token.name();
            assert.equal(name,'DApp Token');
        })
    })
    describe('EthSwap deployment',async ()=>{
        it('contract has a name' , async ()=>{
            const name = await ethSwap.name();
            assert.equal(name,"EthSwap Instant Exchange")
        })
    
        it('contract has tokens', async ()=>{
            let balance = await token.balanceOf(ethSwap.address);
            assert.equal(balance.toString(),tokens('1000000'));
        })
    })

    describe('Buy Tokens()',async ()=>{
        let result;
        before(async()=>{
            //  Purchase tokens before each example
            // 1 ether is equal to 1000000000000000000
            await ethSwap.buyTokens({from:investor,value:web3.utils.toWei('1','ether')})
        })
        it('Allows User to instantly purchase tokens from ethswap for a fixed price',async ()=>{
            // Check Investor token Balance after purchase
            let investorBalance = await token.balanceOf(investor);
            console.log('Investor Balance ',investorBalance.toString(),' tokens ',tokens('100'));
            assert.equal(investorBalance.toString(),tokens('100'))

            //  Check ethSwap token Balance after purchase
            let ethSwapBalance  = await token.balanceOf(ethSwap.address);
            assert.equal(ethSwapBalance.toString(),tokens('999900'));

            //  Check ethSwap ether Balance
            ethSwapBalance = await web3.eth.getBalance(ethSwap.address)
            console.log("EthSwap Balance ",ethSwapBalance.toString(), ' web3.utils.toWei ',web3.utils.toWei('1','Ether'))
            assert.equal(ethSwapBalance.toString(),web3.utils.toWei('1','Ether'));

            // const event  = result.logs[0].args;
            // assert.equal(event.account,investor);
            // assert.equal(event.token,token.address);
            // assert.equal(event.amount.toString(),tokens('100').toString(),);
            // assert.equal(event.rate.toString(),'100')
        })
    })

    describe('sellTokens()',async ()=>{
        let result;

        before(async ()=>{
            //  Investors Must approve the tokens before the purchase
            await token.approve(ethSwap.address, tokens('100'),{ from: investor })  // approve function must be called before transferform called
            //  Investor Sells token
            result =  await ethSwap.sellTokens(tokens('100'),{ from: investor });

        })
        it('Allow user to instantly sell tokens to ethswap for a fixed price',async ()=>{
            let investorBalance = await token.balanceOf(investor);
            assert.equal(investorBalance.toString(),tokens('0'));

             //  Check ethSwap token Balance after purchase
             let ethSwapBalance  = await token.balanceOf(ethSwap.address);
             assert.equal(ethSwapBalance.toString(),tokens('1000000'));
 
             //  Check ethSwap ether Balance
             ethSwapBalance = await web3.eth.getBalance(ethSwap.address)
             assert.equal(ethSwapBalance.toString(),web3.utils.toWei('0','Ether'));

             const event  = result.logs[0].args;
             assert.equal(event.account,investor);
             assert.equal(event.token,token.address);
             assert.equal(event.amount.toString(),tokens('100').toString(),);
             assert.equal(event.rate.toString(),'100')
        })
    })
})
