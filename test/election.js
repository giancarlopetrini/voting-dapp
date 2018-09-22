let Election = artifacts.require('./Election.sol');

contract('Election', (accounts) => {
  let electionInstance;

  it('initializes with two candidates', function () {
    return Election.deployed()
      .then((instance) => {
        return instance.candidatesCount();
      }).then((count) => {
        assert.equal(count, 2);
      });
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
        return electionInstance.candidates(2);
      })
      .then((candidate) => {
        assert.equal(candidate[0], 2, 'contains the correct id');
        assert.equal(candidate[1], 'Candidate 2', 'contains the correct name');
        assert.equal(candidate[2], 0, 'contains the correct votes count');
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

});