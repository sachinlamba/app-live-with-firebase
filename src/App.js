import React, { Component } from 'react';
import * as firebase from "firebase";
// import config from './firebase-config';
import './App.css';

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      switchesStatus: [],
      loading: false,
      switchDefaultValue: false
    };
    const config = {
      apiKey: process.env.REACT_APP_API_KEY,
      authDomain: process.env.REACT_APP_AUTH_DOMAIN,
      databaseURL: process.env.REACT_APP_DATABASE_URL,
      projectId: process.env.REACT_APP_PROJECT_ID,
      storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
      messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
    };
    firebase.initializeApp(config);
    // firebase.auth();
    this.handleUpdate = this.handleUpdate.bind(this);
    this.handleAddNew = this.handleAddNew.bind(this);
  }
  componentWillMount() {
    this.setState({
      loading: true
    });
    let switchesRef = firebase.database().ref('switches');
    let _this = this;
    switchesRef.on('value', function(snapshot) {
      _this.setState({
        switchesStatus: snapshot.val(),
        loading: false
      });
    });
  }
  handleAddNew(e) {
    let switchesStates = this.state.switchesStatus;
    firebase.database().ref('switches/' + switchesStates.length).set({
      Name: "Switch " + switchesStates.length,
      Enable: this.state.switchDefaultValue
    });
  }
  handleUpdate (e, id) {
    let switchesStates = this.state.switchesStatus;
    let switchUpdate = {
      Name: switchesStates[id].Name,
      Enable: !switchesStates[id].Enable
    };
    switchesStates[id] = switchUpdate;
    firebase.database().ref('switches/'+id).set(switchUpdate);

    this.setState({
      switchesStatus: switchesStates
    });
  }
  render() {
    let switchesStatus = this.state.switchesStatus;
    console.log(switchesStatus);
    return (
      <div className="App">
      <div className="switches">
      {
        switchesStatus.map((ss, index) => {
          return <div>
                    <div style={{display: "inline-block"}}>{ss.Name}</div>
                    <label className="switch">
                      <input type="checkbox" checked={ss.Enable} onChange={(e) => {this.handleUpdate(e, index)}} />
                      <span className="slider round"></span>
                    </label>
                  </div>
        })
      }
      </div>
      <div className="add-btn" onClick={() => this.handleAddNew()}>Add more?</div>
      </div>
    );
  }
}

export default App;
