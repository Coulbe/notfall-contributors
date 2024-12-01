// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract NotcoinGovernance {
    address public owner;
    uint256 public totalSupply = 20000000 ether;
    uint256 public governanceReserve = totalSupply * 51 / 100;
    mapping(address => uint256) public balances;
    mapping(address => bool) public validators;
    mapping(bytes32 => Proposal) public proposals;

    uint256 public proposalCount;

    struct Proposal {
        string description;
        uint256 votesFor;
        uint256 votesAgainst;
        uint256 createdAt;
        address proposer;
        bool executed;
    }

    event ProposalCreated(bytes32 proposalId, string description, address proposer);
    event Voted(bytes32 proposalId, address voter, bool support);
    event ProposalExecuted(bytes32 proposalId);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }

    modifier onlyValidator() {
        require(validators[msg.sender], "Not a validator");
        _;
    }

    constructor() {
        owner = msg.sender;
        validators[msg.sender] = true;
        balances[owner] = governanceReserve;
    }

    function addValidator(address _validator) external onlyOwner {
        validators[_validator] = true;
    }

    function removeValidator(address _validator) external onlyOwner {
        validators[_validator] = false;
    }

    function createProposal(string memory _description) external onlyValidator returns (bytes32) {
        bytes32 proposalId = keccak256(abi.encodePacked(_description, block.timestamp, msg.sender));
        proposals[proposalId] = Proposal({
            description: _description,
            votesFor: 0,
            votesAgainst: 0,
            createdAt: block.timestamp,
            proposer: msg.sender,
            executed: false
        });
        emit ProposalCreated(proposalId, _description, msg.sender);
        return proposalId;
    }

    function vote(bytes32 _proposalId, bool _support) external onlyValidator {
        Proposal storage proposal = proposals[_proposalId];
        require(!proposal.executed, "Proposal already executed");

        if (_support) {
            proposal.votesFor++;
        } else {
            proposal.votesAgainst++;
        }
        emit Voted(_proposalId, msg.sender, _support);
    }

    function executeProposal(bytes32 _proposalId) external onlyValidator {
        Proposal storage proposal = proposals[_proposalId];
        require(!proposal.executed, "Proposal already executed");
        require(block.timestamp > proposal.createdAt + 3 days, "Voting period not ended");

        if (proposal.votesFor > proposal.votesAgainst) {
            proposal.executed = true;
            emit ProposalExecuted(_proposalId);
        }
    }
}
