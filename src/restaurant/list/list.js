import Component from 'can-component';
import DefineMap from 'can-define/map/';
import './list.less';
import view from './list.stache';
import Restaurant from 'place-my-order/models/restaurant';
import State from 'place-my-order/models/state';
import City from 'place-my-order/models/city';
import canDefineStream from 'can-define-stream-kefir';

export const ViewModel = DefineMap.extend({
  get states() {
    return State.getList({});
  },
  state: {
    type: 'string',
    value: null,
  },
  get cities() {
    let state = this.state;

    if(!state) {
      return null;
    }

    return City.getList({ state });
  },
  city: {
    type: 'string',
    stream: function(setStream) {
      var nullStream = this.toStream(".state").map(()=> null);
      return setStream.merge(nullStream);
    }
  },
  get restaurants() {
    let state = this.state;
    let city = this.city;

    if(state && city) {
      return Restaurant.getList({
        'address.state': state,
        'address.city': city
      });
    }

    return null;
  }
});

canDefineStream(ViewModel);

export default Component.extend({
  tag: 'pmo-restaurant-list',
  ViewModel,
  view
});
