'use strict';
(function() {
  var ids = ['pak','pal','pjk','pan','pao'];
  var state = {
    items: ids.map(function(id) {
      return {id: id, data: {}};
    })
  };
  var fetchOptions = {
    timeout: 10000
  };

  var actions = {
    loadKampa: function(index) {return function(state, actions) {
      if (ids.length <= index) {
        return;
      }
      if (index === 0 || 100 <= state.items[index - 1].data.percentage) {
        var url = 'https://kampa.me/t/' + ids[index] + '.json';
        var data = fetchJsonp(url, fetchOptions).then(function(response) {
          return response.json()
        }).then(function(data){
          actions.applyItems({index: index, data: data});
          actions.loadKampa(index + 1);
        }).catch(function(err) {
          console.error(url, err.status, err);
        });
      }
    }},
    applyItems: function(params) {return function(state, actions) {
      var items = [].concat(state.items);
      items[params.index] = {id: ids[params.index], data: params.data};
      return {items: items};
    }}
  };

  var KampaItem = function({kampaId, secret, data}) {
    return !secret ? (
      <a href={data.kmp_page}>
        <ul className="list-inline">
          <li className="pic"><img src={data.pic} width="48"/></li>
          <li className="percentage">
            <div>{data.title}</div>
            <div className="progress">
              <div className="progress-bar progress-bar-striped active" 
                   role="progressbar" 
                   aria-valuenow={data.percentage < 100 ? data.percentage : 100} 
                   aria-valuemin="0" 
                   aria-valuemax="100" 
                   style={{width: (data.percentage < 100 ? data.percentage : 100)+'%'}}>
                <span>{data.percentage}%</span>
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
  };

  var view = function(state, actions) {
    return (
      <ul className="list-unstyled">
        <hr/>
        {state.items.map(function(item, index) {
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
  };
  var kampaItems = hyperapp.app(state, actions, view, document.getElementById('content'));
  kampaItems.loadKampa(0);
})();
