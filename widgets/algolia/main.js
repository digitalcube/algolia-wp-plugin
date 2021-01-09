jQuery(function () {
  if (jQuery("#algolia-search-box").length > 0) {
    if (
      algolia.indices.searchable_posts === undefined &&
      jQuery(".admin-bar").length > 0
    ) {
      alert(
        "It looks like you haven't indexed the searchable posts index. Please head to the Indexing page of the Algolia Search plugin and index it."
      );
    }

    /* Instantiate instantsearch.js */
    var search = instantsearch({
      appId: algolia.application_id,
      apiKey: algolia.search_api_key,
      indexName: algolia.indices.searchable_posts.name,
      urlSync: {
        mapping: {
          q: "s",
        },
        trackedParameters: ["query"],
      },
      searchParameters: {
        facetingAfterDistinct: true,
        highlightPreTag: "__ais-highlight__",
        highlightPostTag: "__/ais-highlight__",
      },
    });

    /* Stats widget */
    if (jQuery("#algolia-search-box").length > 0) {
      search.addWidget(
        instantsearch.widgets.stats({
          container: "#algolia-stats",
        })
      );
    }

    /* Search box widget */
    if (jQuery("#algolia-search-box").length > 0) {
      search.addWidget(
        instantsearch.widgets.searchBox({
          container: "#algolia-search-box",
          placeholder: "Search for...",
          wrapInput: false,
          poweredBy: algolia.powered_by_enabled,
        })
      );
    }

    /* Hits widget */
    if (jQuery("#algolia-hits").length > 0) {
      search.addWidget(
        instantsearch.widgets.hits({
          container: "#algolia-hits",
          hitsPerPage: 10,
          templates: {
            empty: 'No results were found for "<strong>{{query}}</strong>".',
            item: wp.template("instantsearch-hit"),
          },
          transformData: {
            item: function (hit) {
              function replace_highlights_recursive(item) {
                if (item instanceof Object && item.hasOwnProperty("value")) {
                  item.value = _.escape(item.value);
                  item.value = item.value
                    .replace(/__ais-highlight__/g, "<em>")
                    .replace(/__\/ais-highlight__/g, "</em>");
                } else {
                  for (var key in item) {
                    item[key] = replace_highlights_recursive(item[key]);
                  }
                }
                return item;
              }

              hit._highlightResult = replace_highlights_recursive(
                hit._highlightResult
              );
              hit._snippetResult = replace_highlights_recursive(
                hit._snippetResult
              );

              return hit;
            },
          },
        })
      );
    }

    /* Pagination widget */
    if (jQuery("#algolia-pagination").length > 0) {
      search.addWidget(
        instantsearch.widgets.pagination({
          container: "#algolia-pagination",
        })
      );
    }

    /* Post types refinement widget */
    if (jQuery("#facet-post-types").length > 0) {
      search.addWidget(
        instantsearch.widgets.menu({
          container: "#facet-post-types",
          attributeName: "post_type_label",
          sortBy: ["isRefined:desc", "count:desc", "name:asc"],
          limit: 10,
          templates: {
            header: '<h3 class="widgettitle">Post Type</h3>',
          },
        })
      );
    }

    /* Categories refinement widget */
    if (jQuery("#facet-categories").length > 0) {
      search.addWidget(
        instantsearch.widgets.hierarchicalMenu({
          container: "#facet-categories",
          separator: " > ",
          sortBy: ["count"],
          attributes: [
            "taxonomies_hierarchical.category.lvl0",
            "taxonomies_hierarchical.category.lvl1",
            "taxonomies_hierarchical.category.lvl2",
          ],
          templates: {
            header: '<h3 class="widgettitle">Categories</h3>',
          },
        })
      );
    }

    /* Tags refinement widget */
    if (jQuery("#facet-tags").length > 0) {
      search.addWidget(
        instantsearch.widgets.refinementList({
          container: "#facet-tags",
          attributeName: "taxonomies.post_tag",
          operator: "and",
          limit: 15,
          sortBy: ["isRefined:desc", "count:desc", "name:asc"],
          templates: {
            header: '<h3 class="widgettitle">Tags</h3>',
          },
        })
      );
    }

    /* Users refinement widget */
    if (jQuery("#facet-users").length > 0) {
      search.addWidget(
        instantsearch.widgets.menu({
          container: "#facet-users",
          attributeName: "post_author.display_name",
          sortBy: ["isRefined:desc", "count:desc", "name:asc"],
          limit: 10,
          templates: {
            header: '<h3 class="widgettitle">Authors</h3>',
          },
        })
      );
    }

    /* Start */
    search.start();

    jQuery("#algolia-search-box input").attr("type", "search").select();
  }
});
