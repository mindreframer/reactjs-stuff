/**
 * @jsx React.DOM
 */

var React = require('react/lib/ReactWithAddons');
var Link = require('react-router-component').Link;
var STATIC_ROOT = require('./StaticRoot');
var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

function sortByAge(a, b) {
  return a.age - b.age;
}

function sortByName(a, b) {
  return a.name > b.name
    ? 1
    : a.name < b.name
      ? -1
      : 0;
}

function concatValues(obj) {
  return Object.keys(obj).reduce(function(prev, key){
    var val = obj[key];
    return prev + (typeof val === 'object' ? concatValues(val) : val);
  }, '');
}

var PhoneList = React.createClass({

  getInitialState: function() {
    return {
      filterValue: '',
      sortBy: 'name'
    };
  },

  handleFilterChange: function(event) {
    this.setState({
      filterValue: event.target.value
    });
  },

  handleSelect: function(event) {
    this.setState({
      sortBy: event.target.selectedOptions[0].value
    });
  },

  render: function() {
    var sortByFunction = this.state.sortBy === 'age' ? sortByAge : sortByName;
    var filterValue = this.state.filterValue;
    var filteredSortedPhones = this.props.phones.filter(function(phone) {
      return concatValues(phone).toLowerCase().indexOf(filterValue.toLowerCase()) !== -1;
    }).sort(sortByFunction).map(function(phone, i){
      return (
        <li className="thumbnail phone-listing" key={i}>
          <Link href={'/phones/' + phone.id} className="thumb">
            <img src={STATIC_ROOT + phone.imageUrl} />
          </Link>
          <Link href={'/phones/' + phone.id}>{phone.name}</Link>
          <p>{phone.snippet}</p>
        </li>
      );
    });
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-2">
            {/* Sidebar content */}
            <div>Search: <input value={this.state.filterValue} onChange={this.handleFilterChange} /></div>
            <div>
              Sort by: <select onChange={this.handleSelect}>
                <option value="name">Alphabetical</option>
                <option value="age">Newest</option>
              </select>
            </div>
          </div>
          <div className="col-md-10">
            {/* Body content */}
            <ul className="phones">
              <ReactCSSTransitionGroup transitionName="phone-listing">
                {filteredSortedPhones}
              </ReactCSSTransitionGroup>
            </ul>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = PhoneList;