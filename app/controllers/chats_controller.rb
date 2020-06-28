class ChatsController < ApplicationController
  def index
    @chats = current_user.friends
  end
end
