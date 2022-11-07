// SPDX-License-Identifier: MIT
pragma solidity ^0.8.14;

contract Transaction {
    struct transaction {
        string category;
        string name;
        uint256 timestamp;
        string ipfs_hash;
        string registrant;
        string responsible_manager;
        string file_type;
        string file_description;
    }

    struct checklistTransaction {
        string category;
        string checktype;
        uint256 timestamp;
        string registrant;
        string responsible_manager;
        bool[] des;
        // string one;
        // string two;
        // string three;
        // string four;
        // string five;
        // string six;
        // string seven;
        // string eight;
        // string nine;
        // string ten;
    }

    event handleTransaction(string category, string name, uint256 time, string ipfs_hash, string registrant, string responsible_manager, string file_type, string file_description);
    event documentTransaction(string category, string name, uint256 time, string ipfs_hash, string registrant, string responsible_manager, string file_type, string file_description);
    //여기서부터
    event checkTransaction(string category, string checktype, uint256 time, string registrant, string responsible_manager, bool[] des);
    //여기까지
    event cctvTransaction(string category, string name, uint256 time, string ipfs_hash, string registrant, string responsible_manager, string file_type, string file_description);
    event tempTransaction(string category, string name, uint256 time, string ipfs_hash, string registrant, string responsible_manager, string file_type, string file_description);
    event pressureTransaction(string category, string name, uint256 time, string ipfs_hash, string registrant, string responsible_manager, string file_type, string file_description);
    event rayTransaction(string category, string name, uint256 time, string ipfs_hash, string registrant, string responsible_manager, string file_type, string file_description);

    //saves all the transactions of the account
    mapping (address=>transaction) transactionIndex;
    mapping (address=>checklistTransaction) checklistTransactionIndex;
    //count the total number of transaction of the account
    mapping (address=>uint16) transaction_cnt;

    //send the transaction
    function sendTrans(string memory category, string memory name, string memory ipfs_hash, string memory registrant, string memory responsible_manager, string memory file_type, string memory file_description) public payable{
        // cate = " " + cate;
        //inserts transaction information
        transaction memory newTransaction = transaction(category, name, block.timestamp, ipfs_hash, registrant, responsible_manager, file_type, file_description);
        //count the number of transactions sent
        transaction_cnt[msg.sender]++;
        //save all the transactions
        transactionIndex[msg.sender] = newTransaction;

        emit handleTransaction(category, name, block.timestamp, ipfs_hash, registrant, responsible_manager, file_type, file_description);
        if (keccak256(abi.encodePacked(category)) == keccak256(abi.encodePacked('Document')))
            emit documentTransaction(category, name, block.timestamp, ipfs_hash, registrant, responsible_manager, file_type, file_description);
        if (keccak256(abi.encodePacked(category)) == keccak256(abi.encodePacked('CCTV')))
            emit cctvTransaction(category, name, block.timestamp, ipfs_hash, registrant, responsible_manager, file_type, file_description);
        if (keccak256(abi.encodePacked(category)) == keccak256(abi.encodePacked('Temp')))
            emit tempTransaction(category, name, block.timestamp, ipfs_hash, registrant, responsible_manager, file_type, file_description);
        if (keccak256(abi.encodePacked(category)) == keccak256(abi.encodePacked('Pressure')))
            emit pressureTransaction(category, name, block.timestamp, ipfs_hash, registrant, responsible_manager, file_type, file_description);
        if (keccak256(abi.encodePacked(category)) == keccak256(abi.encodePacked('Ray')))
            emit rayTransaction(category, name, block.timestamp, ipfs_hash, registrant, responsible_manager, file_type, file_description);
    }

    function sendCheckTrans(string memory category, string memory checktype, string memory registrant, string memory responsible_manager, bool[] memory des) public payable{
        checklistTransaction memory newChecklistTransaction = checklistTransaction(category, checktype, block.timestamp, registrant, responsible_manager, des);
        transaction_cnt[msg.sender]++;
        checklistTransactionIndex[msg.sender] = newChecklistTransaction;

        emit checkTransaction(category, checktype, block.timestamp, registrant, responsible_manager, des);
        // if (keccak256(abi.encodePacked(category)) == keccak256(abi.encodePacked('CheckList')))
        //     emit checkTransaction(category, checktype, block.timestamp, registrant, responsible_manager, one, two, three, four, five, six, seven, eight, nine, ten);
    }
 

    //view all the transactions of the user
    function getAllTransactions() view external returns(transaction memory){
        return transactionIndex[msg.sender];
    }
    
    function getAllCheckTransactions() view external returns(checklistTransaction memory){
        return checklistTransactionIndex[msg.sender];
    }

    function cntTransactions() view external returns(uint16){
        return transaction_cnt[msg.sender];
    }
}