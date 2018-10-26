/* global $ noteful api store */
'use strict';

$(document).ready(function () {
  noteful.bindEventListeners();

  Promise.all([
    api.search('/api/notes'),
    api.search('/api/folders')
    // api.search('/api/tags')
  ])
    .then(([
      notes,
      folders
      //tags
    ]) => {
      store.notes.results = notes;
      store.folders = folders;
      console.log(JSON.stringify(store.notes.results.results));
      //store.tags = tags;
      noteful.render();
    });

});
