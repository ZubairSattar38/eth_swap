pragma solidity >=0.4.21 <0.6.0;
import './Token.sol';
contract EthSwap{
    string public name = "EthSwap Instant Exchange";
    Token public token;
    uint public rate = 100;
    constructor(Token _token) public {
        token = _token;
    }

    event TokensPurchased(
        address account,
        address token,
        uint amount,
        uint rate
    );

     event TokenSold(
        address account,
        address token,
        uint amount,
        uint rate
    );

    // Payable allow us to send ethereum 
    function buyTokens() public payable{   
        //  redemption rate = number of tokens they receive from 1 ether
        //  Amount of ethereum * redemption rate


        //  Calculate the Number of tokens to buy
        uint tokenAmount = msg.value * rate;   // msg.value is the ethereum amount

        require(token.balanceOf(address(this)) >= tokenAmount);
        // we transfer the token who call the function
        // the person who call the function he send the ether and we trnasfer the token in return
        token.transfer(msg.sender, tokenAmount);

        emit TokensPurchased(msg.sender, address(token), tokenAmount, rate);
    }

    function sellTokens(uint _amount) public {
        //  User cannot sell more tokens then they have
        require(token.balanceOf(msg.sender) >= _amount);

        // Calculate the amount of ether to redem
        uint etherAmount = _amount/rate; 

        //  Require that etherswap has enough ether
        require(address(this).balance >= etherAmount);

        // Perform Sale
        token.transferFrom(msg.sender, address(this), _amount);// it send the token to smart contract

        msg.sender.transfer(etherAmount);
        emit TokenSold(msg.sender, address(token), _amount,rate);

    }
}