import "../styles/materialize.min.css";
import React from "react";
import axios from "axios";
import makeToast from "../Toaster";
import { withRouter, Link } from "react-router-dom";
import M from "materialize-css";

const DashboardPage = (props) => {

    // setup materialize components
    document.addEventListener('DOMContentLoaded', function() {
        var elems1 = document.querySelectorAll('.modal');
        var instances = M.Modal.init(elems1, elems1.options);
    });

    document.addEventListener('DOMContentLoaded', function() {
        var elems2 = document.querySelectorAll('.collapsible');
        var instances = M.Collapsible.init(elems2, elems2.options);
    });

    const newChatNameRef = React.createRef();
    const chatMembersRef = React.createRef();
    const [chatrooms, setChatrooms] = React.useState([]);


    const logout = () => {
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
                Users: users,
            })
            .then((response) => {
                makeToast("success", response.data.message);
                props.history.push("/dashboard");
            })
            .catch((err) => {
                //props.history.push("/"+localStorage.getItem("CC_Token").split(' ')[1]);
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


    /*
    window.onunload = function () {
        localStorage.removeItem("CC_Token");
    }

    /*
    const deleteChatroom = () => {
        const chatname = currChatName.current.value;
        const user = currUserRef.current.value;
        axios
            .delete("http://localhost:8000/chatroom", {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("CC_Token"),
                    Chatname: chatname,
                    Users: user,
                },
            })
            .then((response) => {
                console.log(response);
            })
            .catch((err) => {
                setTimeout(deleteChatroom, 3000);
            });
    }
    */
    
    const getChatrooms = () => {
        //props.history.push("/login");
        axios
            .get("http://localhost:8000/chatroom", {
                Authorization: "Bearer " + localStorage.getItem("CC_Token"),
            })
            .then((response) => {
                //props.history.push("/login");
                setChatrooms(response.data);
            })
            .catch((err) => {
                setTimeout(getChatrooms, 3000);
            });
    };

    React.useEffect(() => {
        //props.history.push("/login");
        getChatrooms();
        // eslint-disable-next-line
    }, []);

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

            <nav class="z-depth-0 brown lighten-4">
                <div class="nav-wrapper container">
                <a href="/#" class="brand-logo">
                    <text style={{width: '180px', margin: '10px'}}>Let's Chat!</text>
                </a>
                <ul class="right hide-on-med-and-down">
                    <li class="logged-in">
                        <a href="/#" class="black-text modal-trigger" data-target="modal-create">Create a Chatroom</a>
                    </li>
                    <li class="logged-in">
                        <button class="white-text" id="logout" onClick={logout}>Logout</button>
                    </li>
                </ul>
                </div>
            </nav>
            

            <div class="container" style={{margin: '40px 0px 0px 140px', height: '100vh'}}>
                <ul class="collapsible z-depth-0 guides" style={{border: 'none'}} title="Chatrooms">
                        <li>
                            <div class="collapsible-header grey lighten-4">
                                test
                            </div>
                            <div class="collapsible-body white">
                                
                            </div>
                        </li>

                        <div className="chatrooms">
                            {chatrooms.map((chatroom) => (
                            <div key={chatroom._id} className="chatroom">
                                <div>{chatroom.name}</div>
                                <Link to={"/chatroom/" + chatroom._id}>
                                <div className="join">Join</div>
                                </Link>
                            </div>
                            ))}
                        </div>

                    {chatrooms.map((chatroom) => (
                        <li>
                            <div class="collapsible-header grey lighten-4">
                                {chatroom._id}
                            </div>
                            <div class="collapsible-body white">
                                <iframe title={chatroom._id} src={"http://localhost:8000/chatroom/" + chatroom._id}/>
                            </div>
                        </li>
                    ))}

                        <li>
                            <div class="collapsible-header grey lighten-4">
                                test
                            </div>
                            <div class="collapsible-body white">
                                
                            </div>
                        </li>
                </ul>
            </div>
        </div>
    );


};

export default withRouter(DashboardPage);