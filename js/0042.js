'use strict';

(function () {
  var ids = ['jga', 'jgb', 'jge', 'jgd', 'jgc'];

  function loadKampa(index, component) {
    if (ids.length <= index) {
      return;
    }
    if (index === 0 || 100 <= component.state.items[index - 1].data.percentage) {
      var url = 'https://kampa.me/t/' + ids[index] + '.json';
      $.ajax({
        url: url,
        dataType: 'jsonp',
        jsonp: 'callback',
        jsonpCallback: 'callback',
        cache: false
      }).done(function (data) {
        var items = [].concat(component.state.items);
        items[index] = { id: ids[index], data: data };
        component.setState({ items: items });
        loadKampa(index + 1, component);
      }).fail(function (xhr, status, err) {
        console.error(url, status, err.toString());
      });
    }
  }

  var KampaItems = React.createClass({
    displayName: 'KampaItems',

    getInitialState: function getInitialState() {
      var items = ids.map(function (id) {
        return { id: id, data: {} };
      });
      return {
        items: items
      };
    },
    componentDidMount: function componentDidMount() {
      loadKampa(0, this);
    },
    render: function render() {
      var state = this.state;
      return React.createElement(
        'ul',
        { className: 'list-unstyled' },
        React.createElement('hr', null),
        state.items.map(function (item, index) {
          return React.createElement(
            'li',
            { key: item.id },
            React.createElement(KampaItem, { kampaId: item.id,
              secret: index === 0 ? false : !state.items[index - 1].data.percentage ? true : state.items[index - 1].data.percentage < 100,
              data: item.data }),
            React.createElement('hr', null)
          );
        })
      );
    }
  });
  var KampaItem = React.createClass({
    displayName: 'KampaItem',

    render: function render() {
      return !this.props.secret ? React.createElement(
        'a',
        { href: this.props.data.kmp_page },
        React.createElement(
          'ul',
          { className: 'list-inline' },
          React.createElement(
            'li',
            { className: 'pic' },
            React.createElement('img', { src: this.props.data.pic, width: '48' })
          ),
          React.createElement(
            'li',
            { className: 'percentage' },
            React.createElement(
              'div',
              null,
              this.props.data.title
            ),
            React.createElement(
              'div',
              { className: 'progress' },
              React.createElement(
                'div',
                { className: 'progress-bar progress-bar-striped active',
                  role: 'progressbar',
                  'aria-valuenow': this.props.data.percentage < 100 ? this.props.data.percentage : 100,
                  'aria-valuemin': '0',
                  'aria-valuemax': '100',
                  style: { width: (this.props.data.percentage < 100 ? this.props.data.percentage : 100) + '%' } },
                React.createElement(
                  'span',
                  null,
                  this.props.data.percentage,
                  '%'
                )
              )
            )
          )
        )
      ) : React.createElement(
        'ul',
        { className: 'list-inline' },
        React.createElement(
          'li',
          { className: 'pic' },
          React.createElement('i', { className: 'fa fa-question-circle fa-3x', 'aria-hidden': 'true' })
        ),
        React.createElement(
          'li',
          { className: 'percentage' },
          React.createElement(
            'div',
            null,
            '??????????'
          ),
          React.createElement(
            'div',
            { className: 'progress' },
            React.createElement(
              'div',
              { className: 'progress-bar progress-bar-striped active',
                role: 'progressbar',
                'aria-valuenow': '',
                'aria-valuemin': '0',
                'aria-valuemax': '100',
                style: { width: '0%' } },
              React.createElement(
                'span',
                null,
                '0%'
              )
            )
          )
        )
      );
    }
  });

  ReactDOM.render(React.createElement(KampaItems, null), document.getElementById('content'));
})();