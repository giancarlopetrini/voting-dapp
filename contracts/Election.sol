pragma solidity 0.4.24;

contract Election {
    // Constructor
    constructor() public {
        addCandidate("Candidate 1");
        addCandidate("Candidate 2");
    }

    struct Candidate {
        uint id;
        string name;
        uint voteCount;
    }

    // Read/write Candidates
    mapping(uint => Candidate) public candidates;

    // Store Candidates Count
    uint public candidatesCount;


    function addCandidate(string _name) private {
        candidatesCount++;
        candidates[candidatesCount] = Candidate(candidatesCount, _name, 0);
    }

    // Read/write voters
    mapping(address => bool) public voters;

    // vote takes candidate id, 
    function vote(uint _candidateId) public {
        // require that they haven't voted before
        require(!voters[msg.sender], "Vote already cast from this address");

        // require a valid candidate, making sure their index is in mapping
        require(_candidateId > 0 && _candidateId <= candidatesCount, "Candidate ID is not in range of candidates");

        // record that voter has voted, making their address key true
        voters[msg.sender] = true;

        // update candidate vote Count, for matched id, based on key
        candidates[_candidateId].voteCount++;

        // trigger voted event
        emit votedEvent(_candidateId);
    }

    event votedEvent (uint indexed_candidateId);
}