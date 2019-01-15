pragma solidity >=0.4.21 <0.6.0;

contract DappToken {
    // Name
    string public name = "TFC Token";
    // Symbol
    string public symbol = "TFC";
    // Standard
    string public standard = "TFC Token v1.0";
    // Total number of tokens
    uint256 public totalSupply;
    // Balance of token owners
    mapping (address => uint256) public balanceOf;
    // Allowances
    mapping (address => mapping(address => uint256)) public allowance;

    event Transfer(address indexed _from, address indexed _to, uint256 _value);

    event Approval(address indexed _owner, address indexed _spender, uint256 _value);
    
    // Constructor
    constructor (uint256 _initialSupply) public {
        balanceOf[msg.sender] = _initialSupply;
        totalSupply = _initialSupply;
    }

    // Transfer
    function transfer(address _to, uint256 _value) public returns (bool success) {
        require(balanceOf[msg.sender] >= _value);
        // Transfer the balance
        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;
        // Emit transfer event
        emit Transfer(msg.sender, _to, _value);
        // return success
        return true;
    }

    // Approve
    function approve(address _spender, uint256 _value) public returns (bool success) {
        // Set spender allowance
        allowance[msg.sender][_spender] = _value;
        // Emit approval event
        emit Approval(msg.sender, _spender, _value);
        // return success
        return true;
    }

    // Transfer from
    function transferFrom(address _from, address _to, uint256 _value) public returns (bool success) {
        // Require spender has enough allowance
        require(allowance[_from][msg.sender] >= _value);
        // Require _from has enough tokens
        require(balanceOf[_from] >= _value);
        // Update balances
        balanceOf[_from] -= _value;
        balanceOf[_to] += _value;
        // Update spender allowance
        allowance[_from][msg.sender] -= _value;
        // Emit transfer event
        emit Transfer(_from, _to, _value);
        // return success
        return true;
    }
}
