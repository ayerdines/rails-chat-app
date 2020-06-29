class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :invitable, :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable

  validates :username, presence: true, uniqueness: { case_sensitive: false }
  # Only allow letter, number, underscore and punctuation.
  validates_format_of :username, with: /^[a-zA-Z0-9_\.]*$/, :multiline => true
  # Created to allow devise users to login using username
  attr_writer :login

  def login
    @login || self.username || self.email
  end

  # Users invited by self + the user who invited self
  def friends
    User.where('invited_by_id = :id OR id = :invited_by_id', { :id => self.id, :invited_by_id => self.invited_by_id})
  end

  def self.find_first_by_auth_conditions(warden_conditions)
    conditions = warden_conditions.dup
    if (login = conditions.delete(:login))
      where(conditions).where(["lower(username) = :value OR lower(email) = :value", { :value => login.downcase }]).first
    else
      if conditions[:username].nil?
        where(conditions).first
      else
        where(username: conditions[:username]).first
      end
    end
  end

  def messages
    Message.where(sender: id).or(where(recipient: id))
  end

  def last_message_date
  end

  # Disallow user to reset password without accepting the invitation
  # def send_reset_password_instructions
  #   super if invitation_token.nil?
  # end

  def is_online
    redis = Redis.new
    Rails.logger.info "checking is user #{id} is online: " + redis.get("user_#{self.id}")
    redis.get("user_#{self.id}") == 'online'
  end

  def online
    redis = Redis.new
    Rails.logger.info('User set online')
    redis.set("user_#{self.id}", 'online')
  end

  def offline
    redis = Redis.new
    Rails.logger.info('User set offline')
    redis.set("user_#{self.id}", 'offline')
  end
end
