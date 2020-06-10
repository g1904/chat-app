import React from "react";
import axios from "axios";
import makeToast from "../Toaster";
import { Link } from "react-router-dom";
import "../styles/materialize.min.css";
import 'materialize-css';
import {Button, Modal, Collapsible, CollapsibleItem} from 'react-materialize';

const DashboardPage = (props) => {
    class RoomView extends React.Component {
      state = {
          chats: []
      }

      constructor(props) {
          super(props);
          this.updateState();
      }

      componentDidMount() {
          this.updateState();
      }

      updateState = () => {
          axios
              .post("http://localhost:8000/chatroom", {
                  Authorization: "Bearer " + localStorage.getItem("CC_Token")
              })
              .then((response) => {
                  if (response.data)
                      this.setState({chats: response.data});
              })
              .catch((err) => {
                  setTimeout(this.updateState, 3000);
              });
      }

      render() {
          return (
              <Collapsible accordion={false} style={{margin: '50px 140px 0px 150px', height: '100vh'}}>
                  {this.state.chats.map((room) => (
                      <CollapsibleItem
                          expanded={false}
                          header={"Chatname: " + room.Chatname}
                          node="div"
                      >
                          <Link to={"/chatroom/" + room._id}
                              style={{marginLeft: '30%'}}
                          >
                              <Button node="a" waves="light">Open Chat</Button>
                          </Link>
                          <Button
                              node="a"
                              waves="light"
                              style={{marginLeft: '200px'}}
                              onClick={deleteChat(room._id)}
                          >
                              Delete Chat
                          </Button>
                      </CollapsibleItem>
                  ))}
              </Collapsible>
          )
      }
  }

  const newChatNameRef = React.createRef();
  const chatMembersRef = React.createRef();

  const logout = () => {
      localStorage.removeItem("Email");
      localStorage.removeItem("CC_Token");
      window.location.replace(window.location.origin.toString() + "/login");
  }

  const createChatroom = () => {
      const name = newChatNameRef.current.value;
      const users = chatMembersRef.current.value.split(/\r?\n/);

      axios
          .post("http://localhost:8000/chatroom", {
                Authorization: "Bearer " + localStorage.getItem("CC_Token"),
                Chatname: name,
                Users: users
          })
          .then((response) => {
              makeToast("success", response.data.message);
          })
          .catch((err) => {
              console.log(err);
              if (
                  err &&
                  err.response &&
                  err.response.data &&
                  err.response.data.message
              )
                  makeToast("error", err.response.data.message);
          });

  }
  
  const deleteChat = (id) => {
      console.log("delete starts");
      axios
          .delete("http://localhost:8000/chatroom", {
              Authorization: "Bearer " + localStorage.getItem("CC_Token"),
              ChatID: id
          })
          .then((response) => {
              if (response) {
                console.log(response);
                console.log("delete ends");
              } else {
                  window.location.reload();
              }
          })
          .catch((err) => {
              setTimeout(deleteChat, 3000);
          });
  }

  return (
      <div class="brown lighten-3">

          <div id="modal-create" class="modal">
              <div class="modal-content">
              <h4>Create a New Chat</h4><br />
              <form id="create-form">
                  <div class="input-field">
                      <input type="text" id="title" required ref={newChatNameRef}/>
                  <label for="title">chatroom name</label>
                  </div>
                  <div class="input-field">
                  <textarea id="content" class="materialize-textarea" required ref={chatMembersRef}/>
                  <label for="content">chatroom users</label>
                  </div>
                  <button class="btn yellow darken-2 z-depth-0" onClick={createChatroom}>Create</button>
              </form>
              </div>
          </div>

          <div id="modal-account" class="modal">
              <div class="modal-content center-align">
              <h4>Account details</h4><br />
              <div class="account-details">
                  <div>Email Address: {localStorage.getItem("Email")}</div>
              </div>
              </div>
          </div>

          <nav class="z-depth-0 brown lighten-4">
              <div class="nav-wrapper container">
              <a href="/#" class="brand-logo">
                  <text style={{width: '180px', margin: '10px'}}>Let's Chat!</text>
              </a>
              <ul class="right hide-on-med-and-down">
                  <li class="logged-in">
                      <Modal
                          actions={[
                              <Button flat modal="close" node="button" waves="green">Close</Button>
                          ]}
                          bottomSheet={false}
                          fixedFooter={false}
                          header="Account Details"
                          id="Modal-0"
                          open={false}
                          options={{
                              dismissible: true,
                              endingTop: '10%',
                              inDuration: 250,
                              onCloseEnd: null,
                              onCloseStart: null,
                              onOpenEnd: null,
                              onOpenStart: null,
                              opacity: 0.5,
                              outDuration: 250,
                              preventScrolling: true,
                              startingTop: '4%'
                          }}
                          root={document.body}
                          trigger={<Button node="button">Account</Button>}
                          >
                          <div class="modal-content center-align">
                              <div class="account-details">
                                  <div>Email Address: {localStorage.getItem("Email")}</div>
                              </div>
                          </div>
                      </Modal>
                  </li>
                  <li class="logged-in">
                      <Modal
                          actions={[
                              <Button flat modal="close" node="button" waves="green">Close</Button>
                          ]}
                          bottomSheet={false}
                          fixedFooter={false}
                          header="Create a Chatroom"
                          id="Modal-0"
                          open={false}
                          options={{
                              dismissible: true,
                              endingTop: '10%',
                              inDuration: 250,
                              onCloseEnd: null,
                              onCloseStart: null,
                              onOpenEnd: null,
                              onOpenStart: null,
                              opacity: 0.5,
                              outDuration: 250,
                              preventScrolling: true,
                              startingTop: '4%'
                          }}
                          root={document.body}
                          trigger={<Button node="button">Create a Chatroom</Button>}
                          >
                          <form id="create-form">
                              <div class="input-field">
                                  <input type="text" id="title" required ref={newChatNameRef}/>
                              <label for="title">chatroom name</label>
                              </div>
                              <div class="input-field">
                              <textarea id="content" class="materialize-textarea" required ref={chatMembersRef}/>
                              <label for="content">chatroom users</label>
                              </div>
                              <button class="btn yellow darken-2 z-depth-0" onClick={createChatroom}>Create</button>
                          </form>
                      </Modal>
                  </li>
                  <li class="logged-in">
                      <Button node="button" onClick={logout}>LOGOUT</Button>
                  </li>
              </ul>
              </div>
          </nav>
          <RoomView />
      </div>
      
  );

};

export default DashboardPage;
