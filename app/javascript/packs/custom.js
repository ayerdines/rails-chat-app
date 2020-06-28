$( document ).on('turbolinks:load', () => {
    $('button#send_msg').on('click', (event) => {
        let chatIdElement = $('.chat_list.active_chat')
        let chatId = parseInt(chatIdElement.data('chat-id'))

        if (!chatId || chatId === 0){
            console.log('No active chats available.')
            $('input#message-box').val('')
            return
        }

        let token = document.getElementsByName('csrf-token')[0].content
        let inputMessage = $('input#message-box').val()

        // make message box empty
        $('input#message-box').val('')

        console.log('sending message: ' + inputMessage)
        $.ajax({
            url: '/messages/send-message',
            method: 'POST',
            data: {
                recipient: chatId,
                message: inputMessage
            },
            headers: {
                'X-CSRF-Token': token
            },
            success: (response) => {
                // Add message in UI after it's sent
                let timeNow = new Date()
                let msgElement = $(`<div class="outgoing_msg">
                                        <div class="sent_msg">
                                        <p>${inputMessage}</p>
                                    <span class="time_date"> ${ timeNow.toUTCString() }</span> </div>
                                    </div>`)
                $('#message-history').append(msgElement)
                // scroll message box to bottom
                $("#message-history").scrollTop($('#message-history')[0].scrollHeight)
            },
            error: (error) => {
                console.log(error.data)
            }
        })
    })

    $('input#message-box').on('keyup', function (event) {
        if (event.keyCode === 13 && !event.shiftKey) {
            $('button#send_msg').trigger('click')
        }
    })

    let update_messages = function (chat_id) {
        let messageBox = $('#message-history')
        messageBox.empty()
        $.ajax({
            url: `/messages-with/${chat_id}`,
            method: 'GET',
            success: function (response, textStatus, jqXHR) {
                $.each(response.messages, function (index, message) {
                    if (message.sent === true) {
                        let msgElement = $(`<div class="outgoing_msg">
                                                <div class="sent_msg">
                                                <p>${message.content}</p>
                                            <span class="time_date"> ${ message.created_at }</span> </div>
                                            </div>`)
                        $('#message-history').append(msgElement)
                    } else {
                        let element = $('<div class="incoming_msg">\n' +
                            '                    <div class="incoming_msg_img"> <img class="rounded-circle z-depth-0"  src="/assets/crop.jpeg" alt="profile"> </div>\n' +
                            '                    <div class="received_msg">\n' +
                            '                    <div class="received_withd_msg">\n' +
                            '                    <p>' + message.content + '</p>\n' +
                            '                <span class="time_date"> '+ message.created_at +' </span></div>\n' +
                            '                </div>\n' +
                            '                </div>')
                        $('#message-history').append(element)
                    }
                })

                $("#message-history").scrollTop($('#message-history')[0].scrollHeight)
            }
        })
    }

    // change active chat
    $('.chat_list').on('click', function () {
        let $this = $(this);
        $this.find('.badge').text("")
        // do nothing if this is already the active chat
        if ($this.hasClass('active_chat')) {
            return
        }
        // remove active_chat class from all elements
        $('.active_chat').each(function (index, element) {
            $(element).removeClass('active_chat');
        })
        // add active_chat class to clicked element
        $this.addClass('active_chat')

        let chatId = parseInt($this.data('chat-id'))
        update_messages(chatId);
    })

    // set first chat as the active one when loading the page
    $('div.chat_list').first().trigger('click')
})