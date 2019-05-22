function getURLParameter(filter) {
  return decodeURIComponent((new RegExp('[?|&]' + filter + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [null, ''])[1].replace(/\+/g, '%20')) || null;
};

function getResources(filtervalue) {

  $().SPServices({
    operation: "GetListItems",
    async: false,
    listName: "{5DC5E36E-6D21-43D3-8212-8D04CF137E21}",
    CAMLQuery: "<Query><OrderBy><FieldRef Name='BaseName' Ascending='TRUE' /></OrderBy></Query>",
    CAMLViewFields: "<ViewFields Properties='True' />",
    completefunc: function (xData, Status) {
      $(xData.responseXML).SPFilterNode("z:row").each(function () {

        var ID = $(this).attr("ows_ID"),
          title = $(this).attr("ows_BaseName") || '',
          url = $(this).attr("ows_EncodedAbsUrl") || '',
          contentType = $(this).attr("ows_ContentType") || '',
          category = $(this).attr("ows_Category") || '',
          categoryClass = category.replace(/ /g, '-').toLowerCase(),
          typeIcon = '',
          type = '';

        if (contentType == "Link to a Document") {
          type = 'Link'
        } else if (contentType == "Document") {
          url += "?Web=1";
          type = contentType;
        } else {
          type = contentType;
        }

        typeIcon = getIcon(type); // see function below. Uses switch case to determine respective material icon

        var item = '<div class="col-md-4 col-sm-6 filter-item ' + categoryClass + '">' +
          '<div class="card">' +
          '<div class="card-body ">' +
          '<h6 class="card-category"><i class="material-icons">' + typeIcon + '</i> ' + type + '</h6>' +
          '<h4 class="card-title">' +
          '<a href="' + url + '">' + title + '</a>' +
          '</h4></div></div></div>';

        $('#grid').append(item);

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
  var $grid = $('#grid').isotope({
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
};

function getIcon(type) {

  var icon = '';
  switch (type) {

    case 'Document':
      icon = "description";
      break;

    case 'Link':
      icon = "link";
      break;

    case 'Video':
      icon = "videocam";
      break;

    default:
      icon = "class";

  }
  return icon;

};

$(document).ready(function () {
  //check for "?filter=XXX" in the url
  var initFilter = window.location.search.indexOf('?filter=') > -1 ? getURLParameter('filter') : null;

  getResources(initFilter);
});
