let Election = artifacts.require('./Election.sol');

contract('Election', (accounts) => {
  let electionInstance;

  it('creates candidates via submission', function () {
    let instance;
    return Election.deployed()
      .then((Instance) => {
        instance = Instance;
        return instance.addCandidate('Candidate 1', 'democrat');
      }).then(() => {
        return instance.addCandidate('Candidate 2', 'republican');
      })
      .then(() => instance.candidates())
      .then(count => assert.equal(count, 2));
  });

  it('it initializes the candidates with the correct values', () => {
    return Election.deployed()
      .then((instance) => {
        electionInstance = instance;
        return electionInstance.candidates(1);
      })
      .then((candidate) => {
        assert.equal(candidate[0], 1, 'contains the correct id');
        assert.equal(candidate[1], 'Candidate 1', 'contains the correct name');
        assert.equal(candidate[2], 0, 'contains the correct votes count');
        assert.equal(candidate[3], 'democrat', 'contains the right party');
        return electionInstance.candidates(2);
      })
      .then((candidate) => {
        assert.equal(candidate[0], 2, 'contains the correct id');
        assert.equal(candidate[1], 'Candidate 2', 'contains the correct name');
        assert.equal(candidate[2], 0, 'contains the correct votes count');
        assert.equal(candidate[3], 'republican', 'contains the right party');
      });
  });

  it('increments the vote count properly and adds address to voted map', () => {
    let candidate;
    let electionInstance;

    return Election.deployed()
      .then((instance) => {
        electionInstance = instance;
        candidate = 1;
        return electionInstance.vote(candidate, {
          from: accounts[0]
        });
      })
      .then((vote) => {
        assert.isDefined(vote.tx, 'successfully generated vote tx id');
        return electionInstance.candidates(candidate);
      })
      .then((candidate) => {
        assert.equal(candidate[2], 1, 'added vote to candidate array');
        return electionInstance.voters(accounts[0]);
      })
      .then((voters) => {
        assert.isTrue(voters, 'address added to voters mapping');
      })
      .then(() => {
        return electionInstance.vote(candidate + 1, {
          from: accounts[0]
        });
      })
      .catch((err) => {
        assert.include(err.message, 'Vote already cast from this address', 'error if address votes twice');
      });
  });

  it('prevents candidate from being added after first vote cast', () => {
    let instance;
    return Election.deployed()
      .then((Instance) => {
        instance = Instance;
        return instance.voteTotal();
      })
      .then((total) => {
        assert.equal(total, 1, 'total votes incremented for each prev vote');
        return instance.addCandidate('TestCand3', 'dem');
      })
      .catch((err) => {
        assert.include(err.message, 'Cannot submit candidate after first vote recorded');
      });
  })

  it('throws exception if address tries to vote twice', () => {
    return Election.deployed()
      .then((instance) => {
        let candidate = 1
        instance.vote(candidate, {
          from: accounts[1]
        });
        return instance.vote(candidate, {
          from: accounts[1]
        });
      })
      .catch((err) => {
        assert.include(err.message, 'Vote already cast from this address', 'error if address votes twice');
      });
  });

  it('throws an exception for invalid candidates', () => {
    return Election.deployed()
      .then((instance) => {
        return instance.vote(99, {
          from: accounts[2]
        });
      })
      .catch((err) => {
        assert.include(err.message, 'Candidate ID is not in range of candidates', 'error if selecting non existing candidate id');
      });
  });

  it('allows a voter to cast a vote', () => {
    return Election.deployed()
      .then((instance) => {
        electionInstance = instance;
        candidateId = 2;
        return electionInstance.vote(candidateId, {
          from: accounts[3]
        });
      })
      .then((receipt) => {
        assert.equal(receipt.logs[0].event, 'votedEvent', 'the event type is correct');
        assert.equal(receipt.logs[0].args.indexed_candidateId.toNumber(), candidateId, 'the candidate id is correct');
        return electionInstance.voters(accounts[3]);
      }).then((voted) => {
        assert(voted, 'the voter was marked as voted');
        return electionInstance.candidates(candidateId);
      }).then((candidate) => {
        assert.equal(candidate[2], 1, "increments the candidate's vote count");
      });
  });

});