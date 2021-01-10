// Algolia Config
document.addEventListener("DOMContentLoaded", function (event) {
  /* Instantiate instantsearch.js */
  const searchClient = algoliasearch(
    algolia.application_id,
    algolia.search_api_key
  );

  const search = instantsearch({
    appId: algolia.application_id,
    apiKey: algolia.search_api_key,
    indexName: algolia.indices.searchable_posts.name,
    searchClient,
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

  /* Search box widget */
  if (jQuery("#algolia-search-box").length > 0) {
    const searchBoxWithPanel = instantsearch.widgets.panel({
      templates: {
        header: "Search",
      },
    })(instantsearch.widgets.searchBox);

    const searchBox = searchBoxWithPanel({
      container: "#algolia-search-box",
      placeholder: "Search for...",
      wrapInput: false,
      poweredBy: algolia.powered_by_enabled,
    });

    search.addWidget(searchBox);
  }

  /* Stats widget */
  if (jQuery("#algolia-stats").length > 0) {
    const paginationWithPanel = instantsearch.widgets.panel({
      templates: {
        header: "Stats",
      },
    })(instantsearch.widgets.stats);

    const stats = paginationWithPanel({
      container: "#algolia-stats",
    });

    search.addWidget(stats);
  }

  /* Pagination widget */
  if (jQuery("#algolia-pagination").length > 0) {
    const paginationWithPanel = instantsearch.widgets.panel({
      templates: {
        header: "Pagination",
      },
    })(instantsearch.widgets.pagination);

    const pagination = paginationWithPanel({
      container: "#algolia-pagination",
    });

    search.addWidget(pagination);
  }

  /* Post types refinement widget */
  if (jQuery("#facet-post-types").length > 0) {
    const postTypesWithPanel = instantsearch.widgets.panel({
      templates: {
        header: "Post Types",
      },
    })(instantsearch.widgets.menu);

    const post_types = postTypesWithPanel({
      container: "#facet-post-types",
      attribute: "post_type_label",
      sortBy: ["isRefined:desc", "count:desc", "name:asc"],
      limit: 10,
    });

    search.addWidget(post_types);
  }

  /* Categories refinement widget */
  if (jQuery("#facet-categories").length > 0) {
    const categoriesWithPanel = instantsearch.widgets.panel({
      templates: {
        header: "Categories",
      },
    })(instantsearch.widgets.hierarchicalMenu);

    const categories = categoriesWithPanel({
      container: "#facet-categories",
      separator: " > ",
      sortBy: ["count"],
      attributes: [
        "taxonomies_hierarchical.category.lvl0",
        "taxonomies_hierarchical.category.lvl1",
        "taxonomies_hierarchical.category.lvl2",
      ],
    });

    search.addWidget(categories);
  }

  /* Tags refinement widget */
  if (jQuery("#facet-tags").length > 0) {
    const tagsWithPanel = instantsearch.widgets.panel({
      templates: {
        header: "Tags",
      },
    })(instantsearch.widgets.refinementList);

    const tags = tagsWithPanel({
      container: "#facet-tags",
      attribute: "taxonomies.post_tag",
      operator: "and",
      limit: 15,
      sortBy: ["isRefined:desc", "count:desc", "name:asc"],
    });

    search.addWidget(tags);
  }

  /* Users refinement widget */
  if (jQuery("#facet-users").length > 0) {
    const usersWithPanel = instantsearch.widgets.panel({
      templates: {
        header: "Authors",
      },
    })(instantsearch.widgets.menu);

    const users = usersWithPanel({
      container: "#facet-users",
      attribute: "post_author.display_name",
      sortBy: ["isRefined:desc", "count:desc", "name:asc"],
      limit: 10,
    });

    search.addWidget(users);
  }

  /* Hits widget */
  if (jQuery("#algolia-hits").length > 0) {
    const hitsWithPanel = instantsearch.widgets.panel({
      templates: {
        header: "Hits",
      },
    })(instantsearch.widgets.hits);

    const hits = hitsWithPanel({
      container: "#algolia-hits",
      hitsPerPage: 10,
      templates: {
        empty: 'No results were found for "<strong>{{query}}</strong>".',
        // item: wp.template("instantsearch-hit"),
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
          hit._snippetResult = replace_highlights_recursive(hit._snippetResult);

          return hit;
        },
      },
    });

    search.addWidget(hits);
  }

  search.start();

  // if (jQuery("#algolia-search-box").length > 0) {
  //   if (
  //     algolia.indices.searchable_posts === undefined &&
  //     jQuery(".admin-bar").length > 0
  //   ) {
  //     alert(
  //       "It looks like you haven't indexed the searchable posts index. Please head to the Indexing page of the Algolia Search plugin and index it."
  //     );
  //   }

  //   /* Instantiate instantsearch.js */
  //   const searchClient = algoliasearch(algolia.application_id, algolia.search_api_key);
  //   var search = instantsearch({
  //     appId: algolia.application_id,
  //     apiKey: algolia.search_api_key,
  //     indexName: algolia.indices.searchable_posts.name,
  //     searchClient,
  //     urlSync: {
  //       mapping: {
  //         q: "s",
  //       },
  //       trackedParameters: ["query"],
  //     },
  //     searchParameters: {
  //       facetingAfterDistinct: true,
  //       highlightPreTag: "__ais-highlight__",
  //       highlightPostTag: "__/ais-highlight__",
  //     },
  //   });

  //   /* Stats widget */
  //   if (jQuery("#algolia-stats").length > 0) {
  //     search.addWidget(
  //       instantsearch.widgets.stats({
  //         container: "#algolia-stats",
  //       })
  //     );
  //   }

  //   /* Search box widget */
  //   if (jQuery("#algolia-search-box").length > 0) {
  //     search.addWidget(
  //       instantsearch.widgets.searchBox({
  //         container: "#algolia-search-box",
  //         placeholder: "Search for...",
  //         wrapInput: false,
  //         poweredBy: algolia.powered_by_enabled,
  //       })
  //     );
  //   }

  //   /* Hits widget */
  //   if (jQuery("#algolia-hits").length > 0) {
  //     search.addWidget(
  //       instantsearch.widgets.hits({
  //         container: "#algolia-hits",
  //         hitsPerPage: 10,
  //         templates: {
  //           empty: 'No results were found for "<strong>{{query}}</strong>".',
  //           item: wp.template("instantsearch-hit"),
  //         },
  //         transformData: {
  //           item: function (hit) {
  //             function replace_highlights_recursive(item) {
  //               if (item instanceof Object && item.hasOwnProperty("value")) {
  //                 item.value = _.escape(item.value);
  //                 item.value = item.value
  //                   .replace(/__ais-highlight__/g, "<em>")
  //                   .replace(/__\/ais-highlight__/g, "</em>");
  //               } else {
  //                 for (var key in item) {
  //                   item[key] = replace_highlights_recursive(item[key]);
  //                 }
  //               }
  //               return item;
  //             }

  //             hit._highlightResult = replace_highlights_recursive(
  //               hit._highlightResult
  //             );
  //             hit._snippetResult = replace_highlights_recursive(
  //               hit._snippetResult
  //             );

  //             return hit;
  //           },
  //         },
  //       })
  //     );
  //   }

  //   /* Pagination widget */
  //   if (jQuery("#algolia-pagination").length > 0) {
  //     search.addWidget(
  //       instantsearch.widgets.pagination({
  //         container: "#algolia-pagination",
  //       })
  //     );
  //   }

  //   /* Post types refinement widget */
  //   if (jQuery("#facet-post-types").length > 0) {
  //     search.addWidget(
  //       instantsearch.widgets.menu({
  //         container: "#facet-post-types",
  //         attributeName: "post_type_label",
  //         sortBy: ["isRefined:desc", "count:desc", "name:asc"],
  //         limit: 10,
  //         templates: {
  //           header: '<h3>Post Type</h3>',
  //         },
  //       })
  //     );
  //   }

  //   /* Categories refinement widget */
  //   if (jQuery("#facet-categories").length > 0) {
  //     search.addWidget(
  //       instantsearch.widgets.hierarchicalMenu({
  //         container: "#facet-categories",
  //         separator: " > ",
  //         sortBy: ["count"],
  //         attributes: [
  //           "taxonomies_hierarchical.category.lvl0",
  //           "taxonomies_hierarchical.category.lvl1",
  //           "taxonomies_hierarchical.category.lvl2",
  //         ],
  //         templates: {
  //           header: '<h3>Categories</h3>',
  //         },
  //       })
  //     );
  //   }

  //   /* Tags refinement widget */
  //   if (jQuery("#facet-tags").length > 0) {
  //     search.addWidget(
  //       instantsearch.widgets.refinementList({
  //         container: "#facet-tags",
  //         attributeName: "taxonomies.post_tag",
  //         operator: "and",
  //         limit: 15,
  //         sortBy: ["isRefined:desc", "count:desc", "name:asc"],
  //         templates: {
  //           header: '<h3>Tags</h3>',
  //         },
  //       })
  //     );
  //   }

  //   /* Users refinement widget */
  //   if (jQuery("#facet-users").length > 0) {
  //     search.addWidget(
  //       instantsearch.widgets.menu({
  //         container: "#facet-users",
  //         attributeName: "post_author.display_name",
  //         sortBy: ["isRefined:desc", "count:desc", "name:asc"],
  //         limit: 10,
  //         templates: {
  //           header: '<h3>Authors</h3>',
  //         },
  //       })
  //     );
  //   }

  //   /* Start */
  //   search.start();

  //   jQuery("#algolia-search-box input").attr("type", "search").select();
  // }
});
