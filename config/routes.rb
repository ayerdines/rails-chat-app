Rails.application.routes.draw do
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
  devise_for :users, controllers: {
    invitations: "invitations"
  }
  root to: 'chats#index'

  post '/messages/send-message', to: 'messages#send_message'

  # get message between users
  get '/messages-with/:recipient_id', to: 'messages#between'
end
