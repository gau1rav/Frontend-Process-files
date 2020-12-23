import React from 'react';
import axios from 'axios';

import Navbar from '../components/Navbar';
import DragAndDrop from '../components/DragAndDrop';

import {ReactComponent as Upload_Icon} from '../svgs/upload.svg';

import '../css/Home.css';

class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selected_file: null,
      filename: "",
      browse_label: "Select File",
      service_requested: false
    }
  }

  componentDidMount() {
    window.addEventListener('dragover', function(e) {
      e.preventDefault();
    }, false);

    window.addEventListener('drop', function(e){
      e.preventDefault();
    }, false);
  }

  set_file_states = (file) => {
    this.setState({
      selected_file: file,
      filename: file.name,
      browse_label: "Change File"
    })
  }

  handleDrop = (file) => {
    console.log(file.name);
    this.set_file_states(file);
  }

  select_file = (e) => {
    this.set_file_states(e.target.files[0]);
  }

  getZipFile(data: any) {
    const blob = new Blob([data], {'type':"application/octet-stream"});
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = "result.zip";
    a.click();
  }

  handleError = (err) => {
    if(err.response) {
        const reader = new FileReader();

        reader.readAsText(err.response.data);

        reader.onload = function() {
          console.log(reader.result);
          alert(reader.result);
        };

        reader.onerror = function() {
          console.log(reader.error);
        };
    }
  }

  upload_file = () => {
    if(this.state.selected_file == null) {
      alert('Please select a file before uploading');
      return;
    }

    var formData = new FormData();
    formData.append('file', this.state.selected_file)

    axios.post('http://localhost:5000/upload', formData , {
      headers: {
        'id': '001'
      }
    })
      .then(res => alert(res.data))
      .catch(error => {
        if(error.response) alert(error.response.data)
      })
  }

  perform_task1 = () => {
    var filename = this.state.filename

    if(filename == "") {
      alert('Please select a query file before this operation')
      return;
    }

    this.setState({service_requested: true});

    axios.get('http://localhost:5000/filter_compoundID', {
      headers: {
        'id': '001',
        'filename': filename,
        'Cache-Control':  'no-cache, no-store, must-revalidate, post-check=0, pre-check=0',
        'Pragma': 'no-cache'
      },
      responseType: "blob"
    })
    .then(res => {
      this.getZipFile(res.data);
      this.setState({service_requested: false});
    })
    .catch(error => {
      this.handleError(error);
      this.setState({service_requested: false});
    })
  }

  perform_task2 = () => {
    var filename = this.state.filename;

    if(filename == "") {
      alert('Please select a query file before this operation')
      return;
    }

    this.setState({service_requested: true});

    axios.get('http://localhost:5000/roundoff_retention', {
      headers: {
        'id': '001',
        'filename': filename,
        'Cache-Control':  'no-cache, no-store, must-revalidate, post-check=0, pre-check=0',
        'Pragma': 'no-cache'
      },
      responseType: "blob"
    })
    .then(res => {
      this.getZipFile(res.data);
      this.setState({service_requested: false});
    })
    .catch(error => {
      this.handleError(error);
      this.setState({service_requested: false});
    }
    )
  }

  perform_task3 = () => {
    var filename = this.state.filename;

    if(filename == "") {
      alert('Please select a query file before this operation')
      return;
    }

    this.setState({service_requested: true});

    axios.get('http://localhost:5000/find_mean', {
      headers: {
        'id': '001',
        'filename': filename,
        'Cache-Control':  'no-cache, no-store, must-revalidate, post-check=0, pre-check=0',
        'Pragma': 'no-cache'
      },
      responseType: "blob"
    })
    .then(res => {
      this.getZipFile(res.data);
      this.setState({service_requested: false});
    })
    .catch(error => {
      this.handleError(error);
      this.setState({service_requested: false});
    })
  }

  render() {
    return(
      <div className = "page_container">
        <Navbar />

        <div className = "file_manager_container">

          <div className = "file_select_container">

            <DragAndDrop handleDrop={this.handleDrop}>

              <div className = "drag_drop_ui_container">
                <Upload_Icon fill = '#757575' height = '4rem'/>
                <label className = "label1"> Drag and Drop files here</label>
                <label className = "label2"> OR </label>
                <input type = "file" id = "select_file" onChange = {this.select_file} hidden />
                <label for = "select_file" className = "browse_label"> {this.state.browse_label} </label>
                <label className = "label3"> {this.state.filename} </label>
              </div>

            </DragAndDrop>

            <button className = "upload_btn" onClick = {this.upload_file}> Upload File </button>

          </div>

          <div className = "query_list_container">

            <div className = "query_container">
              <h3> Task1: Split into 3 datasets </h3>
              <label className = "query_desc_label"> Split the input data into 3 child datasets based upon if their Compound ID ends with LPC, PC or plasmalogen </label>

              <div className = "form_container">
                <input type = "text" readonly="readonly" placeholder = "File name" id = "input1" value = {this.state.filename} oninput = "handle" />
                <button className = "submit_btn" onClick = {this.perform_task1} disabled = {this.state.service_requested}> Submit </button>
              </div>

            </div>

            <div className = "query_container">
              <h3> Task2: Roundoff Retention time </h3>
              <label className = "query_desc_label"> Roundoff the retention time of samples to the nearest natural number </label>

              <div className = "form_container">
                <input type = "text" readonly="readonly" placeholder = "File name" value = {this.state.filename} />
                <button className = "submit_btn" onClick = {this.perform_task2} disabled = {this.state.service_requested}> Submit </button>
              </div>

            </div>

            <div className = "query_container">
              <h3> Task3: Mean of metabolites with same rounded off retention </h3>
              <label className = "query_desc_label"> After task 2, find mean of all the metabolites which have same Rounded off Retention time across all the samples </label>

              <div className = "form_container">
                <input type = "text" readonly="readonly" placeholder = "Filename" value = {this.state.filename} />
                <button className = "submit_btn" onClick = {this.perform_task3} disabled = {this.state.service_requested}> Submit </button>
              </div>

            </div>

          </div>

        </div>

      </div>
    );

  }
}

export default Home;
