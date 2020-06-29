import consumer from "./consumer"

const chatChannel = consumer.subscriptions.create("ChatChannel", {
  connected() {
    // Called when the subscription is ready for use on the server
    console.log('channel connected')
    this.online()
  },

  disconnected() {
    // Called when the subscription has been terminated by the server
    console.log('channel disconnected')
    this.offline()
  },

  online() {
    this.perform('online')
  },

  offline() {
    this.perform('offline')
  },

  received(data) {
    console.log('message received: ' + data['sent_by'] + "; " + data['message'])

    let chatIdElement = $('.chat_list')
    $.each(chatIdElement, function (index, element) {
      let $element = $(element)
      let chatId = parseInt($element.data('chat-id'))
      if (chatId == data['sent_by']) {

        let notificationBadge = $element.find('.badge')
        let initialValue = parseInt(notificationBadge.text())
        if (!initialValue) {
          notificationBadge.text(1)
        } else {
          notificationBadge.text(initialValue + 1)
        }

      }
    })
    // Called when there's incoming data on the websocket for this channel
    let timeNow = new Date()
    let element = $('<div class="incoming_msg">\n' +
        '                    <div class="incoming_msg_img"> <img class="rounded-circle z-depth-0" src="/assets/crop.jpeg" alt="sunil"> </div>\n' +
        '                    <div class="received_msg">\n' +
        '                    <div class="received_withd_msg">\n' +
        '                    <p>' + data['message'] + '</p>\n' +
        '                <span class="time_date"> '+ timeNow.toUTCString() +' </span></div>\n' +
        '                </div>\n' +
        '                </div>')
    // append received message
    $('#message-history').append(element)
    // scroll message box to bottom
    $("#message-history").scrollTop($('#message-history')[0].scrollHeight)
  }
});
