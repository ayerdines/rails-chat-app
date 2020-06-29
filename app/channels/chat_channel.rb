class ChatChannel < ApplicationCable::Channel
  def subscribed
    stream_for current_user
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
    current_user.offline
  end

  def online
    current_user.online
  end

  def offline
    current_user.offline
  end
end
