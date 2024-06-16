// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.9;


interface IOracle {
    function createLlmCall(uint256 promptId) external returns (uint256);
}


contract ChatGpt {
    address private owner;
    address public oracleAddress;
    uint256 private chatRunsCount;

    mapping(uint256 => ChatRun) public chatRuns;

    struct Message {
        string role;
        string content;
    }

    struct ChatRun {
        address owner;
        Message[] messages;
        uint256 messagesCount;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Caller is not owner");
        _;
    }
    

    modifier onlyOracle() {
        require(msg.sender == oracleAddress, "Caller is not oracle");
        _;
    }

    event OracleAddressUpdated(address indexed newOracleAddress);

    event ChatCreated(address indexed owner, uint256 indexed chatId);

    constructor(address initialOracleAddress) {
        owner = msg.sender;
        oracleAddress = initialOracleAddress;
    }

    function setOracleAddress(address newOracleAddress) public onlyOwner {
        oracleAddress = newOracleAddress;
        emit OracleAddressUpdated(newOracleAddress);
    }

    function startChat(string memory message) public returns (uint256 i) {
        ChatRun storage run = chatRuns[chatRunsCount];

        run.owner = msg.sender;
        Message memory newMessage;
        newMessage.content = message;
        newMessage.role = "user";
        run.messages.push(newMessage);
        run.messagesCount = 1;

        uint256 currentId = chatRunsCount;
        chatRunsCount = chatRunsCount + 1;

        IOracle(oracleAddress).createLlmCall(currentId);
        emit ChatCreated(msg.sender, currentId);

        return currentId;
    }
 
    function addMessage(string memory message, uint256 runId) public {
        ChatRun storage run = chatRuns[runId];
        require(
            keccak256(
                abi.encodePacked(run.messages[run.messagesCount - 1].role)
            ) == keccak256(abi.encodePacked("assistant")),
            "No response to previous message"
        );
        require(run.owner == msg.sender, "Only chat owner can add messages");

        Message memory newMessage;
        newMessage.content = message;
        newMessage.role = "user";
        run.messages.push(newMessage);
        run.messagesCount++;
        IOracle(oracleAddress).createLlmCall(runId);
    }

    function getMessageHistoryContents(uint256 chatId)
        public
        view
        returns (string[] memory)
    {
        string[] memory messages = new string[](
            chatRuns[chatId].messages.length
        );
        for (uint256 i = 0; i < chatRuns[chatId].messages.length; i++) {
            messages[i] = chatRuns[chatId].messages[i].content;
        }
        return messages;
    }

    function getMessageHistoryRoles(uint256 chatId)
        public
        view
        returns (string[] memory)
    {
        string[] memory roles = new string[](chatRuns[chatId].messages.length);
        for (uint256 i = 0; i < chatRuns[chatId].messages.length; i++) {
            roles[i] = chatRuns[chatId].messages[i].role;
        }
        return roles;
    }

    function onOracleLlmResponse(
        uint256 runId,
        string memory response,
        string memory /*errorMessage*/
    ) public onlyOracle {
        ChatRun storage run = chatRuns[runId];
        require(
            keccak256(
                abi.encodePacked(run.messages[run.messagesCount - 1].role)
            ) == keccak256(abi.encodePacked("user")),
            "No message to respond to"
        );

        Message memory newMessage;
        newMessage.content = response;
        newMessage.role = "assistant";
        run.messages.push(newMessage);
        run.messagesCount++;
    }
}
