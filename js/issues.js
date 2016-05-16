function getIssueDetails(issue) {
    console.log(issue);
    var issue_json =  {'key':issue['key'], 'url':issue['self'], 'summary':issue['fields']['summary'], 'status':issue['fields']['status']['name']};
    console.log(issue_json);
    return issue_json;
}

function makeIssueElement(issue_detail, i) {
    var element = document.createElement('DIV');
    element.setAttribute('id', ''+i);
    element.className +=" row issue";
    element.innerHTML= '<div class="col-xs-8" >'+issue_detail['summary']+'</div><div class="col-xs-4">'+ issue_detail['key']+'</div>';
    element.addEventListener("click", function(){
        chrome.tabs.create({url:window.host+'/browse/'+issue_detail['key']});
    })
    return element;
}

function displayIssues(res) {
    var container = document.getElementById('issues-wrapper');
    var issues = res['issues'];
    console.log(issues);
    console.log(issues.length);
    for(var i = 0; i < issues.length; i++) {
        console.log("In Issue loop");
        var issue_detail = getIssueDetails(issues[i]);
    console.log(issue_detail);
        container.appendChild(makeIssueElement(issue_detail, i));
    }
}

function fetchOpenIssues(host, username, password) {
    var jqlOpenIssues = "assignee = currentUser() AND resolution = Unresolved order by updated DESC";
    qwest.post(host+'/rest/api/2/search', {"jql":jqlOpenIssues,"startAt": 0,
    "maxResults": 15,
    "fields": [
        "summary",
        "status",
        "assignee"
    ]}, {'user':username, 'password':password, 'dataType':'json','headers':{ 'Content-Type':'application/json', 'Accept':'application/json'}}).then(function(xhr, res) {
        displayIssues(res);

    })
}
    chrome.storage.sync.get(['host', 'username', 'password'], function(res) {
        window.host =res.host;
        console.log(res);
fetchOpenIssues(res.host, res.username, res.password);
    });
