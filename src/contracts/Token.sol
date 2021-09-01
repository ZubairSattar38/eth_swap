pragma solidity >=0.4.21 <0.6.0;

contract Token{
    string public name = "DApp Token";
    string public symbol = "DApp";
    uint256 public totalSupply = 1000000000000000000000000;         //          1 million tokens
    uint8 public decimals = 18;

    event  Transfer(
        address indexed _from,
        address indexed _to,
        uint256 value
    );

    event Approval(
        address indexed _owner,
        address indexed _spender,
        uint256 _value
    );
    mapping(address => uint256) public balanceOf;   // its tell us how many tokens u have
    mapping(address => mapping(address=>uint256)) public allowance;

    constructor() public {
        balanceOf[msg.sender] = totalSupply;
    }
    function transfer(address _to,uint256 _value) public returns(bool success){
        require(balanceOf[msg.sender] >= _value);
        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;
        emit Transfer(msg.sender, _to, _value);
        return true;
    }   
    function approve(address _spender,uint256 _value) public returns(bool success){  // someone else send you token
        allowance[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }

    function transferFrom(address _from,address _to,uint256 _value)public returns(bool success){
        require(_value <= balanceOf[_from]);
        require(_value <= allowance[_from][msg.sender]);
        balanceOf[_from] -= _value;
        balanceOf[_to]  += _value;
        allowance[_from][msg.sender] -= _value;
        emit Transfer(_from, _to, _value);
        return true;
    }

}