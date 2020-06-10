import "../styles/materialize.min.css";
import React from "react";
import axios from "axios";
import makeToast from "../Toaster";
import { withRouter } from "react-router-dom";
//import M from "materialize-css";
import 'materialize-css';
import {Button, Modal, Collapsible, CollapsibleItem, Icon} from 'react-materialize';


const DashboardPage = (props) => {

    /*
    // setup materialize components
    document.addEventListener('DOMContentLoaded', function() {

        var modals = document.querySelectorAll('.modal');
        M.Modal.init(modals);
    
        var items = document.querySelectorAll('.collapsible');
        M.Collapsible.init(items);
    
    });
    */

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
                        this.setState({count: '1', chats: response.data});
                })
                .catch((err) => {
                    setTimeout(this.updateState, 3000);
                });
        }

        render() {
            return (
                <Collapsible accordion={false} style={{margin: '40px 140px 0px 140px', height: '100vh'}}>
                    {this.state.chats.map((room) => (
                        <CollapsibleItem
                            expanded={false}
                            header={room.Chatname}
                            node="div"
                        >
                            <iframe title={room.Chatname} src={"http://localhost:8000/chatroom/" + room._id}/>
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
        localStorage.removeItem("Name");
        localStorage.removeItem("CC_Token");
        props.history.push("/login");
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
                props.history.push("/dashboard");
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


    
   // window.onbeforeunload = function () {logout();}

    /*
    const deleteChatroom = () => {
        const chatname = currChatName.current.value;
        const user = currUserRef.current.value;
        axios
            .delete("http://localhost:8000/chatroom", {
                   Authorization: "Bearer " + localStorage.getItem("CC_Token"),
                    Chatname: chatname,
                    Users: user,
            })
            .then((response) => {
                console.log(response);
            })
            .catch((err) => {
                setTimeout(deleteChatroom, 3000);
            });
    }
    
    
    const getChatrooms = (roomList) => {
        axios
            .post("http://localhost:8000/chatroom", {
                Authorization: "Bearer " + localStorage.getItem("CC_Token")
            })
            .then((response) => {
                roomList = response.data;
                //setChatrooms(response.data);
                //if (roomList.length < 3) window.location.reload();
            })
            .catch((err) => {
                setTimeout(getChatrooms, 3000);
            });
    };


/*
    React.useEffect(() => {
        getChatrooms();
        // eslint-disable-next-line
    }, []);
*/

    //if (roomList.length < 3) window.location.reload();
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

export default withRouter(DashboardPage);

/*
<li>
<div class="collapsible-header grey lighten-4">
    {room.Chatname}
</div>
<div class="collapsible-body white">
    <iframe title={room.Chatname} src={"http://localhost:8000/chatroom/" + room._id}/>
</div>
</li>

                        roomList.forEach(function(room) {
                            html += `
                                <li>
                                    <div class="collapsible-header grey lighten-4">
                                        {room.Chatname}
                                    </div>
                                    <div class="collapsible-body white">
                                        <iframe title={room.Chatname} src={"http://localhost:8000/chatroom/" + room._id}/>
                                    </div>
                                </li>
                                `;
                        });


                                    <div class="container" style={{margin: '40px 0px 0px 140px', height: '100vh'}}>
                <ul class="collapsible z-depth-0 chatrooms" style={{border: "none"}}>
                    <li>
                        <div class="collapsible-header grey lighten-4"> a </div>
                        <div class="collapsible-body white"> a </div>
                    </li>
                </ul>
                
            </div>
*/