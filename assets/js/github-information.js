// This function returns the users display name, avatar, followers, following and repos.
function userInformationHTML(user) {
  return `
        <h2>${user.name}
            <span class="small-name">
                (@<a href="${user.html_url}" target="_blank">${user.login}</a>)
            </span>
        </h2>
        <div class="gh-content">
            <div class="gh-avatar">
                <a href="${user.html_url}" target="_blank">
                    <img src="${user.avatar_url}" width="80" height="80" alt="${user.login}" />
                </a>
            </div>
            <p>Followers: ${user.followers} - Following ${user.following} <br> Repos: ${user.public_repos}</p>
        </div>`;
}

// Rendering for the users repos to be displayed
function repoInformationHTML(repos) {
  if (repos.length == 0) {
    return `<div class="clearfix repo-list">No repos!</div>`;
  }

  var listItemsHTML = repos.map(function (repo) {
    return `<li>
                    <a href="${repo.html_url}" target="_blank">${repo.name}</a>
                </li>`;
  });

  return `<div class="clearfix repo-list">
                <p>
                    <strong>Repo List:</strong>
                </p>
                <ul>
                    ${listItemsHTML.join("\n")}
                </ul>
            </div>`;
}

// This function checks if there is a username entered in to the text area.
// If not it asks the user to enter a username
// It also first clears the user data and repo divs
function fetchGitHubInformation(event) {
  $("#gh-user-data").html("");
  $("#gh-repo-data").html("");

  var username = $("#gh-username").val();
  if (!username) {
    $("#gh-user-data").html(`<h2>Please enter a GitHub username</h2>`);
    return;
  }

  // This displays the loading.gif
  $("#gh-user-data").html(
    `<div id="loader">
            <img src="assets/css/loader.gif" alt="loading..." />
        </div>`
  );

  // When a valid GitHub username is entered, th information will be stored in the variable UserInformationHTML
  // If the username is not valid and returns an error 404, the error message "No info found for user..." will be displayed
  // If there error is not a 404, the error will be console logged then displayed to the user
  $.when(
    $.getJSON(`https://api.github.com/users/${username}`),
    $.getJSON(`https://api.github.com/users/${username}/repos`)
  ).then(
    function (firstResponse, secondResponse) {
      var userData = firstResponse[0];
      var repoData = secondResponse[0];
      $("#gh-user-data").html(userInformationHTML(userData));
      $("#gh-repo-data").html(repoInformationHTML(repoData));
    },
    function (errorResponse) {
      if (errorResponse.status === 404) {
        $("#gh-user-data").html(`<h2>No info found for user ${username}</h2>`);
      } else {
        console.log(errorResponse);
        $("#gh-user-data").html(
          `<h2>Error: ${errorResponse.responseJSON.message}</h2>`
        );
      }
    }
  );
}

// This loads the Octocat profile on first page load
$(document).ready(fetchGitHubInformation);
