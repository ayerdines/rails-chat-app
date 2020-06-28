class MessagesController < ApplicationController
  def between
    @recipient_id = params[:recipient_id]
    @messages = Message.between(current_user.id, @recipient_id).as_json
    @messages.map do |message|
      message[:sent] = (current_user.id == message['sender'])
      message
    end
    render json: { messages: @messages }
  end

  def send_message
    Message.create!(sender: current_user.id, recipient: params[:recipient], content: params[:message])
    render json: {message: 'Successful'}, status: :ok
  end
end
