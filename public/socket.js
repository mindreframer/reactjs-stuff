var socket = io.connect('http://qtserver.herokuapp.com');

(function($, undefined){
  $(document).ready(function(){

    var users = new Users();
    var leaderboard = new Leaderboard();
    var answers = new Answers();
    var user_info = new UserInfo();
    var countdown = new Countdown();
    var notify = new Notify();

    socket.on('answers', function (data) {
      //console.log('answers array', data);
      var tiles = $('.tiles .tile');
      for(var i = 0; i < data.length; i++){
        if(typeof tiles.eq(i).data('flipped') == 'undefined'){
          tiles.eq(i).html('<span class="answer_grey">' + data[i] + '</span>');
        }
      }
    });

    socket.on('game', function (data) {
      //console.log('game', data);
      if(typeof data.title !== 'undefined'){
        if(typeof data.title === null){
          data.title = 'Qu.izTi.me';
        }else{
          $('#question').html(data.title);
        }
        
      }

      if(typeof data.players !== 'undefined'){
        users.createUsers(data.players);
        
        if(user_info.id !== null){
          for(var i = 0; i < data.players.length; i++){
            if(data.players[i].id == user_info.id){
              user_info.update(
                data.players[i].name,
                data.players[i].score,
                i + 1,
                data.players[i].answers.length,
                users
              );
              break;
            }
          }
          
        }

        leaderboard.generate(users, user_info.id);
      }

      if(typeof data.state !== 'undefined'){

        switch(data.state){
          case 'prep':
            if(typeof data.now !== 'undefined' && typeof data.begin !== 'undefined'){
              countdown.start( Math.ceil((data.begin - data.now) /1000));
            }
            enable_fields(false);
            if(typeof data.count !== 'undefined'){
              answers.generate(data.count);
            }
            break;
          case 'ended':
            countdown.game_button();
            enable_fields(false);
            break;
          case 'active':
            if(typeof data.now !== 'undefined' && typeof data.end !== 'undefined'){
              countdown.start( Math.ceil((data.end - data.now) /1000));
            }
            enable_fields(true);
            if(typeof data.count !== 'undefined'){
              answers.generate(data.count);
            }
            break;
        }
      }

      if(typeof data.answers !== 'undefined'){
        for(var i = 0; i < data.answers.length; i++){
          // console.log('loop');
          answers.update_tile(data.answers[i].index, data.answers[i].text, user_info);
        }
      }
    });

    socket.emit('join', function(playerObj){
      user_info.id = playerObj.id;
      user_info.update(playerObj.name, playerObj.score, users);
      // console.log(user_info);
    });

    socket.on('alert', function (data) {
      notify.alert(data);
    });

    //Begin game
    $(document).on('click', '#begin-btn', function(){
      socket.emit('state', 'prep', function(err, res){
        // console.log('sent answer');
        // console.log(res);
        // console.log(err);
      });
    });

    $('#info_bar .username').click(function(){
      $('#username_modal').modal();
    });
    //Answer submit
    // $('#answer-input').keypress(function(e){
    //   if(e.which === 13){
    //     console.log('return');
    //   }
    // });
    $('#answer-btn').click(function(){
      var val = $('#answer-input').val();
      // console.log(val);
      if(val !== ''){
        // console.log('test');
        socket.emit('answer', val);
        $("#answer-input").val('').focus()

      }
    });

    //Username update
    $('#update-btn').click(function(){
      var val = $('#username-input').val();
      if(val !== ''){
        socket.emit('name', val, function(err, res){
          // console.log(res);
        });
      }
    });

  });

function enable_fields(bool){
  var fields = [$('#answer-input'), $('#answer-btn')];
  
  for(var i = 0; i < fields.length; i++){
    var field = fields[i];

    if(bool){
      field.removeAttr('disabled');
    }else{
      field.attr('disabled', 'disabled');
    }
  }

}
var UserInfo = function(){
  this.id = null;
  this.name = null;
  this.score = null;
  this.position = null;
  this.round_score = null;
  this.answers = null

  this.update = function(name, score, position, round_score, users){
    this.name = name;
    this.score = score;
    this.position = position;
    this.round_score = round_score;

    if(typeof users != "undefined"){
      this.answers = users.user_array[this.position -1].answers;
    }

    // console.log('users', users);
    this.update_page();
  };

  this.update_page = function(){
    $('#info_bar .username .username_val').html(this.name);
    $('#info_bar .score .score_val').html(this.round_score);
    $('#info_bar .rank .rank_val').html(this.position);
    $('#username-input').attr('placeholder', this.name);
  }

};
var Notify = function(){

  var self = this;
  this.element = $('#notify');

  this.alert = function(text){
    this.element.html(text);
    this.element.fadeIn();
    setTimeout(function(){
      // console.log('hide');
      self.element.fadeOut();
    }, 3000)
  };
}
var Countdown = function(){
  this.element = $('#answer_container .countdown');

  this.start = function(seconds){
    // console.log('seconds', seconds);
    //console.log(Math.floor(seconds));
    this.element.html('');
    this.element.countdown({
        startTime: Math.floor(seconds).toString(),
        stepTime: 1,
        digitWidth: 53,
        digitHeight: 77,
        image: "assets/img/digits.png"
    });
  };

  this.game_button = function(){
    // console.log('game button');
    this.element.html(
      $('<button>', {'id': 'begin-btn', 'class': 'btn btn-large btn-primary'}).html('Next')
    );
  };
}
var Answers = function(){
  this.element = $('ul.tiles');

  this.generate = function(count){
    
    this.element.html('');

    // console.log('generate');

    for(var i = 0; i < count; i++){
      this.element.append($('<li>', {'class': 'tile'}));
    }
  };

  this.update_tile = function(i, text, user_info){
    // console.log('updating!');
    // console.log(i, text);
    // console.log(this.element.find('.tile').eq(i).html('test'));
    
    this.element.find('.tile').eq(i).html(text);

    // console.log('answers', user_info.answers);

    var color = '#242E39';
    if(typeof user_info != 'undefined'){
      // console.log('test', i, user_info.answers);
      if( $.inArray(i, user_info.answers) !== -1){
        color = '#0044cc';
      }
    }

    if(typeof this.element.find('.tile').eq(i).data('flipped') == 'undefined'){
      this.element.find('.tile').eq(i).flip({
         direction: 'bt',
         content: text,
         color: color,
         speed: 200
       });
      this.element.find('.tile').eq(i).data('flipped', true);
    }
  }
};
var Leaderboard = function(){

  this.element = $('table.leaders tbody');

  this.generate = function(users, id){
    this.element.html('');
    //var changed_elements = [];
    //users.user_array = users.user_array.sort(function(a,b){return b.score - a.score});
    //console.log(users.user_array.sort());
    var max = users.user_array.length < 10 ? users.user_array.length : 10;
    for(var i = 0; i < max; i++){
      var name = users.user_array[i].name;
      if(users.user_array[i].id === id){
        name = '<strong>' + name + '</strong>';
      }
      this.element.append(
        $('<tr>').append(
          $('<td>').html(i + 1),
          $('<td>').html(name),
          $('<td>').append( $('<span>', {'class': 'badge ' + this.get_badge_class(i)}).append(users.user_array[i].answers.length) )
        )
      );
    }
  };

  this.update = function(){

  };

  this.field_change = function(i, users){
    this.element.find('tr').eq(i).animate({
      'opacity': 0,
    }, 300, function(){
      var rows = $(this).find('td');
      rows.eq(1).html(users.user_array[i].name);
      rows.eq(2).find('span').html(users.user_array[i].score);
    }).animate({
      'opacity': 1
    }, 300);
  };

  this.get_badge_class = function(i){
    switch(i){
      case 0:
        return 'badge-success';
      break;
      case 1:
        return 'badge-warning';
      break;
      case 2:
        return 'badge-important';
      break;
    }
  };
};

var Users = function(){
  this.user_array = [];

  this.createUsers = function(users){
    this.user_array = [];
    for(var i = 0; i < users.length; i++){
      this.createUser(users[i].id, users[i].name, users[i].answers, users[i].score);
    }
  }
  this.createUser = function(id, name, answers, score){
    var user = {
      id: id,
      name: name,
      answers: answers,
      score: score
    }
    this.user_array.push(user);
  };
};
})(jQuery);