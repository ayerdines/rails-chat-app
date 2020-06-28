class Message < ApplicationRecord
  default_scope { order(created_at: :asc) }

  after_create :deliver_message

  scope :between, -> (sender_id, recipient_id) do
    where(sender: sender_id, recipient: recipient_id).or(
      where(sender: recipient_id, recipient: sender_id))
  end

  # Deliver message to the recipient after it is created
  def deliver_message
    receiver = User.find(self.recipient)
    MessageSenderJob.perform_later(sender: self.sender, recipient: receiver, message: self.content)
  end

  def created_at
    # format: Sun, 28 Jun 2020 15:03:14 GMT
    self[:created_at].strftime('%a, %d %b %Y %H:%M:%S GMT')
  end
end
