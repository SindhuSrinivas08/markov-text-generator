import React, { Component } from 'react';
import logo from './logo.svg';

import axios from 'axios'; 
import './App.css';

class App extends Component {

  state = { 
    selectedFile: '',
    randomText:'',
    wordLength:1,
    outputLength:10,
    errorMessage:'',
    success: false,
    showUploadComponent:true,
    showTextGenerator: false
  }; 

  onFileUpload = () => { 
     
    const formData = new FormData(); 
       formData.append( 
      "file", 
      this.state.selectedFile
    ); 
    if(this.state.selectedFile == '') {
      this.setState({ errorMessage: 'Please select File'})
      return false;
    }else if(this.state.wordLength == 0){
      this.setState({ errorMessage: 'Word length must be greater than 0'})
      return false;
    }else{
      formData.append("wordLength",this.state.wordLength)
      axios.post("http://localhost:8080/upload/file", formData).then(res=>{
        this.setState({ success: true})
        this.setState({ errorMessage: "File Successfully uploaded"})
        this.setState({ showUploadComponent: false})
        this.setState({ showTextGenerator: true})
      }).catch(err=>{
        this.setState({ errorMessage: err.response.data})
      })
    }
  
  }; 

  getText = () => {
    if(this.state.outputLength == 0){
      this.setState({ errorMessage: 'output length must be greeater than 0'})
      return false;
    }
    axios.get("http://localhost:8080/generate/random-text",{
      params: {
        "outputLength":this.state.outputLength
      }
    }).then(res=>{
      this.setState({ randomText: res.data}); 
    }).catch(err=>{
      this.setState({ errorMessage: err.response.data})
    }); 
  }

  onFileChange = event => { 
    this.setState({ selectedFile: event.target.files[0] }); 
  }; 
  onWordLengthChange = event => {
    this.setState({ wordLength: event.target.value }); 
  }
  outputLengthChange = event => {
    this.setState({ outputLength: event.target.value }); 
  }
  refreshPage(){
    window.location.reload(true);
  }

  render() {
    return ( 
      <div> 
        <div className="Background">
        <h1 style={{ padding: "100px", textAlign: "center", color: "White"}}>Markov Text Generator</h1>
        </div>
        <div className="Content">
        <div >
        <label className="Alert-Label">{this.state.errorMessage}</label>
        </div >
           <div style={this.state.showUploadComponent ? {} : { display: 'none' }}>
              <label className="Input-Label">Word length:</label><input className="Input-Label" type="text" name="wordLength" value={this.state.wordLength} onChange={this.onWordLengthChange}/>
              <div>
                <input className="File-Input" type="file" onChange={this.onFileChange} /> 
                <button className="Button" onClick={this.onFileUpload}> Upload! </button> 
              </div>
          </div> 
          <div style={this.state.showTextGenerator ? {} : { display: 'none' }}>
            <label className="Input-Label">Number of words : </label>
            <input className="Input-Label" type="text" name="length of the sentance" value={this.state.outputLength} onChange={this.outputLengthChange}/>
            <button className="Button" disabled={!this.state.success}  onClick={this.getText}> get text</button> 
             <div className= "Result-Box"> {this.state.randomText}</div>
             <div className="BackToUploadDiv">
             <button className="Button" onClick={this.refreshPage}>Back to upload new file</button>
             </div>
          </div> 
          </div>
      </div>    
    ); 
  }
}

export default App;
