window.data = null;
window.currentRoomname = null;
window.username = window.location.search.replace('?username=', '');
window.dmUsername = null;

var app = {
  // server: 'http://parse.sfm8.hackreactor.com/chatterbox/classes/messages?limit=1000&order=-createdAt',
  server: 'http://127.0.0.1:3000/classes/messages',
  init: function() {
    // fetch data from server
    app.fetch();

    // set setInterval to fetch function / execute per 10sec
    setInterval( function() { app.fetch(); }, 1000);

  },
  processing: function() {

    //Get all the Room names in drop down
    var roomnamesObject = {};
    roomnamesObject.roomnameSort = [];

    var friends = {};

    for (let obj of window.data.results) {

      //Creating Roomlist
      var key = String(obj.roomname).trim();
      if (roomnamesObject.hasOwnProperty(key)) {
        roomnamesObject[key] = roomnamesObject[key] + 1;
      } else {
        roomnamesObject[key] = 1;
        roomnamesObject.roomnameSort.push(key);
      }

      //Creating Friendlist
      // check if type of JSON.parse() obj is true
      if ( obj.roomname !== null && obj.roomname !== undefined ) {
        if ( obj.roomname[0] === '{') {
         // if yes, add roomname into friends object
          var friend = JSON.parse(obj.roomname);
          friends[friend.to] = true;
        }
      }
    }

    roomnamesObject.roomnameSort = roomnamesObject.roomnameSort.sort();
    //Need to reset room dropdown
    $('#roomSelect').html('<option value="default"> Pick a room </option>');
    for (let i of roomnamesObject.roomnameSort) {
      app.renderRoom(i);
    }

    if (window.currentRoomname !== null) {
      $('#roomSelect').val(window.currentRoomname);
    } else {
      $('#roomSelect').val('default');
    }

    //Need to reset friends list
    $('#list').html('');
    for (let i of Object.keys(friends)) {
      app.renderFriends(i);
    }

      // if roomname is already selected
        // render messages to selected room
    if (window.currentRoomname !== null) {
      app.renderRoomMessages(window.currentRoomname);
    }

  },
  send: function(message) {
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: this.server,
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Message sent');
        console.log(data);
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message', data);
      }
    });
  },
  fetch: function() {
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: this.server,
      type: 'GET',
      data: JSON,
      contentType: 'application/json',
      success: function (data) {
        data = JSON.parse(data);
        window.data = data;
        app.processing();
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message', data);
      }
    });
  },
  clearMessages: function() {
    $('#chats').html('');
  },
  renderMessage: function(message, cssStyleforMe, newMessage) {
    var element = `<div class="chat ${cssStyleforMe}">
                    <a href=# onclick="app.handleUsernameClick('${message.username}')" class="username ${cssStyleforMe}" data-toggle="modal" data-target="#exampleModal">${message.username}</a>
                    <span class="talk-bubble round ${cssStyleforMe}">${message.text}</span>
                  </div>`;
    if (newMessage !== undefined) {
      $('#chats').prepend(element);
    } else {
      $('#chats').append(element);
    }
  },
  renderFriends: function(friend) {
    var element = `<a href=# onclick="app.handleFriends('${friend}')" class="username">${friend}</a><br>`;
    $('#list').append(element);
  },
  createNewRoom: function() {
    // display popup window to take new chatroom name
    var newRoomname = prompt('Name your new room');

    if (newRoomname !== '') {
    // construct message with:
      // username: me
      // roonname: entered text
      // text: empty
      var message = {
        username: window.username,
        roomname: newRoomname,
        text: ''
      };
    // use app.send method and pass the argument above
      app.send(message);
    // set #roomSelect & global var roomname to entered name
      window.currentRoomname = newRoomname;
    // render new chatroom messages
      app.renderRoomMessages(newRoomname);
    }
  },
  renderRoom: function(roomname) {
    if ( roomname[0] !== '{' && roomname !== '') {
      var element = `<option value="${roomname}">
                      ${roomname}
                    </option>`;
      $('#roomSelect').append(element);
    }
  },
  renderRoomMessages: function(roomname) {
    var count = 0;
    app.clearMessages();
    for (let obj of window.data.results) {
      if ( obj.roomname === roomname && obj.text !== undefined) {
        if ( obj.username !== undefined && app.NOT_TROLL(obj) && obj.text.length > 0) {
          if (obj.username === window.username) {
            app.renderMessage(obj);
            count++;
          } else {
            app.renderMessage(obj, 'others');
            count++;
          }
        }
      }
    }
    if (count === 0) {
      $('#chats').append('<div>Start a Conversation!</div>');
    }
  },
  NOT_TROLL: function(obj) {  //ESCAPING CODE
    if (obj.text.indexOf('<script>') > -1) {
      return false;
    }
    if (obj.username.indexOf('<script>') > -1) {
      return false;
    }
    return true;
  },
  handleUsernameClick: function(username) {
    window.dmUsername = username;
    $('#to').html(`To: <span class="talk-bubble round">${username}</span>`);
    return;
  },
  handleFriends: function(username) {
    app.handleUsernameClick(username);

    // stringify to/friend
    var directMessage = {
      to: username,
      friend: true
    };

    // clear out displayed messages
    // pass it as argument into renderRoomMessages()
    app.renderRoomMessages(JSON.stringify(directMessage));
    window.currentRoomname = JSON.stringify(directMessage);
  },
  handleSubmit: function() {
    console.log('triggered handleSubmit');
    console.log(window.currentRoomname);
    if (window.currentRoomname === null) {
      alert('Please select a room');
      return false;
    }
    if ( $('#message').val() === '' ) {
      alert('What do you want to message?');
      return false;
    }

    var message = {
      username: window.username,
      text: $('#message').val(),
      roomname: window.currentRoomname
    };

    app.send(message);
    app.renderMessage(message, 'me', 'newMessage');
  },
  sendDM: function(to, FRIEND) {
    if ( $('#dm').val() === '' ) {
      alert('What do you want to message?');
      return false;
    }

    var directMessage = {
      to: to,
      friend: FRIEND
    };

    var message = {
      username: window.username,
      text: $('#dm').val(),
      roomname: JSON.stringify(directMessage)
    };
    app.send(message);
  }
};

$(document).ready(function() {

  $('#send .submit').on('submit', function(e) {
    app.handleSubmit();
  });

  $('#send .dmSubmit').on('submit', function(e) {
    alert('dmSubmit');
    app.sendDM(window.dmUsername, true);
  });

  app.init();

  $('#roomSelect').on('change', function(e) {
    if (this.value === 'Pick a room') {
      app.clearMessages();
    } else {
      app.renderRoomMessages(this.value);
    }
    window.currentRoomname = this.value;
  });
});