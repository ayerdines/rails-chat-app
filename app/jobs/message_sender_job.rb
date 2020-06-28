class MessageSenderJob < ApplicationJob
  queue_as :default

  def perform(sender: , recipient: , message: )
    ChatChannel.broadcast_to(
      recipient,
      sent_by: sender,
      message: message
    )
    # Do something later
  end
end
