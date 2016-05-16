function saveUserData(username, password,host, response) {
    var email = response.emailAddress;
    var name = response.name;
    var avatarImage = response.avatarUrls['48x48'];

    chrome.storage.sync.set({'host':host, 'username':username,'password':password, 
                            'email':email, 'name':name, 
                            'avatarImage':avatarImage}, function() {
        console.log("Information saved");
    })
}




function getUserInfo(host, username, password) {
    qwest.get(host+'/rest/api/2/myself', null, {'user':username,'password':password }).then(function(xhr, response) {
        console.log(JSON.stringify(response));
        saveUserData(username, password, host, response);
        window.location.href="issues.html"
    })
}

function submitLogin() {
    var host = document.getElementById('host').value;
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;
    getUserInfo(host, username, password);
}
document.getElementById("login").addEventListener("click", submitLogin);

    chrome.storage.sync.get(['host', 'username', 'password'], function(res) {
        if(!res.username) return;
        window.location.href="issues.html";
    });
