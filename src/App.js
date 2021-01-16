import React from "react";
import "./App.css";
import mondaySdk from "monday-sdk-js";
import "monday-ui-react-core/dist/main.css"
import Dropdown from "monday-ui-react-core/dist/Dropdown";
import TextField from "monday-ui-react-core/dist/TextField";
import Button from "monday-ui-react-core/dist/Button";

const monday = mondaySdk();

const envOptions = [
  { value: 'production', label: 'Production' },
  { value: 'demo', label: 'Demo/Sandbox' },
  { value: 'dev', label: 'Development' }
];

class App extends React.Component {
  constructor(props) {
    super(props);

    // Default state
    this.state = {
      settings: {},
      isLoading: true,
      env: envOptions[0],
      companyName: '',
      customerEmail: '',
      actual: '',
      expected: '',
      reproduce: '',
    };
    this.key = '';
  }

  componentDidMount() {
    monday.get('context').then(({ data }) => {
      if (!data) {
        return;
      }
      this.key = `${data.boardId}:${data.itemId}`;
    }).then(() => this.readData());
  }

  readData() {
    if (!this.key) {
      console.warn('Bug Template: reading failed - key is missing');
      return;
    }
    monday.storage.instance.getItem(this.key).then(res => {
      const raw = res.data?.value;
      if (!raw) {
        console.warn('Bug Template: reading failed - payload is not found');
        return
      }
      const payload = JSON.parse(raw);
      this.setState({
        ...this.state,
        ...payload
      })
    });
  }

  saveData() {
    if (!this.key) {
      console.warn('Bug Template: saving failed - key is missing');
      return;
    }
    const payload = {
      env: this.state.env,
      updatedAt: new Date()
    };
    ['companyName', 'customerEmail', 'actual', 'expected', 'reproduce'].forEach((prop) => {
      if (this.state[prop]) {
        payload[prop] = this.state[prop];
      }
    });
    monday.storage.instance.setItem(this.key, JSON.stringify(payload))
      .then(() => {
        console.log('Bug Template: saving succeeded');
        monday.execute('notice', {
          message: 'Bug is saved successfully',
          type: 'success',
          timeout: 10000,
        });
      })
      .catch((err) => {
        console.warn('Bug Template: saving failed', err);
        monday.execute('notice', {
          message: 'Bug save has failed',
          type: 'error',
          timeout: 10000,
        });
        return;
      });
  }

  setValue(prop) {
    return (ev) => {
      const val = ev.target ? ev.target.value : ev;
      this.setState({
        ...this.state,
        [prop]: val
      });
    }
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
        required={true}
        options={envOptions}
        value={this.state.env}
        onChange={this.setValue('env')}
      />
      <TextField
        wrapperClassName="field"
        className="input-field"
        placeholder="Company name"
        size="s"
        required={true}
        value={this.state.companyName}
        onChange={this.setValue('companyName')}
      />
      <TextField
        wrapperClassName="field"
        className="input-field"
        placeholder="Customer email"
        size="s"
        required={true}
        value={this.state.customerEmail}
        onChange={this.setValue('customerEmail')}
      />

      <textarea
        rows="5"
        className="input-component field textarea-field"
        placeholder="Actual behavior/result"
        required={true}
        value={this.state.actual}
        onChange={this.setValue('actual')}
      />

      <textarea
        rows="5"
        className="input-component field textarea-field"
        placeholder="Expected behavior/result"
        required={true}
        value={this.state.expected}
        onChange={this.setValue('expected')}
      />

      <textarea
        rows="10"
        className="input-component field textarea-field"
        placeholder="Step to reproduce"
        required={true}
        value={this.state.reproduce}
        onChange={this.setValue('reproduce')}
      />

      <Button onClick={this.saveData.bind(this)}>Save</Button>
    </div>;
  }
}

export default App;
