var poller = new Poller();

poller.addFunc(linkTicket);
poller.addFunc(formatLinks);

// start the poller
poller.start();


function linkTicket () {

  var prTitle    = $('.js-issue-title')
    , titleText  = prTitle.text()
    , match      = titleText.match(/(^[A-Z]+-[0-9]+)(\s.*)/) || []
    , jiraTicket = match[1]
    , trailing   = match[2]

  // Convert the ticket number to a link 
  if (jiraTicket) {
    var href = 'https://brander.atlassian.net/browse/' + jiraTicket
      , link = '<a href="' + href + '">' + jiraTicket + '</a>';

    prTitle.empty();
    prTitle.append(link);
    prTitle.append(trailing)
  }
}

function formatLinks () {
  $('.comment-body').each(function (index, element) {
    // get the comment text and any localhost links
    var comment = $(element)
      , text    = comment.html()
      , hrefs   = text.match(/(http:\/\/localhost:.*)\s/g);

    // if we already formattted the links in this comment, return
    if (comment.find('a.added').length) { return; }

    // replace the links in the text string with link elements
    _.each(hrefs, function (href) {

      //make sure to preserve trailing elements, like <br> and <p>
      var match    = href.match(/(http:\/\/localhost:\d+)(\/.*)(<.*)/) || []
        , host     = match[1]
        , path     = match[2]
        , trailing = match[3]
        , link     = '<a href="' + host + path + '" class="added">' + path + '</a>' + trailing;

        text = text.replace(href, link);
    });
    
    // set the text in the comment
    comment.empty();
    comment.append(text);
  })
}

// add the branch commands to the description
var submitter      = $('.timeline-comment-header-text .author').first().text()
  , branch         = $('.gh-header-meta .css-truncate-target').last().text()
  , repo           = ($('meta[name="twitter:title"]').attr('content') || '').replace(/.*\//, '')
  , gitCommands    = 'git checkout -b ' + submitter + '-' + branch + ' master\n<br>git pull git@github.com:' + submitter + '/' + repo + ' ' + branch + '\n<br>'
  , commandButton  = '<div id="gitCommands" class="comment">' + gitCommands + '</div>'

$('.timeline-comment').first().after(commandButton);

