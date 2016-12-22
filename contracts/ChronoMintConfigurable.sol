pragma solidity ^0.4.4;

import "Configurable.sol";

contract ChronoMintConfigurable is Configurable {
  address chronoMint;
  mapping(string => string) stringSettings;

  modifier onlyMint() {
    if (isMint(msg.sender)) {
      _;
      } else {
        return;
      }
  }
  function Configurable() {

  }
  function isMint(address _ad) returns(bool) {
    if (_ad == address(chronoMint))
      return true;
    else
      return false;
  }
  function setValue(string name, uint value) onlyMint() {
      setVal(name, value);
  }

  function approved() onlyMint();
}
