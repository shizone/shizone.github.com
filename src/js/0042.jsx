'use strict';
(function() {
  var ids = ['jga','jgb','jge','jgd','jgc'];

  function loadKampa(index, component) {
    if (ids.length <= index) {
      return;
    }
    if (index === 0 || 100 <= component.state.items[index - 1].data.percentage) {
      var url = 'http://kampa.me/t/' + ids[index] + '.json';
      $.ajax({
        url: url,
        dataType: 'jsonp',
        jsonp: 'callback',
        jsonpCallback: 'callback',
        cache: false
      }).done(function(data) {
        var items = [].concat(component.state.items);
        items[index] = {id: ids[index], data: data};
        component.setState({items: items});
        loadKampa(index + 1, component);
      }).fail(function(xhr, status, err) {
        console.error(url, status, err.toString());
      });
    }
  }

  var KampaItems = React.createClass({
    getInitialState: function() {
      var items = ids.map(function(id) {
        return {id: id, data: {}}
      });
      return {
        items: items
      };
    },
    componentDidMount: function() {
      loadKampa(0, this);
    },
    render: function() {
      var state = this.state;
      return (
        <ul className="list-unstyled">
            <hr/>
            {state.items.map(function(item, index){
              return (
                <li key={item.id}>
                  <KampaItem kampaId={item.id} 
                             secret={index === 0 ? false : !state.items[index - 1].data.percentage ? true : state.items[index - 1].data.percentage < 100} 
                             data={item.data}/>
                  <hr/>
                </li>
              );
            })}
        </ul>
      );
    }
  });
  var KampaItem = React.createClass({
    render: function() {
      return !this.props.secret ? (
        <a href={this.props.data.kmp_page}>
          <ul className="list-inline">
            <li className="pic"><img src={this.props.data.pic} width="48"/></li>
            <li className="percentage">
              <div>{this.props.data.title}</div>
              <div className="progress">
                <div className="progress-bar progress-bar-striped active" 
                     role="progressbar" 
                     aria-valuenow={this.props.data.percentage < 100 ? this.props.data.percentage : 100} 
                     aria-valuemin="0" 
                     aria-valuemax="100" 
                     style={{width: (this.props.data.percentage < 100 ? this.props.data.percentage : 100)+'%'}}>
                  <span>{this.props.data.percentage}%</span>
                </div>
              </div>
            </li>
          </ul>
        </a>
      ) : (
        <ul className="list-inline">
          <li className="pic"><i className="fa fa-question-circle fa-3x" aria-hidden="true"></i></li>
          <li className="percentage">
            <div>??????????</div>
            <div className="progress">
              <div className="progress-bar progress-bar-striped active" 
                   role="progressbar" 
                   aria-valuenow="" 
                   aria-valuemin="0" 
                   aria-valuemax="100" 
                   style={{width: '0%'}}>
                <span>0%</span>
              </div>
            </div>
          </li>
        </ul>
      );
    }
  });

  ReactDOM.render(
    <KampaItems />,
    document.getElementById('content')
  );
})();
