function getURLParameter(filter) {
  return decodeURIComponent((new RegExp('[?|&]' + filter + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [null, ''])[1].replace(/\+/g, '%20')) || null;
};

function getFAQs(filtervalue) {
  $().SPServices({
    operation: "GetListItems",
    async: false,
    listName: "{A142E42D-8EEE-4C06-97DE-4E10C0DDF943}",
    CAMLQuery: "<Query><OrderBy><FieldRef Name='SortOrder' Ascending='TRUE' /></OrderBy></Query>",
    CAMLViewFields: "<ViewFields Properties='True' />",
    completefunc: function (xData, Status) {
      $(xData.responseXML).SPFilterNode("z:row").each(function () {

        var ID = $(this).attr("ows_ID"),
          question = $(this).attr("ows_Title") || '',
          answer = $(this).attr("ows_Answer") || '',
          category = $(this).attr("ows_Category") || '',
          categoryClass = category.replace(/ /g, '-').toLowerCase();

        var item = '<div class="card card-collapse filter-item ' + categoryClass + '">' +
          '<div class="card-header" role="tab" id="heading_' + ID + '">' +
          '<h5 class="mb-0"><a class="collapsed" data-toggle="collapse" href="#collapse_' + ID + '" aria-expanded="false" aria-controls="collapse_' + ID + '">' +
          question +
          '<i class="material-icons">keyboard_arrow_down</i></a></h5>' +
          '</div><div id="collapse_' + ID + '" class="collapse" role="tabpanel" aria-labelledby="heading_' + ID + '" data-parent="#accordion">' +
          '<div class="card-body">' +
          answer +
          '</div></div></div>';

        $('#accordion').append(item);

      });

      initIsotope(filtervalue);

    }
    
  });
};

function initIsotope(filtervalue) {

  // store filter for each group
  var buttonFilters = {};
  var buttonFilter;
  // quick search regex
  var qsRegex;

  // init Isotope
  var $grid = $('#collapse').isotope({
    itemSelector: '.filter-item',
    filter: function () {
      var $this = $(this);
      var searchResult = qsRegex ? $this.text().match(qsRegex) : true;
      var buttonResult = buttonFilter ? $this.is(buttonFilter) : true;
      return searchResult && buttonResult;
    },
  });

  $('.filters').on('click', 'button', function () {
    var $this = $(this);
    // get group key
    var $buttonGroup = $this.parents('.button-list');
    var filterGroup = $buttonGroup.attr('data-filter-group');
    // set filter for group
    buttonFilters[filterGroup] = $this.attr('data-filter');
    // combine filters
    buttonFilter = concatValues(buttonFilters);
    // Isotope arrange
    $grid.isotope();
  });

  // use value of search field to filter
  var $quicksearch = $('#quicksearch').keyup(debounce(function () {
    qsRegex = new RegExp($quicksearch.val(), 'gi');
    $grid.isotope();
  }));

  // change active class on buttons
  $('.button-list').each(function (i, buttonGroup) {
    var $buttonGroup = $(buttonGroup);
    $buttonGroup.on('click', 'button', function () {
      $buttonGroup.find('.active').removeClass('active');
      $(this).addClass('active');
    });
  });

// if there was a filter value, trigger a click on the respective button  
if (filtervalue) {
  initFilt = "." + filtervalue;
  filterbtn = "button[data-filter='" + initFilt + "']"
  $(filterbtn).trigger('click')
}
  // flatten object by concatting values
  function concatValues(obj) {
    var value = '';
    for (var prop in obj) {
      value += obj[prop];
    }
    return value;
  }

  // debounce so filtering doesn't happen every millisecond
  function debounce(fn, threshold) {
    var timeout;
    threshold = threshold || 100;
    return function debounced() {
      clearTimeout(timeout);
      var args = arguments;
      var _this = this;

      function delayed() {
        fn.apply(_this, args);
      }
      timeout = setTimeout(delayed, threshold);
    };
  }

  $('.filter-item').on('hidden.bs.collapse', function () {
    $grid.isotope();
  })

  $('.filter-item').on('shown.bs.collapse', function () {
    $grid.isotope();
  })
}

$(document).ready(function () {
//check for "?filter=XXX" in the url
var initFilter = window.location.search.indexOf('?filter=') > -1 ? getURLParameter('filter') : null;

getFAQs(initFilter);
});