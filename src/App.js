import React from "react";
import "./App.css";
import mondaySdk from "monday-sdk-js";
import "monday-ui-react-core/dist/main.css"
import Dropdown from "monday-ui-react-core/dist/Dropdown";
import TextField from "monday-ui-react-core/dist/TextField";
import Button from "monday-ui-react-core/dist/Button";

const monday = mondaySdk();

class App extends React.Component {
  constructor(props) {
    super(props);

    // Default state
    this.state = {
      settings: {},
      name: "",
    };
  }

  componentDidMount() {
    // TODO: set up event listeners
  }

  render() {
    return <div className="App">
      <Dropdown
        searchable
        className="field"
        name="env"
        title="Environment"
        placeholder="Specify the environment"
        size={Dropdown.size.MEDIUM} 
        options={[{val: 'production', label: 'Production'}, {val: 'demo', label: 'Demo/Sandbox'}, {val: 'dev', label: 'Development'}]}
        required={true}
      />
      <TextField 
        wrapperClassName="field"
        placeholder="Company name"
        size="s"
        required={true}
      />
      <TextField 
        wrapperClassName="field"
        placeholder="Customer email"
        size="s"
        required={true}
      />
      <textarea rows="5" className="input-component field textarea-field" placeholder="Actual behavior/result"/>
      <textarea rows="5" className="input-component field textarea-field" placeholder="Expected behavior/result"/>
      <textarea rows="10" className="input-component field textarea-field" placeholder="Step to reproduce"/>
      <Button>Save</Button>
    </div>;
  }
}

export default App;
