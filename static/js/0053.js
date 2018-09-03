'use strict';

(function () {
  var ids = ['pak', 'pal', 'pjk', 'pan', 'pao'];
  var state = {
    items: ids.map(function (id) {
      return { id: id, data: {} };
    })
  };
  var fetchOptions = {
    timeout: 10000
  };

  var actions = {
    loadKampa: function (index) {
      return function (state, actions) {
        if (ids.length <= index) {
          return;
        }
        if (index === 0 || 100 <= state.items[index - 1].data.percentage) {
          var url = 'https://kampa.me/t/' + ids[index] + '.json';
          var data = fetchJsonp(url, fetchOptions).then(function (response) {
            return response.json();
          }).then(function (data) {
            actions.applyItems({ index: index, data: data });
            actions.loadKampa(index + 1);
          }).catch(function (err) {
            console.error(url, err.status, err);
          });
        }
      };
    },
    applyItems: function (params) {
      return function (state, actions) {
        var items = [].concat(state.items);
        items[params.index] = { id: ids[params.index], data: params.data };
        return { items: items };
      };
    }
  };

  var KampaItem = function ({ kampaId, secret, data }) {
    return !secret ? hyperapp.h(
      'a',
      { href: data.kmp_page },
      hyperapp.h(
        'ul',
        { className: 'list-inline' },
        hyperapp.h(
          'li',
          { className: 'pic' },
          hyperapp.h('img', { src: data.pic, width: '48' })
        ),
        hyperapp.h(
          'li',
          { className: 'percentage' },
          hyperapp.h(
            'div',
            null,
            data.title
          ),
          hyperapp.h(
            'div',
            { className: 'progress' },
            hyperapp.h(
              'div',
              { className: 'progress-bar progress-bar-striped active',
                role: 'progressbar',
                'aria-valuenow': data.percentage < 100 ? data.percentage : 100,
                'aria-valuemin': '0',
                'aria-valuemax': '100',
                style: { width: (data.percentage < 100 ? data.percentage : 100) + '%' } },
              hyperapp.h(
                'span',
                null,
                data.percentage,
                '%'
              )
            )
          )
        )
      )
    ) : hyperapp.h(
      'ul',
      { className: 'list-inline' },
      hyperapp.h(
        'li',
        { className: 'pic' },
        hyperapp.h('i', { className: 'fa fa-question-circle fa-3x', 'aria-hidden': 'true' })
      ),
      hyperapp.h(
        'li',
        { className: 'percentage' },
        hyperapp.h(
          'div',
          null,
          '??????????'
        ),
        hyperapp.h(
          'div',
          { className: 'progress' },
          hyperapp.h(
            'div',
            { className: 'progress-bar progress-bar-striped active',
              role: 'progressbar',
              'aria-valuenow': '',
              'aria-valuemin': '0',
              'aria-valuemax': '100',
              style: { width: '0%' } },
            hyperapp.h(
              'span',
              null,
              '0%'
            )
          )
        )
      )
    );
  };

  var view = function (state, actions) {
    return hyperapp.h(
      'ul',
      { className: 'list-unstyled' },
      hyperapp.h('hr', null),
      state.items.map(function (item, index) {
        return hyperapp.h(
          'li',
          { key: item.id },
          hyperapp.h(KampaItem, { kampaId: item.id,
            secret: index === 0 ? false : !state.items[index - 1].data.percentage ? true : state.items[index - 1].data.percentage < 100,
            data: item.data }),
          hyperapp.h('hr', null)
        );
      })
    );
  };
  var kampaItems = hyperapp.app(state, actions, view, document.getElementById('content'));
  kampaItems.loadKampa(0);
})();