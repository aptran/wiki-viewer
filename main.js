$(document).ready(function(){
	/* Open random wiki page in viewer or new tab */
	$("#randomPageBtn").on("click", function(){
		if($(window).width() > 992)
			$("#wikiFrame").attr("src", "http://en.wikipedia.org/wiki/Special:Random");
		else
			window.open("http://en.wikipedia.org/wiki/Special:Random", "_blank");
	});

	/* Open wiki article in viewer or new tab */
	$(".search-result").on("click", function(e){
		e.preventDefault();
		if($(window).width() > 992)
			$("#wikiFrame").attr("src", $(this).attr("href"));
		else
			window.open($(this).attr("href"), "_blank");
	});

	/* Handle search button click */
	$("#searchBtn").on("click", function(){
		verifySearchTerms($("#searchTerms").val());
	});

	/* Verify non empty search term */
	function verifySearchTerms(searchTerms) {
		if(searchTerms === '') { 
			$("#alert").text("Please input search terms.");
			$("#alert").css("display", "block");
		}
		else { 
			$("#alert").css("display", "none");
			callWikiAPI(searchTerms); 
		}
	}

	/* Call wiki search API */
	var wikiURL = "https://en.wikipedia.org/w/api.php?action=query&list=prefixsearch&format=json&titles=Main%20Page";
	function callWikiAPI(searchTerms) {
		$.ajax({
			url: wikiURL,
			data: {
				srsearch: searchTerms
			},
			success: function(response) {
				formatSearchResults(response);
			}
		});
	}

	/* Display list of search results */
	function formatSearchResults(response) {
		var searchResults = response['query']['search'];
		if(searchResults.length === 0) {
			$("#alert").text("Unable to find any matches.");
			$("#alert").css("display", "block");
		}
		else {
			$(".search-result").remove();

			for(var i = 0; i < searchResults.length; i++) {
				var template = $("#searchResultTemplate").clone();
				template.find(".page-title").html(searchResults[i]['title']);
				template.find(".page-snippet").html(searchResults[i]['snippet']);
				template.attr("id", "article"+i);
				template.attr("href", searchResults[i]['title'].replace(" ", "_"));
				template.appendTo($("#searchPanel"));
			}
		}
	}

});
