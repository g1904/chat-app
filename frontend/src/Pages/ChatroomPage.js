import React from "react";
import axios from "axios";
import { withRouter } from "react-router-dom";

const ChatroomPage = ({ match, socket }) => {
  const chatroomId = match.params.id;
  const [messages, setMessages] = React.useState([]);
  const messageRef = React.useRef();
  const [userId, setUserId] = React.useState("");
  var chatName;

  class history extends React.Component {

    state = {
      old: []
    }

    componentDidMount = () => {
      axios.post("http://localhost:8000/chatroom", {
        Authorization: "Bearer " + localStorage.getItem("CC_Token"),
        ChatID: chatroomId,
      })
      .then((response) => {
        this.setState({old: response.History});
        chatName = response.Chatname;
      }).catch((err) =>{setTimeout(this.componentDidMount, 3000)});
    };


    render() {
      return (
        <div className="message">
          {this.state.old.forEach(element => {
            if (socket) {
              socket.emit("chatroomMessage", {
                chatroomId,
                message: element.message,
              });
            }
          })}
        </div>
      )
    }

}
  const sendMessage = () => {
    if (socket) {
      socket.emit("chatroomMessage", {
        chatroomId,
        message: messageRef.current.value,
      });

      axios.put("http://localhost:8000/chatroom", {
          Authorization: "Bearer " + localStorage.getItem("CC_Token"),
          ChatID: chatroomId,
          Message: messageRef.current.value
        });
      

      messageRef.current.value = "";
    }
  };

  React.useEffect(() => {
    const token = localStorage.getItem("CC_Token");
    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUserId(payload.id);
    }
    if (socket) {
      socket.on("newMessage", (message) => {
        const newMessages = [...messages, message];
        setMessages(newMessages);
      });
    }
    //eslint-disable-next-line
  }, [messages]);

  React.useEffect(() => {
    if (socket) {
      socket.emit("joinRoom", {
        chatroomId,
      });
    }

    return () => {
      //Component Unmount
      if (socket) {
        socket.emit("leaveRoom", {
          chatroomId,
        });
      }
    };
    //eslint-disable-next-line
  }, []);


  return (
    <div className="chatroomPage">
      <div className="chatroomSection">
        <div className="cardHeader">ChatRoom</div>
        <div className="chatroomContent">
          <history/>
          {messages.map((message, i) => (
            <div key={i} className="message">
              <span
                className={
                  userId === message.userId ? "ownMessage" : "otherMessage"
                }
              >
                {message.name}:
              </span>{" "}
              {message.message}
            </div>
          ))}
        </div>
        <div className="chatroomActions">
          <div>
            <input
              type="text"
              name="message"
              placeholder="Say something!"
              ref={messageRef}
            />
          </div>
          <div>
            <button className="join" onClick={sendMessage}>
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withRouter(ChatroomPage);
