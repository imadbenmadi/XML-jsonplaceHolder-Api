let users_table = [];
let users_id = [];
let Posts_table = [];
const usersContainer = document.querySelector(".users_container");
const messagesContainer = document.querySelector(".messages_container");
var current_userId = 1;

function error_bg(err) {
  document.querySelector(".loading").style.display = "none";
  document.querySelector(".project_container").style.display = "flex";
  document.querySelector("body").style.backgroundColor = "red";
  messagesContainer.style.display = "none";
  document.querySelector(".error_message").style.display = "flex";
  document.querySelector(".err").innerHTML = err;
}


function setActiveStyle(childNumber) {
  const userMenuItems = document.querySelectorAll(".users_container > div");
  userMenuItems.forEach((item, index) => {
    item.style.backgroundColor =
      index === childNumber ? "rgb(163, 212, 255)" : "white";
  });
}

function user_requist_connection(callback) {
  let requist = new XMLHttpRequest();
  requist.open("GET", "https://jsonplaceholder.typicode.com/users");
  requist.responseType = "json";
  requist.onload = function () {
    if (requist.status === 200) {
      callback(requist.response);
    } else {
      let err =
        "Failed to get data from the API 'Api not Exist'. Status: " +
        requist.status;
      error_bg(err);
    }
  };
  requist.onerror = function () {
    let err = "Error: There was a network error while making the API request.";
    error_bg(err);
  };
  try {
    requist.send();
  } catch (e) {
    let err = "Failed to send the API request \n" + e;
    error_bg(err);
  }
}

function Posts_requist_connection(current_userId, callback) {
  let requist = new XMLHttpRequest();
  requist.open(
    "GEt",
    `https://jsonplaceholder.typicode.com/posts?userId=${current_userId}`
  );
  requist.responseType = "json";

  requist.onload = function () {
    // document.querySelector(".loading_messages").style.display="none";
    if (requist.status === 200) {
      callback(requist.response);
    } else {
      let err =
        "Failed to get data from the API 'Api not Exist'. Status: " +
        requist.status;
      error_bg(err);
    }
  };
  requist.onerror = function () {
    let err = "Error: There was a network error while making the API request.";
    error_bg(err);
  };
  try {
    requist.send();
  } catch (e) {
    let err = "Failed to send the API request \n" + e;
    error_bg(err);
  }
}

function initilise_childs_users(callBack) {
  //A great Example of callBack
  user_requist_connection(function (res) {
    for (r of res) {
      users_table.push(r);
      users_id.push(r.id);
    }
    for (const user of users_table) {
      const node = document.createElement("div");
      const br = document.createElement("br");

      const user_name = document.createTextNode(user.name);
      const user_email = document.createTextNode(user.email);
      node.setAttribute("data-id", user.id);
      node.appendChild(user_name);
      node.appendChild(br);
      node.appendChild(user_email);
      usersContainer.appendChild(node);
    }
    setActiveStyle(0);
    const Menu = document.querySelectorAll(".users_container > div");
    Menu.forEach((item, index) => {
      // index represents the index (position) of the current element in the array.
      item.addEventListener("click", function () {
        if (item.getAttribute("data-id") == current_userId) {
          pass;
        }
        let userId = item.getAttribute("data-id");
        setActiveStyle(index);
        current_userId = userId;
        update_content(current_userId);
      });
    });
    callBack(current_userId);
  });
}

function initilise_childs_messages(current_userId) {
  initilise_childs_users(function (current_userId) {
    document.querySelector(".loading").style.display = "none";
    document.querySelector(".project_container").style.display = "flex";
    document.querySelector("body").style.backgroundColor = "white";

    Posts_requist_connection(current_userId, function (res) {
      for (r of res) {
        Posts_table.push(r);
      }

      for (const post of Posts_table) {
        const node = document.createElement("div");
        const hr = document.createElement("hr");

        const post_title = document.createTextNode(post.title);
        const post_body = document.createTextNode(post.body);
        node.appendChild(post_title);
        node.appendChild(hr);
        node.appendChild(post_body);
        messagesContainer.appendChild(node);
      }
    });
  });
}

function update_content(current_userId) {
  // Clear the existing messages content
  messagesContainer.innerHTML = "";

  // Get the posts for the selected user
  Posts_requist_connection(current_userId, function (res) {
    for (const post of res) {
      const node = document.createElement("div");
      const hr = document.createElement("hr");

      const post_title = document.createTextNode(post.title);
      const post_body = document.createTextNode(post.body);
      node.appendChild(post_title);
      node.appendChild(hr);
      node.appendChild(post_body);
      messagesContainer.appendChild(node);
    }
  });
}


if (!navigator.onLine) {
  let err = "Check Your Network Connection !";
  error_bg(err);
  window.addEventListener("online", location.reload());
}
initilise_childs_messages(current_userId);
