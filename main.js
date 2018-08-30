const api = 'http://api.icndb.com/jokes/random/';

new Vue({

  el: '.container',

  data: {
    quotes: [],
    favs: JSON.parse(localStorage.getItem('chuck-norris-fav-quotes') || '[]'),
    loading: false,
    timerId: null
  },

  watch: {
    favs: {
      handler: function (favs) {
        localStorage.setItem('chuck-norris-fav-quotes', JSON.stringify(favs))
      },
      deep: true
    }
  },

  methods: {

    loadMore: async function() {
      const quotes = await this.request(10);
      this.quotes = [ ...this.quotes, ...quotes.value ];
    },

    startTimer: function() {
      this.timerId = setInterval( () => this.tickTimer(), 5000);
    },

    tickTimer: async function() {
      const quote = await this.request(1);
      this.add(quote.value[0]);

      if (this.reachedFavLimit()) {
        this.stopTimer();
      }
    },

    stopTimer: function() {
      clearInterval(this.timerId);
      this.timerId = null;
    },

    reachedFavLimit: function() {
      return this.favs.length >= 10;
    },

    containsFav: function(quoteId) {
      return this.favs.find( f => f.id === quoteId) != null;
    },

    add: function(quote) {
      if (!this.reachedFavLimit() && !this.containsFav(quote.id)) {
        this.favs.push(quote);
      }
    },

    remove: function(quote) {
      this.favs.splice(this.favs.indexOf(quote), 1)
    },

    request: async function(limit) {
      this.loading = true;

      const response = await fetch(`${api}${limit}`);
      const quotes = await response.json();

      this.loading = false;

      return quotes;
    }
  }
});
