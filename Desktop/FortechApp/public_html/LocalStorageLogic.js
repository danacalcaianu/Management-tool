/* global message, dvcontainer */

//Show errors in browser
window.onerror = function (msg, url, linenumber) {
    alert('Error message: ' + msg + '\nURL: ' + url + '\nLine Number: ' + linenumber);
    return true;
};

var user = {
    id: 0,
    name: "",
    saveUser: function ()
    {
        //Read the user input
        var userinput = document.getElementById("txtuser").value;
        //Create a new user
        user.id = Math.floor(Math.random() * (1000 - 1 + 1)) + 1;
        user.name = userinput;
        //Validate user input and check if the username exists
        if (localStorage.getItem("user_" + user.name) && userinput !== "")
        {
            message.innerHTML = "<h3>The username already exists!</h3>";
        }
        else if (userinput === "")
        {
            message.innerHTML = "<h3>Please enter a username!</h3>";
        }
        else {
            localStorage.setItem("user_" + user.name, JSON.stringify(user));
            message.innerHTML = "<h3>User created!</h3>";
        }
    },
    loginUser: function ()
    {
        var userAccountInput = document.getElementById("useraccount").value;
        var storedUser = "user_" + userAccountInput;
        storedUser = storedUser.replace(/^\s+|\s+$/g, "");
        //Check if user exists and set it as the current user
        if (localStorage.getItem(storedUser))
        {
            localStorage.setItem("user", localStorage.getItem(storedUser));
            message.innerHTML = "<h3>Logged in!</h3>";
        }
        else
        {
            message.innerHTML = "<h3>The account doesn't exist!</h3>";
        }
    }
};

//The issue Object 
var issue = {
    id: 0,
    type: "",
    name: "",
    sprint: "",
    createdBy: "",
    asignee: 0,
    description: "",
    status: "",
    tasks: "",
    comments: "",
    updatedAt: "",
    createdAt: "",
    saveissue: function ()
    {
        //prepare the date variable
        var dateObj = new Date();
        var month = dateObj.getUTCMonth() + 1; //months from 1-12
        var day = dateObj.getUTCDate();
        var year = dateObj.getUTCFullYear();
        newdate = year + "/" + month + "/" + day;
        //prepare the user variable
	if(localStorage.getItem("user"))
	{
        var user = JSON.parse(localStorage.getItem("user"));
        //Read all elements on UI using class name 
        var inputs = document.getElementsByClassName("c1");
        issue.id = Math.floor(Math.random() * (1000 - 1 + 1)) + 1;
        issue.type = inputs[1].value;
        issue.name = inputs[2].value;
        issue.sprint = document.getElementById('txtsprint').value;
        issue.createdBy = user["id"];
        issue.asignee = document.getElementById('txtasignee').value;
        issue.description = document.getElementById('txtdescription').value;
        issue.status = "New";
        //get values from the checkbox
        var checkedValue = [];
        var inputElements = document.getElementsByClassName('checkboxmsg');
        for (var i = 0; inputElements[i]; ++i) {
            if (inputElements[i].checked) {
                checkedValue.push(inputElements[i].name);
            }
        }
        issue.tasks = checkedValue;
        issue.comments = document.getElementById('txtcomment').value;
        issue.updatedAt = newdate;
        issue.createdAt = newdate;
        //Convert the object into JSON and store it in LocalStorage 
        localStorage.setItem("issue_" + issue.name, JSON.stringify(issue));
        //Reload the Page 
        location.reload();
	}
	else
	{
		alert("Please log in to submit an issue!");
	}
    },
    updateitem: function ()
    {
        //prepare date variable
        var dateObj = new Date();
        var month = dateObj.getUTCMonth() + 1; //months from 1-12
        var day = dateObj.getUTCDate();
        var year = dateObj.getUTCFullYear();
        newdate = year + "/" + month + "/" + day;
        //prepare the user variable
        var user = JSON.parse(localStorage.getItem("user"));
        //Read all elements on UI using class name 
        var test = document.getElementsByClassName("update");
        var whatuser = document.getElementById("txtissueid").value;
        issue = JSON.parse(localStorage.getItem(whatuser));
        issue.id = issue.id;
        issue.type = test[1].value;
        //if name is not empty(it changed),save the new one,otherwise keep the old one
        if (document.getElementById("updatename").value != "")
        {
            issue.name = document.getElementById("updatename").value;
        }
        var issuename = "issue_" + issue.name;
        var issueobject = JSON.parse(localStorage.getItem(issuename));
        //if the user changed the sprint of an issue,move the subtasks also
        //if the user didnt change the sprint and left the boxes empty,keep the old values,else store the new ones
        if (issueobject.sprint != document.getElementById("updatesprint").value)
        {
            issue.tasks = issueobject.tasks;
        }
        else
        {
            var checkedValue = [];
            var inputElements = document.getElementsByClassName('checkboxmsg');
            for (var i = 0; inputElements[i]; ++i) {
                if (inputElements[i].checked) {
                    checkedValue.push(inputElements[i].name);
                }
            }
            if (checkedValue != null)
            {
                issue.tasks = checkedValue;
            }
          
        }
        issue.sprint = document.getElementById("updatesprint").value;
        issue.asignee = test[4].value;
        if (document.getElementById("updatedescription").value != "")
        {
            issue.description = test[5].value;
        }
        //if the user changed the status from new to any other,change the subtasks status also
        issue.status = document.getElementById("updatestatus").value
        if (issue.status != "New")
        {
            for (var i = 0; issue.tasks[i]; ++i)
            {
                issuename = "issue_" + issue.tasks[i];
                object = JSON.parse(localStorage.getItem(issuename));

                object.status = issue.status;
                localStorage.setItem(issuename, JSON.stringify(object));
                alert(object.status);
            }
        }
        issue.comments = test[8].value;
        issue.updatedAt = newdate;
        //Convert the object into JSON and store it in LocalStorage 
        localStorage.setItem(whatuser, JSON.stringify(issue));
        //Reload the Page 
        location.reload();
    }
};
var project = {
    id: 0,
    sprints: [
        {
            id: 1,
            name: "sprint1"
        },
        {
            id: 2,
            name: "sprint2"
        },
        {
            id: 3,
            name: "sprint3"
        }
    ],
    //show the initial sprints
    showData: function () {
        var result = "<table border='1'>";
        result += "<tr><th>Project</th></tr>";
        var i = 0;
        while (this.sprints[i]) {
            localStorage.setItem(this.sprints[i].name, this.sprints[i].id);
            i++;
        }
        for (i = 0; i < window.localStorage.length; i++) {
            keys = window.localStorage.key(i);

            if (keys.slice(0, 6) === "sprint") {
                result += "<td>" + keys + "</td>";
            }
        }
        projects.innerHTML = result;
    }
};
//save the new sprints
function savesprint()
{
    sprintname = document.getElementById("txtsprintsave").value;
    sprintid = Math.floor(Math.random() * (1000 - 1 + 1)) + 1;
    var sprint1 = new sprint(sprintname, sprintid);
    localStorage.setItem("sprint_" + sprintname, sprintid);
    location.reload();
}
function sprint(name, id) {
    this.id = id;
    this.name = name;
}
//call the function on reload to display the new sprints everytime the user adds a new one
project.showData();
//JavaScript object containing methods for LocalStorage management 
var applogic = {
//Method to Read Data from the local Storage (display the table with data)
    loaddata: function () {
        var result = 0;
        for (i = 0; i < window.localStorage.length; i++) {
            key = window.localStorage.key(i);
            if (key.slice(0, 5) === "issue") {
                result++;
            }
        }
        var datacount = result;
        if (datacount > 0)
        {
            var render = "<table border='1'>";
            render += "<tr><th>Id</th><th>Type</th><th>Name</th><th>Sprint</th><th>createdby</th><th>asignee</th><th>description</th><th>status</th> <th>tasks</th><th>comments</th><th>updatedAt</th><th>createdat</th></tr>";
            for (i = 0; i < datacount; i++) {
                var key = localStorage.key(i); //Get  the Key 
                var issue = localStorage.getItem(key); //Get Data from Key 
                var data = JSON.parse(issue); //Parse the Data back into the object 
                render += "<tr><td>" + data.id + "</td><td>" + data.type + " </td>";
                render += "<td>" + data.name + "</td>";
                render += "<td>" + data.sprint + "</td>";
                render += "<td>" + data.createdBy + "</td>";
                render += "<td>" + data.asignee + "</td>";
                render += "<td>" + data.description + "</td>";
                render += "<td>" + data.status + "</td>";
                render += "<td>" + data.tasks + "</td>";
                render += "<td>" + data.comments + "</td>";
                render += "<td>" + data.updatedAt + "</td>";
                render += "<td>" + data.createdAt + "</td></tr>";
            }
            render += "</table>";
            dvcontainer.innerHTML = render;
        }
    },
//Method to Clear Storage 
    clearstorage: function () {
        //Get the Storage Count 
        var storagecount = localStorage.length;
        //Clear the storage
        if (storagecount > 0)
        {
            for (i = 0; i < storagecount; i++) {
                localStorage.clear();
            }
        }
        window.location.reload();
    }
};
//Save issue into the localstorage 
var btnsave = document.getElementById('btnsave');
btnsave.addEventListener('click', issue.saveissue, false);
//Update issue into the localstorage 
var btnupdate = document.getElementById('btnupdate');
btnupdate.addEventListener('click', issue.updateitem, false);
//Clear LocalStorage 
var btnclearstorage = document.getElementById('btnclearstorage');
btnclearstorage.addEventListener('click', applogic.clearstorage, false);
//save sprint
var savesprintbtn = document.getElementById('savesprintbtn');
savesprintbtn.addEventListener('click', savesprint, false);
//On Load of window load data from local storage 
window.onload = function () {
    applogic.loaddata();
};
//function to hide a div
function hideDiv(a)
{
    document.getElementById(a).style.display = "none";
}
//function to display a div
function showDiv(a) {
    document.getElementById(a).style.display = "block";
}
//load all the issues stored,for the select form
function putselect() {
    var select = document.getElementById("txtissueid");
    var result = 0;
    for (i = 0; i < window.localStorage.length; i++) {
        keys = window.localStorage.key(i);
        if (keys.slice(0, 5) === "issue") {
            result = keys;
            result2 = JSON.parse(localStorage.getItem(result));
            result3 = result2.name;

            select.options[select.options.length] = new Option(result3, result);
        }
    }
}
//load all the sprints for the select forms
function putselectsprint()
{
    var select = document.getElementById("txtsprint");
    var result = 0;
    for (i = 0; i < window.localStorage.length; i++) {
        keys = window.localStorage.key(i);
        if (keys.slice(0, 6) === "sprint") {
            result = keys;
            result2 = JSON.parse(localStorage.getItem(result));
            select.options[select.options.length] = new Option(result, result2);
        }
    }
}
function putselectsprint2()
{
    var select = document.getElementById("updatesprint");
    var result = 0;
    for (i = 0; i < window.localStorage.length; i++) {
        keys = window.localStorage.key(i);
        if (keys.slice(0, 6) === "sprint") {
            result = keys;
            result2 = JSON.parse(localStorage.getItem(result));
            select.options[select.options.length] = new Option(result, result2);
        }
    }
}
//function for the filter button
function checkinput()
{
    if (document.getElementById('filterchoice').value === "1")
    {
        putselectsprinthere();
        showDiv('filterselectdiv');
    }
    else
    {
        showDiv('filterselectdiv2');
    }
}
function putselectsprinthere()
{
    var select = document.getElementById('filterselect');
    var result = 0;
    for (i = 0; i < window.localStorage.length; i++) {
        keys = window.localStorage.key(i);
        if (keys.slice(0, 6) === "sprint") {
            result = keys;
            result2 = JSON.parse(localStorage.getItem(result));
            select.options[select.options.length] = new Option(result, result2);
        }
    }
}
//filter issues by status and display them
function filterbystatus()
{
    var result = 0;
    for (i = 0; i < window.localStorage.length; i++) {
        key = window.localStorage.key(i);
        if (key.slice(0, 5) === "issue") {
            result++;
        }
    }
    var datacount = result;
    if (datacount > 0)
    {
        var render = "<table border='1'>";
        render += "<tr><th>Id</th><th>Type</th><th>Name</th><th>Sprint id</th><th>createdby</th><th>asignee</th><th>description</th><th>status</th> <th>tasks</th><th>comments</th><th>updatedAt</th><th>createdat</th></tr>";
        for (i = 0; i < datacount; i++) {
            var key = localStorage.key(i); //Get  the Key 
            var issue = localStorage.getItem(key); //Get Data from Key 
            var data = JSON.parse(issue); //Parse the Data back into the object 
            if (data.status == document.getElementById('filterselect2').value)
            {

                render += "<tr><td>" + data.id + "</td><td>" + data.type + " </td>";
                render += "<td>" + data.name + "</td>";
                render += "<td>" + data.sprint + "</td>";
                render += "<td>" + data.createdBy + "</td>";
                render += "<td>" + data.asignee + "</td>";
                render += "<td>" + data.description + "</td>";
                render += "<td>" + data.status + "</td>";
                render += "<td>" + data.tasks + "</td>";
                render += "<td>" + data.comments + "</td>";
                render += "<td>" + data.updatedAt + "</td>";
                render += "<td>" + data.createdAt + "</td></tr>";
            }
        }
        render += "</table>";
        filteredtable.innerHTML = render;
    }
}
//filter issues by sprint and display them
function filterbysprint()
{
    var result = 0;
    for (i = 0; i < window.localStorage.length; i++) {
        key = window.localStorage.key(i);
        if (key.slice(0, 5) === "issue") {
            result++;
        }
    }
    var datacount = result;
    if (datacount > 0)
    {
        var render = "<table border='1'>";
        render += "<tr><th>Id</th><th>Type</th><th>Name</th><th>Sprint id</th><th>createdby</th><th>asignee</th><th>description</th><th>status</th> <th>subtasks</th><th>comments</th><th>updatedAt</th><th>createdat</th></tr>";
        for (i = 0; i < datacount; i++) {
            var key = localStorage.key(i); //Get  the Key 
            var issue = localStorage.getItem(key); //Get Data from Key 
            var data = JSON.parse(issue); //Parse the Data back into the object 
            if (data.sprint == document.getElementById('filterselect').value)
            {

                render += "<tr><td>" + data.id + "</td><td>" + data.type + " </td>";
                render += "<td>" + data.name + "</td>";
                render += "<td>" + data.sprint + "</td>";
                render += "<td>" + data.createdBy + "</td>";
                render += "<td>" + data.asignee + "</td>";
                render += "<td>" + data.description + "</td>";
                render += "<td>" + data.status + "</td>";
                render += "<td>" + data.tasks + "</td>";
                render += "<td>" + data.comments + "</td>";
                render += "<td>" + data.updatedAt + "</td>";
                render += "<td>" + data.createdAt + "</td></tr>";
            }
        }
        render += "</table>";
        filteredtable.innerHTML = render;
    }
}
//populate the checkbox with all the available 
function populate(slct2) {

    var s2 = document.getElementById(slct2);
    s2.innerHTML = "";
    var result3 = "";
    var result = 0;
    for (i = 0; i < window.localStorage.length; i++) {
        keys = window.localStorage.key(i);
        if (keys.slice(0, 5) === "issue") {
            result = keys;
            result2 = JSON.parse(localStorage.getItem(result));
            result3 = result2.name;
            var pair = result3;
            var checkbox = document.createElement("input");

            checkbox.type = "checkbox";
            checkbox.className = "checkboxmsg";
            checkbox.name = pair;
            checkbox.value = pair;
            s2.appendChild(checkbox);

            var label = document.createElement('label');
            label.htmlFor = pair;
            label.appendChild(document.createTextNode(pair));

            s2.appendChild(label);
            s2.appendChild(document.createElement("br"));

        }
    }
}
