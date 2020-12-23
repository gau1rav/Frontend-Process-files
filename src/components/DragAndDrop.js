import React from 'react';

class DragAndDrop extends React.Component {

  constructor(props) {
    super(props);

    this.state = {dragging: false}
  }

  dropRef = React.createRef();

  handle_dragStart = (e) => {
    e.preventDefault(); //prevents default behaviour of browser when something is dragged or dropped
    e.stopPropagation(); // stops from the event from being propagated from parents to children

    e.dataTransfer.clearData()
  }

  handle_dragIn = (e) => {
    e.preventDefault(); // prevents default behaviour of browser when something is dragged or dropped
    e.stopPropagation(); // stops from the event from being propagated from parents to children

    this.drag_counter++;

    // check if the drag event has some file with it -- if user is dragging in a file
    if(e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      this.setState({dragging: true});
    }
  }

  handle_dragOut = (e) => {
    e.preventDefault(); // prevents default behaviour of browser when something is dragged or dropped
    e.stopPropagation(); // stops from the event from being propagated from parents to children

    if(--this.drag_counter > 0) return; // prevents filckering caused by nested setState calls
    this.setState({dragging: false});
  }

  handle_drag = (e) => {
    e.preventDefault(); // prevents default behaviour of browser when something is dragged or dropped
    e.stopPropagation(); // stops from the event from being propagated from parents to children
  }

  handle_drop = (e) => {
    e.preventDefault(); //prevents default behaviour of browser when something is dragged or dropped
    e.stopPropagation(); // stops from the event from being propagated from parents to children

    this.setState({dragging: false});

    if(e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      this.props.handleDrop(e.dataTransfer.files[0]);

      this.drag_counter = 0;
    }
  }

  componentDidMount() {
    let div = this.dropRef.current;
    this.drag_counter = 0;

    div.addEventListener('dragstart', this.handle_dragStart);
    div.addEventListener('dragenter', this.handle_dragIn);
    div.addEventListener('dragleave', this.handle_dragOut);
    div.addEventListener('dragover', this.handle_drag); // overwritting this event will prevent the default browser behabiour of opening dragged file
    div.addEventListener('drop', this.handle_drop);
  }

  componentWillUnmount() {
    let div = this.dropRef.current;

    div.removeEventListener('dragenter', this.handle_dragIn);
    div.removeEventListener('dragleave', this.handle_dragOut);
    div.removeEventListener('dragover', this.handle_drag);
    div.removeEventListener('drop', this.handleDrop);
  }

  render() {
    return(
      <div style = {{position: 'relative'}} ref = {this.dropRef}>
        {
          this.state.dragging &&
            <div
              style = {{
                border: 'dashed grey 4px',
                backgroundColor: 'rgba(255,255,255,.8)',
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
                zIndex: 9999
              }}>
              <div
                style = {{
                  position: 'absolute',
                  top: '50%',
                  right: 0,
                  left: 0,
                  textAlign: 'center',
                  color: 'grey',
                  fontSize: 36
                }}>
                Drop File here
              </div>
            </div>
        }
        {this.props.children}
      </div>
    )
  }
}

export default DragAndDrop;
