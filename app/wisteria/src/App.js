import React, { Component } from 'react';
import Roadmap from "./components/Roadmap";
import moment from 'moment';

class App extends Component {
  render() {

      const viewStart = moment().subtract(2, 'week');
      const viewEnd = moment().add(5, 'month');

    return (
      <div className="App">
          <Roadmap
              viewStart={viewStart}
              viewEnd={viewEnd}
          />
      </div>
    );
  }
}

export default App;
