Rails.application.routes.draw do
  get 'gaze_o_tron/index'

  root to: 'gaze_o_tron#index'

  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
